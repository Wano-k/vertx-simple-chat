window.onload = function () {

	// Loading event bus
	var eb = new EventBus("/eventbus/");

	var containerJoin = document.getElementById("containerJoin");
	var containerChat = document.getElementById("containerChat");
	containerJoin.chat = containerChat;
	containerChat.join = containerJoin;

	// Show / Hide specific elements
	containerJoin.hidden = false;
	containerChat.hidden = true;

	// When Event bus is connected to the server...
	eb.onopen = function () {
		containerJoin.eventBus = eb;
		containerChat.eventBus = eb;
	};
}