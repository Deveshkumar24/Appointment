"use client";

import React from "react";

export default function StatusMeter({ busyLevel = 99, currentStatus = "Ignoring Slack notifications" }) {
  // Circular progress math (r = 40, circumference = 251.2)
  const radius = 40;
  const strokeDasharray = 2 * Math.PI * radius;
  const strokeDashoffset = strokeDasharray - (strokeDasharray * busyLevel) / 100;

  // Humor based on busy level
  const getStatusWarning = (level) => {
    if (level >= 95) return { text: "CRITICAL BUSYNESS", color: "text-rose-500", glow: "shadow-rose-500/50", border: "border-rose-500/30" };
    if (level >= 80) return { text: "DO NOT DISTURB", color: "text-amber-500", glow: "shadow-amber-500/50", border: "border-amber-500/30" };
    if (level >= 60) return { text: "SLIGHTLY AWAKE BUT BUSY", color: "text-pink-400", glow: "shadow-pink-500/50", border: "border-pink-500/30" };
    return { text: "COULD BE BRIBED", color: "text-emerald-400", glow: "shadow-emerald-500/50", border: "border-emerald-500/30" };
  };

  const warning = getStatusWarning(busyLevel);

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-glass-border">
      {/* Circle Meter */}
      <div className="relative flex items-center justify-center w-36 h-36">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-dark-surface fill-transparent"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="72"
            cy="72"
            r={radius}
            className="stroke-primary fill-transparent transition-all duration-1000 ease-out"
            strokeWidth="8"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 8px ${busyLevel >= 95 ? '#f43f5e' : '#ec4899'})`
            }}
          />
        </svg>
        {/* Percentage Label */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-black tracking-tight text-text-main">{busyLevel}%</span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Busy</span>
        </div>
      </div>

      {/* Info & Live Activity */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <div className="flex items-center gap-2 mb-1">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-500">Live Status Tracker</span>
        </div>

        <h3 className="text-xl font-bold text-text-main mb-2 max-w-md break-words">
          "{currentStatus}"
        </h3>

        <div className={`mt-2 px-3 py-1 text-xs font-bold rounded-full border bg-dark-surface/40 uppercase tracking-widest ${warning.color} ${warning.border}`}>
          {warning.text}
        </div>
      </div>

      {/* Humorous Tip Card */}
      <div className="hidden lg:block w-56 text-text-muted text-xs leading-relaxed p-4 bg-dark-surface/40 rounded-xl border border-glass-border">
        <p className="font-semibold text-text-main mb-1">💡 Pro Tip:</p>
        Aditi's responsiveness is directly proportional to the sugar content of your bribe. Bringing a warm croissant boosts approval rates by up to 300%.
      </div>
    </div>
  );
}
