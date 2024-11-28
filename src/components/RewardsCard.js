import React, { useEffect, useState } from 'react';

const RewardsCard = ({ rewards, onClaim, stakedAmount }) => {
  const [dynamicRewards, setDynamicRewards] = useState(rewards);

  useEffect(() => {
    if (stakedAmount) {
      const apy = 70; // APY in %
      const rewardPerSecond = (stakedAmount * apy) / 100 / (365 * 24 * 60 * 60);

      const interval = setInterval(() => {
        setDynamicRewards((prev) => prev + rewardPerSecond);
      }, 1000);

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [stakedAmount]);

  return (
    <div className="neo-card p-6">
      <h2 className="text-xl font-bold mb-6">Your Rewards</h2>
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="text-sm text-blue-400">Pending Rewards</div>
          <div className="text-2xl font-bold">{dynamicRewards.toFixed(6)}</div>
        </div>
        <button
          onClick={() => {
            onClaim(dynamicRewards);
            setDynamicRewards(0);
          }}
          className="bg-gray-800 hover:bg-gray-700 px-8 py-3 rounded-full transition-all duration-300"
        >
          Harvest
        </button>
      </div>
      <div className="h-2 bg-blue-900/30 rounded-full overflow-hidden h-4">
        <div className="progress-bar h-full w-3/4 bg-gradient-to-r from-blue-600 to-[#00ffff] rounded-full"></div>
      </div>
    </div>
  );
};

export default RewardsCard;
