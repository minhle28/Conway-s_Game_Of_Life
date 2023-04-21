(function () {
	"use strict";
	window.onload = function () {
		check();
		$("logout-btn").addEventListener("click", logout);
	};
	function request_send(data_send, callback) {
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
		request_send(data_send, function (data_got) {
			console.log(data_got);
			if (!data_got.result)
				window.location.href = "login.html";
		});
	}
	function logout(){
		var data_send = {
			request: "LOGOUT",
		}
		request_send(data_send, function (data_got) {
			console.log(data_got);
			if (data_got.result)
				window.location.href = "login.html";
		});
	}
	function $(id) {
		return document.getElementById(id);
	}
})();