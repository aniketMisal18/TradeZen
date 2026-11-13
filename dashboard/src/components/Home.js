import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import TradingPanel from "./TradingPanel";
import { useGloble } from "../context/GlobleContext";

const Home = () => {

  const {  IsPanelOpen } = useGloble();
  return (

    <div className="homeCon">
      <TopBar />
      <Dashboard />
      { IsPanelOpen.isOpen && <TradingPanel  />}
    </div>

  );
};

export default Home;
