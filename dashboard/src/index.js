import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { UserProvider } from "./context/UserContext";
import { AccountProvider } from "./context/AccountContext";
import { GlobleProvider } from "./context/GlobleContext";
import { LivePricesProvider } from "./context/LivePricesContext";
import { WebSocketProvider } from "./context/WebSocketContext";
import App from "./components/App";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobleProvider>
        <LivePricesProvider>
          <WebSocketProvider>
            <UserProvider>
               <AccountProvider>
              <App />
              </AccountProvider>
            </UserProvider>
          </WebSocketProvider>
        </LivePricesProvider>
      </GlobleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
