
// All the possible kind of message that can be displayed in the chat
var MessageType = {
    Join: "join",
    Post: "post"
};
Object.freeze(MessageType);

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

	// Config
	var hasJoined = false;

	// Show / Hide specific elements
	buttonJoin.disabled = false;
	$('#containerJoin').show();
	$('#containerChat').hide();

	// [join] When a user wants to join the chat
	function join() {
		var userName = inputUserName.value;

		if (userName.length > 0) {
			buttonJoin.disabled = true;
			errorUserName.innerHTML = "";
			$('#containerChat').show();
			$('#containerJoin').hide();
			hasJoined = true;
			eb.send("user/join", userName);
		}
		else {
			errorUserName.innerHTML = 
				"Error: The user name should take at least one character";
		}
	};

	// [sendMessage] When a user wants to send a message to the chat
	function sendMessage() {
		var userName = inputUserName.value;
		var message = textAreaMessage.value;
		console.log(message);
		if (message.length > 0) {
			var jsonPost = {
				"userName": userName,
				"message": message
			};
			eb.send("message/post", jsonPost);
			textAreaMessage.value = "";
		}
	};

	// [writeInChat message type] Write the [messag] in the chat history
	// according to the [type] of message.
	function writeInChat(message, type) {
		if (hasJoined) {
			containerChatHistory.innerHTML += 
				"<p " + 'id="' + type + '">' + message + "</p>";
		}
	};

	// When Event bus is connected to the server...
	eb.onopen = function () {

		// When a user joined the chat
		eb.registerHandler("user/joined", function (err, msg) {
			writeInChat(msg.body, MessageType.Join);
		});

		// When a user posted a message
		eb.registerHandler("message/posted", function (err, msg) {
			writeInChat(msg.body, MessageType.Post);
		});

		// Adding listeners
		buttonJoin.addEventListener("click", join);
		buttonSendMessage.addEventListener("click", sendMessage);
	};
}