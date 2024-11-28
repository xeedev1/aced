import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import StatsCard from './StatsCard';
import StakingCard from './StakingCard';
import RewardsCard from './RewardsCard';

const CryptoDashboard = () => {
  const [walletBalance, setWalletBalance] = useState(2345.67);
  const [stakedAmount, setStakedAmount] = useState('');
  const [rewards, setRewards] = useState(45.67);

  const handleStake = () => {
    const depositFee = 0.01; // 1%
    const amountToStake = stakedAmount - stakedAmount * depositFee;
    console.log(`Staked Amount: ${amountToStake}`);
    setWalletBalance(walletBalance - stakedAmount);
    setStakedAmount('');
  };

  const handleClaim = (harvestAmount) => {
    console.log(`Harvested Rewards: ${harvestAmount}`);
    setRewards(0); // Reset rewards
  };

  return (
    <div className="min-h-screen p-4" style={{
      background: "#0a0f1d",
      color: "#e2e8f0",
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div className="max-w-7xl mx-auto">
        <Header balance="1,234.56" onConnectWallet={() => console.log('Connect Wallet')} />
        <div className="flex flex-col lg:flex-row gap-6">
          <Sidebar />
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatsCard title="Total Value Locked" value="$12.5M" percentage="+2.5%" />
              <StatsCard title="APY" value="70%" percentage="" />
              <StatsCard title="Your Stake" value={stakedAmount || '0.00'} />
            </div>
            <StakingCard
              balance={walletBalance}
              stakedAmount={stakedAmount}
              setStakedAmount={setStakedAmount}
              onStake={handleStake}
            />
            <RewardsCard rewards={rewards} onClaim={handleClaim} stakedAmount={stakedAmount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDashboard;
