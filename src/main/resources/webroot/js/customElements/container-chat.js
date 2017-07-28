// All the possible kind of message that can be displayed in the chat
var MessageType = {
	Join: 0,
	Post: 1,
	Leave: 2
};
Object.freeze(MessageType);

class ContainerChat extends HTMLElement {

	constructor() {
		super();
		this.hasJoined = false;

		var shadowRoot = this.attachShadow({mode: 'open'});

		// Styles
		shadowRoot.innerHTML = 
			`<style type="text/css">@import 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'</style>
			<style>
				:host {
					text-align: center;
				}
				h2 {
					margin-bottom: 1em;
					margin-right: 2em;
				}
				#containerChatHistory {
					text-align: left;
					margin-left: 26%;
					margin-right: 26%;
					word-wrap: break-word;
				}
				textarea {
					margin-bottom: 1em;
					display: block;
				    margin-left: auto;
				    margin-right: auto;
				}
			</style>`;

		// Header
		var title = document.createElement('h2');
		title.classList.add('text-primary');
		title.innerHTML = "Welcome to the chat room! ";
		this.buttonLeaveRoom = document.createElement('button');
		this.buttonLeaveRoom.type = "button";
		this.buttonLeaveRoom.innerHTML = "Leave room";
		this.buttonLeaveRoom.classList.add('btn');
		this.buttonLeaveRoom.classList.add('btn-warning');
		title.appendChild(this.buttonLeaveRoom);
		shadowRoot.appendChild(title);

		// Chat history
		this.containerChatHistory = document.createElement('div');
		this.containerChatHistory.id = "containerChatHistory";
		shadowRoot.appendChild(this.containerChatHistory);

		// Message sender
		this.textAreaMessage = document.createElement('textarea');
		this.textAreaMessage.rows = 3;
		this.textAreaMessage.cols = 100;
		shadowRoot.appendChild(this.textAreaMessage);
		var divSender = document.createElement('div');
		this.buttonSendMessage = document.createElement('button');
		this.buttonSendMessage.type = "button";
		this.buttonSendMessage.classList.add('btn');
		this.buttonSendMessage.classList.add('btn-primary');
		this.buttonSendMessage.innerHTML = "Send";
		divSender.appendChild(this.buttonSendMessage);
		shadowRoot.appendChild(divSender);
	}

	connectedCallback() {
		this.buttonSendMessage.addEventListener("click", this.sendMessage(this));
		this.buttonLeaveRoom.addEventListener("click", this.leaveRoom(this));
	}

	get eventBus() {
		return this.eb;
	}

	set eventBus(value) {
		this.eb = value;
		var base = this;
		
		// When a user joined the chat
		this.eb.registerHandler("user/joined", function (err, msg) {
			base.writeInChat(msg.body, MessageType.Join);
		});

		// When a user posted a message
		this.eb.registerHandler("message/posted", function (err, msg) {
			base.writeInChat(msg.body, MessageType.Post);
		});

		// When a user leaved the chat
		this.eb.registerHandler("user/leaved", function (err, msg) {
			base.writeInChat(msg.body, MessageType.Leave);
		});
	}

	reset() {
		this.containerChatHistory.innerHTML = "";
		this.textAreaMessage.value = "";
	}

	// [strip] Return a text without the html content.
	strip(html) {
		var tmp = document.createElement("div");
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText;
	}

	// [sendMessage base] When a user wants to send a message to the chat
	sendMessage(base) {
		return function() {
			var message = base.strip(base.textAreaMessage.value);
			if (message.length > 0) {
				var jsonPost = {
					"userName": base.userName,
					"message": message
				};
				base.eb.send("message/post", jsonPost);
				base.textAreaMessage.value = "";
			}
		}
	}

	// [leaveRoom base] When a user wants to leave the room
	leaveRoom(base) {
		return function() {
			base.join.leaveRoom();
			base.hidden = true;
			base.hasJoined = false;
			base.eb.send("user/leave", base.userName);
		}
	}

	// [writeInChat message type] Write the [messag] in the chat history
	writeInChat(message, type) {
		if (this.hasJoined) {
			var typo = "text-muted";

			switch (type){
				case MessageType.Join:
					typo = "text-success"; break;
				case MessageType.Join:
					typo = "text-muted"; break;
				case MessageType.Leave:
					typo = "text-warning"; break;
			}

			this.containerChatHistory.innerHTML += 
				"<p " + 'class="' + typo + '">' + message + "</p>";
		}
	}

	// [join userName] When a user wants to join the chat
	joinRoom(userName) {
		this.hidden = false;
		this.hasJoined = true;
		this.userName = userName;
		this.reset();
	}
}

window.customElements.define('container-chat', ContainerChat);