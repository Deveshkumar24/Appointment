"use client";

import React, { useState } from "react";
import { FUNNY_REJECTIONS, FUNNY_STATUSES, BRIBES } from "../utils/constants";

export default function AdminDashboard({
  bookings = [],
  setBookings,
  busyLevel,
  setBusyLevel,
  currentStatus,
  setCurrentStatus
}) {
  const [passcode, setPasscode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [customRejection, setCustomRejection] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.toLowerCase() === "busyqueen" || passcode.toLowerCase() === "aditi") {
      setIsUnlocked(true);
      setErrorMsg("");
    } else {
      setErrorMsg("❌ Incorrect passcode. Aditi is disappointed.");
    }
  };

  const handleApprove = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "approved" } : b))
    );
  };

  const handleReject = (id, reason) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: "rejected", rejectionReason: reason || "No reason given. Just busy." }
          : b
      )
    );
    setSelectedRejectId(null);
    setCustomRejection("");
  };

  const handleDelete = (id) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const getBribeInfo = (bribeId) => {
    return BRIBES.find((b) => b.id === bribeId) || { label: bribeId, icon: "❓" };
  };

  if (!isUnlocked) {
    return (
      <div className="glass-card rounded-2xl p-8 border border-glass-border max-w-md mx-auto text-center">
        <span className="text-5xl mb-4 block">👑</span>
        <h3 className="text-2xl font-black text-text-main mb-2">Aditi's Admin Portal</h3>
        <p className="text-xs text-text-muted mb-6">
          Are you actually Aditi? Prove it. Enter the secret passcode to access your scheduler control panel.
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Enter Secret Passcode"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full rounded-xl px-4 py-3 glass-input text-center text-sm font-semibold tracking-widest text-text-main"
          />
          {errorMsg && <p className="text-xs text-rose-500 font-bold">{errorMsg}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-secondary/20 active:scale-[0.98] transition-all cursor-pointer text-xs tracking-widest uppercase"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  // Split bookings by status
  const pending = bookings.filter((b) => b.status === "pending");
  const approved = bookings.filter((b) => b.status === "approved");
  const rejected = bookings.filter((b) => b.status === "rejected");

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      {/* Quick Controls Card */}
      <div className="glass-card rounded-2xl p-6 border border-glass-border">
        <h3 className="text-lg font-extrabold text-text-main mb-4 flex items-center gap-2">
          <span>⚙️ Live Status Controls</span>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Online
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Busy slider */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2 flex justify-between">
              <span>Busy-ness Level Indicator</span>
              <span className="text-primary font-black">{busyLevel}%</span>
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={busyLevel}
              onChange={(e) => setBusyLevel(Number(e.target.value))}
              className="w-full accent-primary h-2 bg-zinc-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-text-muted font-semibold mt-1">
              <span>0% (Available? Fake news)</span>
              <span>100% (Absolute overload)</span>
            </div>
          </div>

          {/* Status selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-2">
              Select or Write Your Current Status
            </label>
            <div className="flex flex-col gap-2">
              <select
                value={FUNNY_STATUSES.some(s => s.text === currentStatus) ? currentStatus : "custom"}
                onChange={(e) => {
                  if (e.target.value !== "custom") {
                    setCurrentStatus(e.target.value);
                    const matched = FUNNY_STATUSES.find(s => s.text === e.target.value);
                    if (matched) setBusyLevel(matched.level);
                  }
                }}
                className="w-full rounded-xl px-4 py-2.5 glass-input text-sm text-text-main"
              >
                {FUNNY_STATUSES.map((status) => (
                  <option key={status.text} value={status.text}>
                    {status.text}
                  </option>
                ))}
                <option value="custom">✏️ Enter custom status below...</option>
              </select>

              {(!FUNNY_STATUSES.some(s => s.text === currentStatus) || currentStatus === "custom") && (
                <input
                  type="text"
                  placeholder="Type your current busy activity..."
                  value={currentStatus === "custom" ? "" : currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full rounded-xl px-4 py-2 glass-input text-sm text-text-main"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment requests list */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PENDING COLUMN */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-amber-400 flex items-center justify-between px-1">
            <span>Pending Review ({pending.length})</span>
            <span className="w-5 h-5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] flex items-center justify-center font-bold">
              {pending.length}
            </span>
          </h4>

          {pending.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center text-xs text-text-muted">
              No pending applications. People are either too scared or bringing better bribes.
            </div>
          ) : (
            pending.map((b) => {
              const bribe = getBribeInfo(b.bribe);
              const isRejectingThis = selectedRejectId === b.id;

              return (
                <div key={b.id} className="glass-card rounded-xl p-5 border border-glass-border flex flex-col gap-4 hover:border-amber-400/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-extrabold text-text-main text-base leading-tight">{b.name}</h5>
                      <span className="text-[10px] text-text-muted font-bold">{b.social || "No social handle"}</span>
                    </div>
                    <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 font-bold px-2 py-0.5 rounded uppercase">
                      {b.time}
                    </span>
                  </div>

                  <div className="text-xs text-text-muted flex flex-col gap-1.5 bg-dark-surface/40 p-3 rounded-lg border border-glass-border">
                    <div>📅 <span className="font-semibold text-text-main">{b.date}</span></div>
                    <div>🤝 Relationship: <span className="font-semibold text-text-main capitalize">{b.relationship}</span></div>
                    <div>🔥 Urgency: <span className="font-semibold text-text-main capitalize">{b.urgency}</span></div>
                    <div>🧋 Bribe: <span className="font-semibold text-text-main">{bribe.icon} {bribe.label}</span></div>
                    <div className="mt-1 pt-1.5 border-t border-glass-border">
                      💡 Reason: <p className="italic text-text-main mt-0.5 break-words">"{b.reason || "Just want to meet"}"</p>
                    </div>
                  </div>

                  {!isRejectingThis ? (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleApprove(b.id)}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => setSelectedRejectId(b.id)}
                        className="flex-1 bg-rose-950/40 border border-rose-900/60 hover:bg-rose-900/40 text-rose-400 font-bold py-2 rounded-lg text-xs tracking-wider uppercase transition-all cursor-pointer"
                      >
                        Reject...
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                        Choose rejection reason:
                      </label>
                      <div className="flex flex-col gap-1">
                        {FUNNY_REJECTIONS.map((r, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleReject(b.id, r)}
                            className="text-left text-[11px] text-text-main hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded transition-all"
                          >
                            • {r}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1.5 mt-1 pt-1.5 border-t border-rose-900/30">
                        <input
                          type="text"
                          placeholder="Write custom reason..."
                          value={customRejection}
                          onChange={(e) => setCustomRejection(e.target.value)}
                          className="flex-1 rounded px-2 py-1 bg-black/50 border border-rose-900/50 text-xs text-white"
                        />
                        <button
                          onClick={() => handleReject(b.id, customRejection)}
                          className="bg-rose-600 hover:bg-rose-500 text-white px-2 py-1 rounded text-xs font-bold"
                        >
                          Send
                        </button>
                      </div>
                      <button
                        onClick={() => setSelectedRejectId(null)}
                        className="text-center text-[10px] text-text-muted hover:text-text-main mt-1 uppercase"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* APPROVED COLUMN */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center justify-between px-1">
            <span>Approved Slots ({approved.length})</span>
            <span className="w-5 h-5 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-[10px] flex items-center justify-center font-bold">
              {approved.length}
            </span>
          </h4>

          {approved.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center text-xs text-text-muted">
              Your calendar is completely empty. Is this actually happening?
            </div>
          ) : (
            approved.map((b) => {
              const bribe = getBribeInfo(b.bribe);
              return (
                <div key={b.id} className="glass-card rounded-xl p-5 border border-glass-border flex flex-col gap-3 hover:border-emerald-500/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-extrabold text-text-main text-base leading-tight">{b.name}</h5>
                      <span className="text-[10px] text-text-muted font-bold">{b.social || "No social"}</span>
                    </div>
                    <span className="text-xs bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-bold px-2 py-0.5 rounded uppercase">
                      {b.time}
                    </span>
                  </div>

                  <div className="text-xs text-text-muted">
                    <div>📅 {b.date}</div>
                    <div>🧋 Bribe: {bribe.icon} {bribe.label}</div>
                  </div>

                  <button
                    onClick={() => handleDelete(b.id)}
                    className="w-full text-center text-[10px] text-text-muted hover:text-rose-400 uppercase mt-1 cursor-pointer"
                  >
                    Cancel Appointment
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* REJECTED COLUMN */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-rose-400 flex items-center justify-between px-1">
            <span>Rejected ({rejected.length})</span>
            <span className="w-5 h-5 rounded-full bg-rose-400/10 border border-rose-400/20 text-[10px] flex items-center justify-center font-bold">
              {rejected.length}
            </span>
          </h4>

          {rejected.length === 0 ? (
            <div className="glass-card rounded-xl p-6 text-center text-xs text-text-muted">
              No rejections yet. You are being very nice today.
            </div>
          ) : (
            rejected.map((b) => (
              <div key={b.id} className="glass-card rounded-xl p-5 border border-glass-border flex flex-col gap-3 hover:border-rose-500/30">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-extrabold text-text-main text-base leading-tight">{b.name}</h5>
                    <span className="text-[10px] text-text-muted font-bold">{b.social || "No social"}</span>
                  </div>
                  <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold px-2 py-0.5 rounded uppercase">
                    {b.time}
                  </span>
                </div>

                <div className="text-xs text-text-muted">
                  <div>📅 {b.date}</div>
                  <div className="mt-1.5 p-2 bg-rose-950/20 rounded border border-rose-900/30 italic text-rose-300">
                    "{b.rejectionReason}"
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(b.id)}
                  className="w-full text-center text-[10px] text-text-muted hover:text-text-main uppercase mt-1 cursor-pointer"
                >
                  Clear Record
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
