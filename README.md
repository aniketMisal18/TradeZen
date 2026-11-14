# TradeZen – Full Stack Stock Trading Platform

A full-stack stock trading platform built using the **MERN stack**, featuring real-time Indian stock market data, portfolio management, watchlists, order management and live WebSocket communication.

TradeZen aims to provide a smooth stock trading dashboard experience with real-time market updates and essential portfolio management tools.

## 🚀 Features

### 1. User Authentication
- User registration and login.
- Secure password hashing.
- JWT-based authentication.
- HTTP-only cookie-based authentication.
- Protected routes and user-specific data.

### 2. Real-Time Market Data
- Integration with Zerodha Kite Connect API.
- Live NSE market data using KiteTicker.
- WebSocket communication between backend and frontend.
- Real-time price updates without refreshing the page.
- Subscription management for market instruments.
- Nifty 50 stocks and supported market indices.

### 3. Watchlist Management
- Add stocks to your watchlist.
- Remove stocks from your watchlist.
- Display live stock prices.
- Persistent watchlist data associated with user accounts.

### 4. Portfolio Management
- View stock holdings.
- Track current portfolio value.
- Calculate unrealized profit and loss.
- Monitor average purchase prices.
- Track open trading positions.

### 5. Order Management
- Place BUY and SELL orders.
- Support for delivery and position-based orders.
- Validate available account balance before buying.
- Check available quantity before selling.
- Track order status.
- Automatically process eligible pending orders.

### 6. Account Management
- View account information.
- Monitor available balance.
- Track used margin and available margin.
- Add funds and withdraw funds.
- Monitor realized profit and loss.

### 7. Responsive Dashboard
- Interactive trading dashboard.
- Live market price updates.
- Portfolio and order overview.
- Responsive user interface.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, JavaScript, HTML, CSS |
| UI Library | Material UI (MUI) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| API Communication | Axios, REST APIs |
| Real-Time Communication | WebSockets |
| Market Data | Zerodha Kite Connect API, KiteTicker |
| Notifications | React Toastify |
| Version Control | Git, GitHub |

## 🏗️ Project Architecture

TradeZen follows a client-server architecture.

```text
                 TRADEZEN
                    |
          +---------+---------+
          |                   |
       Frontend             Backend
       React.js           Node.js / Express
          |                   |
          |              +----+-----+
          |              |          |
          |           MongoDB    Zerodha API
          |              |          |
          |              |       KiteTicker
          |              |          |
          +<---------- WebSocket <---+
             Live Price Updates
```

### How Real-Time Data Works

1. The backend connects to Zerodha KiteTicker.
2. The backend subscribes to selected market instruments.
3. Zerodha streams live market prices to the backend.
4. The backend processes incoming price updates.
5. WebSocket connections distribute updates to subscribed frontend clients.
6. React updates the dashboard without requiring a page refresh.

## 📂 Project Structure

```text
TradeZen/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.js
│       └── index.js
│
├── backend/
│   ├── config/
│   ├── Controller/
│   ├── Middleware/
│   ├── model/
│   ├── Router/
│   ├── jobs/
│   ├── liveData/
│   └── server.js
│
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account or local MongoDB
- Zerodha Kite Connect API credentials

### 1. Clone the Repository

```bash
git clone https://github.com/aniketMisal18/TradeZen.git

cd TradeZen
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the backend directory.

```env
PORT=3010
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ZERODHA_API_KEY=your_zerodha_api_key
ZERODHA_API_SECRET=your_zerodha_api_secret
```

Add any other environment variables required by your implementation.

### 4. Start Backend

```bash
npm start
```

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

### 6. Start Frontend

```bash
npm start
```

The application should now be available at:

```text
http://localhost:3000
```

## 🔐 Security

- Password hashing using bcrypt.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Protected backend routes.
- Environment variables for sensitive credentials.
- Server-side validation for trading operations.

**Important:** Never upload your `.env` file, API secrets, JWT secrets or database credentials to GitHub.

## 📡 Real-Time Communication

TradeZen uses WebSocket communication to deliver live market prices to connected clients.

The backend manages stock subscriptions and distributes price updates to clients that subscribe to particular instruments.

This reduces unnecessary HTTP requests and allows the dashboard to display continuously updated market information.


