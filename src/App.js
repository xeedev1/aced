import React from "react";
import "./App.css";
import SwapPage from "./components/SwapPage";
import StakingPage from "./components/StakingPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

const App = () => {
  return (
    <Router>
       <Routes>
          <Route path="/" element={<SwapPage/>} />
          <Route path="/staking" element={<StakingPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
