var Router = require("vertx-web-js/router");
var SockJSHandler = require("vertx-web-js/sock_js_handler");
var StaticHandler = require("vertx-web-js/static_handler");

var router = Router.router(vertx);


// Options for the socket bridge
var options = {
	"inboundPermitteds" : [
		{
			"address" : "user/join"
		},
		{
			"address" : "message/post"
		}
	],
	"outboundPermitteds" : [
		{
			"address" : "user/joined"
		},
		{
			"address" : "message/posted"
		}
	]
};

// Handling sockJS
var sockJSHandler = SockJSHandler.create(vertx).bridge(options);
router.route("/eventbus/*").handler(sockJSHandler.handle);

// Handling static resources
router.route().handler(StaticHandler.create().handle);

// Listen to port 8080
vertx.createHttpServer().requestHandler(router.accept).listen(8080);

// Event bus
var eb = vertx.eventBus();

// When an user wants to join...
eb.consumer("user/join").handler(function (message) {
	var totalMessage = message.body() + " has joined!";
	console.log("server: " + totalMessage);
	eb.publish("user/joined", totalMessage);
});

// When a user wants to post something...
eb.consumer("message/post").handler(function (message) {
	var json = message.body();
	var totalMessage = json.userName + " said: " + json.message;
	console.log("server: " + totalMessage);
	eb.publish("message/posted", totalMessage);
});