import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RecentTransactions = () => {
  const [solPrices, setSolPrices] = useState([]);
  const [btcPrices, setBtcPrices] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);

  useEffect(() => {
    const solSocket = new WebSocket("wss://stream.binance.com:9443/ws/solusdt@trade");
    const btcSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    const addDataPoint = (setPrices, prices, price, setLabels) => {
      if (prices.length > 20) {
        // Keep the last 20 data points for smoother visualization
        prices.shift();
      }
      setPrices([...prices, price]);

      const currentTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      if (setLabels) {
        setLabels((prev) => [...prev.slice(-19), currentTime]); // Update labels
      }
    };

    // Solana WebSocket Listener
    solSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const solPrice = parseFloat(message.p); // Extract price from WebSocket data
      addDataPoint(setSolPrices, solPrices, solPrice, setTimeLabels);
    };

    // Bitcoin WebSocket Listener
    btcSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const btcPrice = parseFloat(message.p); // Extract price from WebSocket data
      addDataPoint(setBtcPrices, btcPrices, btcPrice, null);
    };

    // Cleanup on component unmount
    return () => {
      solSocket.close();
      btcSocket.close();
    };
  }, [solPrices, btcPrices]);

  // Chart configurations
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#e2e8f0",
        },
      },
    },
  };

  const solChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "SOL Price (USD)",
        data: solPrices,
        borderColor: "rgba(99, 102, 241, 1)", // Blue
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.3,
      },
    ],
  };

  const btcChartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "BTC Price (USD)",
        data: btcPrices,
        borderColor: "rgba(255, 99, 132, 1)", // Red
        backgroundColor: "rgba(255, 99, 132, 0.1)",
        tension: 0.3,
      },
    ],
  };

  const transactions = [
    { action: "Swap", details: "0.5 SOL → 1,234 AceD", time: "2 mins ago" },
    { action: "Swap", details: "1,000 USDT → 0.5 SOL", time: "5 mins ago" },
  ];

  return (
    <div className="neo-card p-6 max-w-lg mx-auto">
      {/* <h2 className="text-xl font-bold mb-4">Recent Transactions</h2> */}

      {/* Solana Chart */}
      <div className="mb-4">
        <h3 className="text-blue-400 text-lg mb-2">Solana (SOL)</h3>
        <div className="h-32">
          <Line data={solChartData} options={chartOptions} />
        </div>
      </div>

      {/* Bitcoin Chart */}
      {/* <div className="mb-4">
        <h3 className="text-yellow-400 text-lg mb-2">Bitcoin (BTC)</h3>
        <div className="h-32">
          <Line data={btcChartData} options={chartOptions} />
        </div>
      </div> */}

      {/* Transactions List */}
      <div className="space-y-4">
        {transactions.map((tx, idx) => (
          <TransactionItem key={idx} action={tx.action} details={tx.details} time={tx.time} />
        ))}
      </div>
    </div>
  );
};

const TransactionItem = ({ action, details, time }) => (
  <div className="flex justify-between items-center p-3 hover:bg-blue-500/5 rounded-lg transition-colors">
    <div className="flex items-center gap-3">
      <div className="text-green-400">{action}</div>
      <div>{details}</div>
    </div>
    <div className="text-gray-400">{time}</div>
  </div>
);

export default RecentTransactions;
