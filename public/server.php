<?php
session_start();
// get connection
$host = "localhost";
$user = "mle38";
$pass = "mle38";
$dbname = "mle38";
// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

$message = array();
// Check connection

if ($conn->connect_error) {
    // Connect fail
    $message = array(
        'result' => false,
        'message' => "Connection failed: " . $conn->connect_error
    );
} else {

    $data_got = json_decode(file_get_contents('php://input'));
    if ($data_got && $data_got->request) {
        $request = $data_got->request;
        if (strcmp($request, "LOGIN") === 0) {
            $message = login($conn, $data_got->username, $data_got->password);
        } else if (strcmp($request, "CHECK") === 0) {
            $message = check();
        } else if (strcmp($request, "REGISTER") === 0) {
            $message = register($conn, $data_got->username, $data_got->password);
        } else if (strcmp($request, "LOGOUT") === 0) {
            session_destroy();
            $message = array(
                'result' => true,
                'message' => 'Logout'
            );
        } else {
            // Error message 
            $message = array(
                'result' => false,
                'message' => 'Failed input.'
            );
        }
    } else
        $message = array(
            'result' => false,
            'message' => 'Failed get request.'
        );
}
// clean up and send output
$conn->close();
echo json_encode($message);

/////////////////////////////////////  Function section ////////////////////////////

function login($conn, $username, $password)
{
    $query = "SHOW TABLES LIKE 'CONWAYS'";
    $result = $conn->query($query);
    if (!$result) {
        $message = array(
            'result' => false,
            'message' => 'Error L1: ' . $conn->error
        );
        return $message;
    }
    if ($result->num_rows === 0) {
        // Table not exist, create one
        $query = "CREATE TABLE IF NOT EXISTS `CONWAYS` (
                `username` VARCHAR(50),
                `password` VARCHAR(50),
                PRIMARY KEY (`username`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        $conn->query($query);
        $message = array(
            'result' => false,
            'message' => 'Error L2: Please try again ' . $conn->error
        );
        return $message;
    }

    // get user       
    $query = "SELECT * FROM `CONWAYS` WHERE `username` = ? AND `password` = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ss", $username, $password);
    $stmt->execute();
    $result = $stmt->get_result();
    if (!$result) {
        $message = array(
            'result' => false,
            'message' => 'Error L3: ' . $conn->error
        );
        return $message;
    }
    // not found
    if ($result->num_rows === 0) {
        $message = array(
            'result' => false,
            'message' => 'Username not found or Wrong Password'
        );
        return $message;
    } else {
        // Fetch results as associative array
        $message = array(
            'result' => true,
            'message' => "Login Successful",
        );
        $_SESSION['UserData'] = $username;
    }
    return $message;
}
function register($conn, $username, $password)
{
    $query = "SHOW TABLES LIKE 'CONWAYS'";
    $result = $conn->query($query);
    if (!$result) {
        $message = array(
            'result' => false,
            'message' => 'Error R1: ' . $conn->error
        );
        return $message;
    }
    if ($result->num_rows === 0) {
        // Table not exist, create one
        $query = "CREATE TABLE IF NOT EXISTS `CONWAYS` (
                `username` VARCHAR(50),
                `password` VARCHAR(50),
                PRIMARY KEY (`username`)
              ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        $result = $conn->query($query);
        if (!$result) {
            $message = array(
                'result' => false,
                'message' => 'Error R2: ' . $conn->error
            );
            return $message;
        }
    }

    // check if exist

    $query =  "SELECT * FROM `CONWAYS` WHERE `username` = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    // query 1 error 
    if (!$result) {
        $message = array(
            'result' => false,
            'message' => 'Error R3: ' . $conn->error
        );
        return $message;
    }
    // check result    
    if ($result->num_rows > 0) {
        $message = array(
            'result' => false,
            'message' => 'User existed.'
        );
        return $message;
    } else {
        // insert user      
        $query = "INSERT INTO `CONWAYS` (`username`, `password`) VALUES (?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $username, $password);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $message = array(
                'result' => true,
                'message' => 'Created new user'
            );
            $_SESSION['UserData'] = $username;
            return $message;
        } else {
            $message = array(
                'result' => false,
                'message' => 'Error R4. ' . $conn->error
            );
            return $message;
        }
    }
}
function check()
{
    $message = array(
        'result' => isset($_SESSION['UserData'])
    );
    return $message;
}
