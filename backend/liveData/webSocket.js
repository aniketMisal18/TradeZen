const WebSocket = require("ws");

const {
    subscribe,
    removeSocket,
    unsubscribe,
    broadcastPrice,
} = require("./subscriptionManager");

function setupWebSocket(server) {

    const wss = new WebSocket.Server({ server });

    console.log("WebSocket Server Initialized");

    wss.on("connection", (ws) => {

        console.log("New Client Connected");

        // Welcome Message
        ws.send(JSON.stringify({
            type: "connected",
            message: "WebSocket Connected Successfully"
        }));

        // Receive Messages
        ws.on("message", (message) => {

            try {

                const data = JSON.parse(message.toString());

                console.log("Client Message:", data);

                switch (data.type) {

                    case "subscribeMany":

                        data.symbol.forEach(symbol => {
                            subscribe(symbol, ws);
                        });

                        break;

                     case "subscribeOne":

                        subscribe(data.symbol, ws);

                        break;

                    case "unsubscribe":

                        unsubscribe(data.symbol, ws);

                        break;


                }

            } catch (err) {
                console.log(err)
                console.log("Invalid JSON");

            }

        });

        // Disconnect
        ws.on("close", () => {

            removeSocket(ws);

        });

        // Error
        ws.on("error", (err) => {

            console.log(err);

        });

    });

    return wss;
}

module.exports = setupWebSocket;