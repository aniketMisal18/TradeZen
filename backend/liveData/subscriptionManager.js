
const subscriptions = new Map();
const socketSubscriptions = new Map();
const latestPrices = new Map();






function subscribe(symbol, socket) {
    if (!symbol || socket.readyState !== 1) return;

  

    if (!subscriptions.has(symbol)) {
        subscriptions.set(symbol, new Set());
    }

    subscriptions.get(symbol).add(socket);

    if (!socketSubscriptions.has(socket)) {
        socketSubscriptions.set(socket, new Set());
    }

    socketSubscriptions.get(socket).add(symbol);

    const latestPrice = latestPrices.get(symbol);

    if (latestPrice) {
        socket.send(JSON.stringify({
            type: "price",
            data: latestPrice
        }));


    }
}

function unsubscribe(symbol, socket) {
    const subscribers = subscriptions.get(symbol);

    if (subscribers) {
        subscribers.delete(socket);

        if (subscribers.size === 0) {
            subscriptions.delete(symbol);
        }
    }

    const symbols = socketSubscriptions.get(socket);

    if (symbols) {
        symbols.delete(symbol);

        if (symbols.size === 0) {
            socketSubscriptions.delete(socket);
        }
    }
}

function broadcastPrice(stock) {
    latestPrices.set(stock.symbol, stock);

    const subscribers = subscriptions.get(stock.symbol);



    if (!subscribers || subscribers.size === 0) return;

    const message = JSON.stringify({
        type: "price",
        data: stock
    });

    subscribers.forEach(socket => {
        if (socket.readyState === 1) {
            socket.send(message);
        } else {
            unsubscribe(stock.symbol, socket);
        }
    });
}

function removeSocket(socket) {
    const symbols = socketSubscriptions.get(socket);

    if (!symbols) return;

    for (const symbol of [...symbols]) {
        unsubscribe(symbol, socket);
    }

    socketSubscriptions.delete(socket);
}

module.exports = {
    subscribe,
    unsubscribe,
    broadcastPrice,
    removeSocket,
    subscriptions,
    latestPrices
};
