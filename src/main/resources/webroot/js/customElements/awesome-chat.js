class AwesomeChat extends HTMLElement {

	constructor() {
		super();

		var shadowRoot = this.attachShadow({mode: 'open'});

		// Styles
		shadowRoot.innerHTML = 
			`<style type="text/css">@import 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css'</style>`;

		var slot = document.createElement('slot');
		shadowRoot.appendChild(slot);

		var base = this;
		slot.addEventListener('slotchange', (e) => {
			var slots = slot.assignedNodes();

			if (slots.length == 5) {
				base.containerJoin = slots[1];
				base.containerChat = slots[3];
				base.containerJoin.hidden = false;
				base.containerChat.hidden = true;
				base.containerJoin.chat = base.containerChat;
				base.containerChat.join = base.containerJoin;
			}
		});
	}

	get eventBus() {
		return this.eb;
	}

	set eventBus(value) {
		this.eb = value;
		var base = this;

		// When Event bus is connected to the server...
		this.eb.onopen = function () {
			base.containerJoin.eventBus = value;
			base.containerChat.eventBus = value;
		};
	}
}

window.customElements.define('awesome-chat', AwesomeChat);