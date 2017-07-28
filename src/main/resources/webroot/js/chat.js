window.onload = function () {

	// Loading event bus
	var eb = new EventBus("/eventbus/");

	// The chat
	var chat = document.getElementById("chat");
	chat.eventBus = eb;
}