import React, { useState, useEffect } from 'react';

const StakingCard = ({ balance, stakedAmount, setStakedAmount, onStake }) => {
  const apy = 70; // APY in %
  const depositFee = 1; // Deposit fee in %
  const withdrawalFee = 1; // Withdrawal fee in %
  const [rewardPerSecond, setRewardPerSecond] = useState(0);

  useEffect(() => {
    if (stakedAmount) {
      // Calculate rewards per second based on APY
      const yearlyReward = (stakedAmount * apy) / 100;
      setRewardPerSecond(yearlyReward / (365 * 24 * 60 * 60)); // Per second reward
    }
  }, [stakedAmount]);

  return (
    <div className="neo-card p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Stake AceD Tokens</h2>

      {/* Info Section */}
      <div className="glass-panel p-6 mb-6 rounded-lg space-y-4">
        <div className="text-blue-400 text-base">
          <p className="text-lg font-semibold mb-2 text-blue-500">Why Stake?</p>
          <p className="text-sm">
            <strong>Stake AceD</strong> to earn more AceD tokens as rewards! By staking, you can take advantage of
            our high APY and grow your holdings effortlessly.
          </p>
        </div>
        <div className="flex justify-between items-center text-sm text-blue-300">
          <p>APY:</p>
          <p className="font-bold text-blue-400">70%</p>
        </div>
        <div className="flex justify-between items-center text-sm text-blue-300">
          <p>Deposit Fee:</p>
          <p className="font-bold text-blue-400">1% <span className="text-xs">(Goes to owner wallet)</span></p>
        </div>
        <div className="flex justify-between items-center text-sm text-blue-300">
          <p>Withdrawal Fee:</p>
          <p className="font-bold text-blue-400">1% <span className="text-xs">(Goes to owner wallet)</span></p>
        </div>
      </div>

      {/* Staking Input */}
      <div className="glass-panel p-6 mb-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-blue-400">Amount to Stake</span>
          <span className="text-sm">Balance: {balance.toFixed(2)} AceD</span>
        </div>
        <div className="flex space-x-4">
          <input
            type="number"
            placeholder="0.0"
            value={stakedAmount}
            onChange={(e) => setStakedAmount(Number(e.target.value))}
            className="input-field w-full"
          />
          <button
            onClick={() => setStakedAmount(balance)}
            className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-full transition-all duration-300"
          >
            Max
          </button>
        </div>
      </div>

      {/* Dynamic Rewards Calculator */}
      {stakedAmount > 0 && (
        <div className="glass-panel p-6 rounded-lg mb-6">
          <h3 className="text-lg font-bold text-blue-400 mb-4">Estimated Rewards</h3>
          <div className="flex justify-between items-center text-sm text-blue-300">
            <p>Per Second:</p>
            <p className="font-bold text-blue-400">{rewardPerSecond.toFixed(6)} AceD</p>
          </div>
          <div className="flex justify-between items-center text-sm text-blue-300">
            <p>Per Day:</p>
            <p className="font-bold text-blue-400">{(rewardPerSecond * 86400).toFixed(2)} AceD</p>
          </div>
          <div className="flex justify-between items-center text-sm text-blue-300">
            <p>Per Year:</p>
            <p className="font-bold text-blue-400">{(rewardPerSecond * 86400 * 365).toFixed(2)} AceD</p>
          </div>
        </div>
      )}

      {/* Stake Button */}
      <button
        onClick={onStake}
        className="bg-blue-600 hover:bg-blue-700 w-full px-6 py-3 rounded-full transition-all duration-300 text-white font-bold"
      >
        Stake Now
      </button>
    </div>
  );
};

export default StakingCard;
