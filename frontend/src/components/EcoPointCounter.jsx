import React from 'react';

const EcoPointCounter = ({ points = 0, label = 'Eco Points' }) => {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
      <span className="text-xl">🌱</span>
      <div>
        <div className="text-lg font-bold text-emerald-400 leading-none">{points}</div>
        <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</div>
      </div>
    </div>
  );
};

export default EcoPointCounter;
