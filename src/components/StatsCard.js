import React from 'react';

const StatsCard = ({ title, value, percentage }) => {
  return (
    <div className="neo-card p-6">
      <div className="text-sm text-blue-400">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {percentage && <div className="text-green-400 text-sm">{percentage}</div>}
    </div>
  );
};

export default StatsCard;
