(function () {
	"use strict";

	/*
	 * Sets up the various event listeners on the page, including
	 * click and dragging behavior for each puzzle grid square and
	 * the functionality for clearing a puzzle state.
	 */
	var mutex_lock = false;
	window.onload = function () {
		$("login_btn").addEventListener("click", login);
		$("signup_btn").addEventListener("click", register);
		check();
	};
	/*
	  * Comment: Update function for button click
	*/
	function login() {
		console.log("click login");
		if (!mutex_lock) {
			mutex_lock = true;
			// send out working list
			var data_send = {
				request: "LOGIN",
				username: $("Username").value,
				password: $("Password").value
			}
			login_send(data_send, function (data_got) {
				if (data_got) {
					console.log(data_got);
					if (data_got.result) {
						write_output_log(data_got.message);
						window.location.href = "index.html";
					}
					else {
						write_output_log("Error is " + data_got.message);
					}
				} else {
					write_output_log("Request Login send failed");
				}
				mutex_lock = false;
			});
		}
	}
	function login_send(data_send, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'server.php', true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function () {
			if (xhr.status >= 200 && xhr.status < 400) {
				var response = JSON.parse(xhr.responseText);
				callback(response);
			} else {
				console.error("Error: " + xhr.status);
				callback(null);
			}
		};
		xhr.send(JSON.stringify(data_send));
	}
	function register() {
		console.log("click register");
		if (!mutex_lock) {
			mutex_lock = true;
			// send out working list
			var data_send = {
				request: "REGISTER",
				username: $("Username").value,
				password: $("Password").value
			}
			register_send(data_send, function (data_got) {
				if (data_got) {
					if (data_got.result) {
						write_output_log(data_got.message);
						window.location.href = "index.html";
					}
					else {
						write_output_log("Error is " + data_got.message);
					}
				} else {
					write_output_log("Request Resister send failed");
				}
				mutex_lock = false;
			});
		}
	}
	function register_send(data_send, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'server.php', true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function () {
			if (xhr.status >= 200 && xhr.status < 400) {
				var response = JSON.parse(xhr.responseText);
				callback(response);
			} else {
				console.error("Error: " + xhr.status);
				callback(null);
			}
		};
		xhr.send(JSON.stringify(data_send));
	}
	/*
	  * Comment: Update function for button click
	*/
	function check_send(data_send, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", 'server.php', true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xhr.onload = function () {
			if (xhr.status >= 200 && xhr.status < 400) {
				var response = JSON.parse(xhr.responseText);
				callback(response);
			} else {
				console.error("Error: " + xhr.status);
				callback(null);
			}
		};
		xhr.send(JSON.stringify(data_send));
	}

	function check() {
		var data_send = {
			request: "CHECK",
		}
		check_send(data_send, function (data_got) {
			console.log(data_got);
			if (data_got.result)
				window.location.href = "index.html";
		});
	}
	function write_output_log(str) {
		$("error-msg").innerHTML = str;
	}

	/**  
	 * Returns the element that has the ID attribute with the specified value.
	 * @param {string} id - element ID
	 * @return {object} DOM object associated with id.
	 */
	function $(id) {
		return document.getElementById(id);
	}

	/**
	 * Returns the array of elements that match the given CSS selector.
	 * @param {string} query - CSS query selector
	 * @return {object[]} array of DOM objects matching the query.
	 */
	function $$(query) {
		return document.querySelectorAll(query);
	}
})();