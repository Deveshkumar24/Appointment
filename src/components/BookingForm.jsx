"use client";

import React, { useState, useEffect } from "react";
import { BRIBES } from "../utils/constants";

export default function BookingForm({ selectedDate, selectedTime, onSubmit }) {
  const [name, setName] = useState("");
  const [social, setSocial] = useState("");
  const [relationship, setRelationship] = useState("friend");
  const [urgency, setUrgency] = useState("medium");
  const [bribe, setBribe] = useState("none");
  const [purpose, setPurpose] = useState("");
  const [probability, setProbability] = useState(20);

  // Recalculate probability whenever selections change
  useEffect(() => {
    let score = 20; // Base score

    // Bribe impact
    const selectedBribe = BRIBES.find((b) => b.id === bribe);
    if (selectedBribe) {
      score += selectedBribe.probImpact;
    }

    // Relationship impact
    if (relationship === "bestie") score += 30;
    else if (relationship === "friend") score += 10;
    else if (relationship === "boss") score -= 25;
    else if (relationship === "stranger") score -= 40;

    // Urgency impact
    if (urgency === "emergency") score += 25;
    else if (urgency === "high") score += 10;
    else if (urgency === "low") score -= 15;

    // Time slot (Lunch hour at 1:00 PM / 13:00)
    if (selectedTime === "13:00") {
      score -= 30;
    }

    const finalProb = Math.max(0, Math.min(100, score));
    setProbability(finalProb);
  }, [bribe, relationship, urgency, selectedTime]);

  const getProbabilityFeedback = (prob) => {
    if (prob <= 0) return { text: "Instant Rejection (Aditi will block your number)", color: "text-rose-500", bg: "bg-rose-500/10", barColor: "bg-rose-600" };
    if (prob <= 35) return { text: "Highly Unlikely (Will read, mark as unread, and forget)", color: "text-amber-500", bg: "bg-amber-500/10", barColor: "bg-amber-600" };
    if (prob <= 65) return { text: "Coin Toss (Depends on her sleep levels and mood)", color: "text-pink-400", bg: "bg-pink-500/10", barColor: "bg-pink-500" };
    if (prob <= 85) return { text: "Looking Good (The bribe is working its magic)", color: "text-rose-400", bg: "bg-rose-500/10", barColor: "bg-rose-400" };
    return { text: "Calendar Clear! (Aditi is already waiting)", color: "text-emerald-400", bg: "bg-emerald-500/10", barColor: "bg-emerald-500" };
  };

  const feedback = getProbabilityFeedback(probability);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !selectedDate || !selectedTime) return;

    onSubmit({
      name,
      social,
      relationship,
      urgency,
      bribe,
      purpose,
      probability,
      date: selectedDate,
      time: selectedTime,
    });

    // Reset fields
    setName("");
    setSocial("");
    setRelationship("friend");
    setUrgency("medium");
    setBribe("none");
    setPurpose("");
  };

  const formattedDateString = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    : "";

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 border border-glass-border flex flex-col gap-6">
      <div className="border-b border-zinc-800/80 pb-4">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📝 Booking Application</span>
          {selectedTime && (
            <span className="text-xs bg-secondary/20 text-secondary border border-secondary/30 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {selectedTime}
            </span>
          )}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">
          {selectedDate ? `Selected Slot: ${formattedDateString} at ${selectedTime || '...?'}` : "Please select a date and time slot first!"}
        </p>
      </div>

      {!selectedDate || !selectedTime ? (
        <div className="text-center py-10 text-zinc-500">
          <p className="text-lg">👈 Choose a date and time to start the application process.</p>
          <p className="text-xs mt-2">Appointments are highly requested. Slots are finite.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Step 1: Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Devesh / Bestie"
                className="w-full rounded-xl px-4 py-2.5 glass-input text-sm text-white"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Social Handle / Email (for rejections)
              </label>
              <input
                type="text"
                value={social}
                onChange={(e) => setSocial(e.target.value)}
                placeholder="@instagram / email"
                className="w-full rounded-xl px-4 py-2.5 glass-input text-sm text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Who are you to Aditi?
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 glass-input text-sm text-white"
              >
                <option value="bestie">Best Friend (Tier 1 Access)</option>
                <option value="friend">Standard Friend (Tier 2 Access)</option>
                <option value="boss">Boss / Coworker (Potential Trigger)</option>
                <option value="stranger">Stranger (Low Priority)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                Urgency Level
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 glass-input text-sm text-white"
              >
                <option value="low">Low (Just want to gossip)</option>
                <option value="medium">Medium (Casual catchup)</option>
                <option value="high">High (Major crisis alert)</option>
                <option value="emergency">Aditi Emergency (I have food/drama for her)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Purpose of Meeting
            </label>
            <textarea
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="State your business. Make it funny or dramatic to get approved."
              className="w-full rounded-xl px-4 py-2.5 glass-input text-sm text-white resize-none"
            />
          </div>

          {/* Bribe Section */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Select Your Mandatory Bribe 🧋
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {BRIBES.map((b) => {
                const isSelected = bribe === b.id;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBribe(b.id)}
                    className={`group relative flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${isSelected
                        ? "bg-primary/20 border-primary text-white scale-[1.02]"
                        : "glass-card text-zinc-400 border-zinc-800 hover:border-zinc-700"
                      }`}
                  >
                    <span className="text-2xl mb-1">{b.icon}</span>
                    <span className="text-[11px] font-bold leading-tight text-white mb-1 line-clamp-1">{b.label}</span>
                    <span className="text-[9px] text-zinc-400 leading-tight line-clamp-1">{b.funnyNote}</span>

                    {/* Premium Hover Tooltip */}
                    <div className="absolute bottom-[108%] left-1/2 -translate-x-1/2 mb-2 w-48 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 flex flex-col items-center justify-center bg-zinc-950 border border-zinc-800 text-white rounded-xl p-2.5 shadow-2xl z-20 transition-all duration-200 ease-out">
                      <span className="font-extrabold text-[11px] text-white leading-tight mb-1">{b.label}</span>
                      <span className="text-[9px] text-zinc-400 leading-tight">{b.funnyNote}</span>
                      <div className="w-2 h-2 bg-zinc-950 border-r border-b border-zinc-800 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Approval Rate Probability Bar */}
          <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/80">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                Calculated Approval Rate
              </span>
              <span className={`text-base font-black ${feedback.color}`}>{probability}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden mb-2">
              <div
                className={`h-full ${feedback.barColor} transition-all duration-500 ease-out`}
                style={{ width: `${probability}%` }}
              ></div>
            </div>
            <div className={`text-[11px] font-semibold ${feedback.bg} ${feedback.color} px-3 py-1.5 rounded-lg border border-zinc-800/20`}>
              📢 {feedback.text}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-secondary/20 active:scale-[0.98] transition-all cursor-pointer text-sm tracking-widest uppercase mt-2"
          >
            Submit Application for Review
          </button>
        </div>
      )}
    </form>
  );
}
