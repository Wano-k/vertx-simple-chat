window.onload = function () {

	// Loading event bus
	var eb = new EventBus("/eventbus/");

	// Getting the useful elements
	var inputUserName = document.querySelector("input[name=inputUserName]");
	var buttonJoinRoom = document.getElementById("buttonJoinRoom");
	var errorUserName = document.getElementById("errorUserName");
	var containerChat = document.getElementById("containerChat");

	// Show / Hide specific elements
	buttonJoinRoom.disabled = false;
	$('#containerJoin').show();
	$('#containerChat').hide();

	// [join] When a user wants to join the chat
	function joinRoom() {
		var userName = inputUserName.value;

		if (userName.length > 0) {
			buttonJoinRoom.disabled = true;
			errorUserName.innerHTML = "";
			$('#containerChat').show();
			$('#containerJoin').hide();
			containerChat.hasJoined = true;
			containerChat.userName = userName;
			containerChat.reset();
			eb.send("user/join", userName);
		}
		else {
			errorUserName.innerHTML = 
				"Error: The user name should take at least one character";
		}
	};

	// When Event bus is connected to the server...
	eb.onopen = function () {
		containerChat.eventBus = eb;
		buttonJoinRoom.addEventListener("click", joinRoom);
	};
}