import React from "react";
import { useParams } from "react-router-dom";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
const Chart = () => {
 
  const { stock } = useParams();



console.log(stock)
  return <AdvancedRealTimeChart
    theme="light"
    symbol={`BSE:${stock}`}     // Reliance on BSE
    width="100%"
    height={500}
    interval="D"
    allow_symbol_change={false}
    hide_top_toolbar={true}
     hide_side_toolbar={true}
     withdateranges={false}
     studies={[]}
      hide_volume={true}
  />
};

export default Chart;
