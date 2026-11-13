require("dotenv").config();

const express = require("express");
const http = require('http');
const app = express();
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoUrl = process.env.MONGO_URL;
const startOrderStatusUpdater = require("./jobs/orderStatusUpdater");
const bodyParser = require("body-parser");
const setupWebSocket = require("./liveData/webSocket");
const { syncNifty50 } = require("./jobs/syncNifty50Stocks");

const AuthRouter = require("./Router/AuthRouter");
const AccountRouter = require("./Router/AccountRouter");
const HoldingRouter = require("./Router/HoldingsRouter");
const PositionsRouter = require("./Router/PositionsRouter");
const OrdersRouter = require("./Router/OrdersRouter");
const UsersRouter = require("./Router/UserRouter");
const StocksRouter = require("./Router/StocksRouter")
const checkAuth = require("./Middleware/CheckAuth");
const zerodhaRoutes = require("./Router/zerodhaRoute");

const { startBroker, broadcastPrices } = require("./liveData/broker");
const { broadcastPrice } = require("./liveData/subscriptionManager");

const server = http.createServer(app);

const PORT = process.env.PORT || 3010;


app.use(bodyParser.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", AuthRouter);
app.use("/holding", HoldingRouter);
app.use("/account", AccountRouter);
app.use("/position", PositionsRouter);
app.use("/order", OrdersRouter);
app.use("/user", UsersRouter);
app.use("/stock", StocksRouter);
app.use("/zerodha", zerodhaRoutes);

main()
    .then(() => {
        console.log('DB is Connected') ;
        console.log("DB NAME:", mongoose.connection.name);
console.log("DB HOST:", mongoose.connection.host);

    } )
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(mongoUrl);

   await syncNifty50()
        .then(() => {
            console.log("Initial sync complete");
        })
        .catch(console.error);

    await startBroker(broadcastPrice);

}






setupWebSocket(server);

// startBroker((stocks) => {
//     broadcastPrices(stocks);
// });



server.listen(PORT, () => {
    console.log("Server is started");


})