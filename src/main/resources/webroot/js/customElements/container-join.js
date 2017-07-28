class ContainerJoin extends HTMLElement {

	constructor() {
		super();

		var shadowRoot = this.attachShadow({mode: 'open'});

		// Styles
		shadowRoot.innerHTML = 
			`<style type="text/css">@import 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'</style>
			<style>
				:host {
					text-align: center;
				}
				span {
					margin-right: 1em;
				}
				button {
					margin-left: 1em;
				}
			</style>`

		// Header
		var title = document.createElement('h2');
		title.classList.add('text-primary');
		title.innerHTML = "Join the chat room";
		shadowRoot.appendChild(title);

		// Input
		var paragraph = document.createElement('p');
		paragraph.classList.add('text-muted');
		var span = document.createElement('span');
		span.innerHTML = "UserName:";
		paragraph.appendChild(span);
		this.inputUserName = document.createElement('input');
		this.inputUserName.type = "text";
		this.inputUserName.value = "Anonymous";
		paragraph.appendChild(this.inputUserName);
		this.buttonJoinRoom = document.createElement('button');
		this.buttonJoinRoom.type = "button";
		this.buttonJoinRoom.classList.add('btn');
		this.buttonJoinRoom.classList.add('btn-success');
		this.buttonJoinRoom.innerHTML = "Join room";
		this.buttonJoinRoom.disabled = false;
		paragraph.appendChild(this.buttonJoinRoom);
		this.errorUserName = document.createElement('p');
		this.errorUserName.classList.add('text-danger');
		paragraph.appendChild(this.errorUserName);
		shadowRoot.appendChild(paragraph);
	}

	connectedCallback() {
		this.buttonJoinRoom.addEventListener("click", this.joinRoom(this));
	}

	get eventBus() {
		return this.eb;
	}

	set eventBus(value) {
		this.eb = value;
	}

	// [join base] When a user wants to join the chat
	joinRoom(base) {
		return function() {
			var userName = base.inputUserName.value;

			if (userName.length > 0) {
				base.chat.joinRoom(userName);
				base.buttonJoinRoom.disabled = true;
				base.errorUserName.innerHTML = "";
				base.hidden = true;
				base.eb.send("user/join", userName);
			}
			else {
				base.errorUserName.innerHTML = 
					"Error: The user name should take at least one character";
			}
		}
	}

	// [leaveRoom] When a user wants to leave the room
	leaveRoom() {
		this.buttonJoinRoom.disabled = false;
		this.hidden = false;
	}
}

window.customElements.define('container-join', ContainerJoin);