window.onload = function () {

	// Loading event bus
	var eb = new EventBus("/eventbus/");

	// Getting the useful elements
	var inputUserName = document.querySelector("input[name=inputUserName]");
	var textAreaMessage = document.getElementById("newMessage");
	var buttonSendMessage = document.getElementById("sendMessage");
	var buttonJoin = document.getElementById("buttonJoin");
	var errorUserName = document.getElementById("errorUserName");
	var containerChatHistory = document.getElementById("containerChatHistory");

	// Show / Hide specific elements
	buttonJoin.disabled = false;
	$('#containerChat').hide();

	// [hasJoined] Check if the user is in the chat
	function hasJoined() {
		return !$('#containerChat').is(":hidden"); 
	};

	// [join] When a user wants to join the chat
	function join() {
		var userName = inputUserName.value;
		if (userName.length > 0) {
			buttonJoin.disabled = true;
			errorUserName.innerHTML = "";
			$('#containerChat').show();
			$('#containerJoin').hide();
			eb.publish("user/join", userName);
		}
		else {
			errorUserName.innerHTML = 
				"Error: The user name should take at least one character";
		}
	};

	// [sendMessage] When a user wants to send a message to the chat
	function sendMessage() {
		var message = textAreaMessage.innerHTML;

		if (message.length > 0) {
			eb.publish("message/post", message);
			$('#newMessage').val("");
		}
	};

	// [writeInChat message] Write the [messag] in the chat history
	function writeInChat(message) {
		if (hasJoined) {
			containerChatHistory.innerHTML += "<p>" + message + "</p>";
		}
	};

	// When Event bus is connected to the server...
	eb.onopen = function () {

		// When a user joined the chat
		eb.registerHandler("user/joined", function (err, msg) {
			writeInChat(msg.body);
		});

		// When a user posted a message
		eb.registerHandler("message/posted", function (err, msg) {
			writeInChat(msg.body);
		});

		// Adding listeners
		buttonJoin.addEventListener("click", join);
	};
}