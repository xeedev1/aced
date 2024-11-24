import React from "react";

const Sidebar = () => {
  const menuItems = [
    { label: "Dashboard", iconPath: "M4 6h16M4 12h16m-7 6h7" },
    { label: "Swap", iconPath: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4", active: true },
    { label: "Staking", iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    { label: "DAO", iconPath: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  ];

  return (
    <div className="lg:w-64">
      <div className="neo-card p-4 space-y-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-full text-left p-3 ${
              item.active ? "bg-blue-500/10" : "hover:bg-blue-500/10"
            } rounded-lg transition-colors flex items-center gap-3`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconPath} />
            </svg>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
