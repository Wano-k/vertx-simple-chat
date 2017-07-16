
// All the possible kind of message that can be displayed in the chat
var MessageType = {
	Join: 0,
	Post: 1
};
Object.freeze(MessageType);

window.onload = function () {

	// Loading event bus
	var eb = new EventBus("/eventbus/");

	// Getting the useful elements
	var inputUserName = document.querySelector("input[name=inputUserName]");
	var textAreaMessage = document.getElementById("textAreaMessage");
	var buttonSendMessage = document.getElementById("buttonSendMessage");
	var buttonLeaveRoom = document.getElementById("buttonLeaveRoom");
	var buttonJoinRoom = document.getElementById("buttonJoinRoom");
	var errorUserName = document.getElementById("errorUserName");
	var containerChatHistory = document.getElementById("containerChatHistory");

	// Config
	var hasJoined = false;

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
			containerChatHistory.innerHTML = "";
			textAreaMessage.value = "";
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
		var message = strip(textAreaMessage.value);
		if (message.length > 0) {
			var jsonPost = {
				"userName": userName,
				"message": message
			};
			eb.send("message/post", jsonPost);
			textAreaMessage.value = "";
		}
	};

	// [leaveRoom] When a user wants to leave the room
	function leaveRoom() {
		var userName = inputUserName.value;
		buttonJoinRoom.disabled = false;
		$('#containerChat').hide();
		$('#containerJoin').show();
		hasJoined = false;
		eb.send("user/leave", userName);
	};

	// [writeInChat message type] Write the [messag] in the chat history
	// according to the [type] of message.
	function writeInChat(message, type) {
		if (hasJoined) {
			var typo = "text-muted";

			switch (type){
				case MessageType.Join:
					typo = "text-success"; break;
				case MessageType.Join:
					typo = "text-muted"; break;
				case MessageType.Leave:
					typo = "text-warning"; break;
			}

			containerChatHistory.innerHTML += 
				"<p " + 'class="' + typo + '">' + message + "</p>";
		}
	};

	// [strip] Return a text without the html content.
	function strip(html) {
		var tmp = document.createElement("DIV");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText;
	}

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

		// When a user leaved the chat
		eb.registerHandler("user/leaved", function (err, msg) {
			writeInChat(msg.body, MessageType.Leave);
		});

		// Adding listeners
		buttonJoinRoom.addEventListener("click", joinRoom);
		buttonSendMessage.addEventListener("click", sendMessage);
		buttonLeaveRoom.addEventListener("click", leaveRoom);
	};
}