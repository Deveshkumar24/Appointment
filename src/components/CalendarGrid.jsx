"use client";

import React, { useState, useEffect } from "react";

export default function CalendarGrid({ selectedDate, setSelectedDate, selectedTime, setSelectedTime, bookings = [] }) {
  const [weekdays, setWeekdays] = useState([]);

  // Generate next 7 weekdays
  useEffect(() => {
    const dates = [];
    const today = new Date();
    let current = new Date(today);

    while (dates.length < 7) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) { // Exclude Saturday and Sunday
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
    setWeekdays(dates);

    // Default select the first weekday if none selected
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].toISOString().split("T")[0]);
    }
  }, [selectedDate, setSelectedDate]);

  // Hourly slots 9 AM - 5 PM (17:00 is end, so last slot is 16:00-17:00)
  const timeSlots = [
    { time: "09:00", label: "09:00 AM", note: "Early standup hour" },
    { time: "10:00", label: "10:00 AM", note: "Prime coffee buzz" },
    { time: "11:00", label: "11:00 AM", note: "Existential dread starts" },
    { time: "12:00", label: "12:00 PM", note: "Pre-lunch starvation" },
    { time: "13:00", label: "01:00 PM", note: "LUNCH - ENTER AT OWN RISK", isLunch: true },
    { time: "14:00", label: "02:00 PM", note: "Post-lunch food coma" },
    { time: "15:00", label: "03:00 PM", note: "Checking clock every 5m" },
    { time: "16:00", label: "04:00 PM", note: "Pretending to resolve bugs" }
  ];

  const formatDate = (dateObj) => {
    return dateObj.toISOString().split("T")[0];
  };

  const getDayName = (dateObj) => {
    return dateObj.toLocaleDateString("en-US", { weekday: "short" });
  };

  const getDayNum = (dateObj) => {
    return dateObj.getDate();
  };

  const getMonthName = (dateObj) => {
    return dateObj.toLocaleDateString("en-US", { month: "short" });
  };

  const isSlotBooked = (date, time) => {
    return bookings.some(
      (b) => b.date === date && b.time === time && b.status === "approved"
    );
  };

  const isSlotPending = (date, time) => {
    return bookings.some(
      (b) => b.date === date && b.time === time && b.status === "pending"
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Date Selector */}
      <div>
        <label className="text-sm font-bold uppercase tracking-widest text-text-muted block mb-3">
          Step 1: Pick a Date (Weekdays Only)
        </label>
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-7 sm:gap-2">
          {weekdays.map((day) => {
            const dateStr = formatDate(day);
            const isSelected = selectedDate === dateStr;
            const isToday = formatDate(new Date()) === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => {
                  setSelectedDate(dateStr);
                  setSelectedTime(""); // Reset time on date change
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer min-w-[78px] sm:min-w-0 sm:w-full ${
                  isSelected
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "glass-card text-text-main border-glass-border hover:border-primary/45"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                  {getDayName(day)}
                </span>
                <span className="text-xl font-extrabold my-1">{getDayNum(day)}</span>
                <span className="text-[10px] font-semibold opacity-60">
                  {getMonthName(day)} {isToday && "• Today"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selector */}
      <div>
        <label className="text-sm font-bold uppercase tracking-widest text-text-muted block mb-3">
          Step 2: Choose a Time Slot (9:00 AM - 5:00 PM)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
          {timeSlots.map(({ time, label, note, isLunch }) => {
            const booked = isSlotBooked(selectedDate, time);
            const pending = isSlotPending(selectedDate, time);
            const isSelected = selectedTime === time;

            let buttonClass = "";
            let statusText = note;
            let isDisabled = false;

            if (booked) {
              buttonClass = "bg-rose-500/10 border-rose-500/20 text-rose-500/50 line-through cursor-not-allowed";
              statusText = "❌ Locked by someone else";
              isDisabled = true;
            } else if (pending) {
              buttonClass = "bg-amber-500/10 border-amber-500/20 text-amber-500/70 cursor-not-allowed";
              statusText = "⏳ Pending Aditi's review";
              isDisabled = true;
            } else if (isSelected) {
              buttonClass = "bg-secondary border-secondary text-white shadow-lg shadow-secondary/20 scale-105";
            } else if (isLunch) {
              buttonClass = "glass-card text-amber-500 border-amber-500/20 hover:border-amber-500/50";
            } else {
              buttonClass = "glass-card text-text-main border-glass-border hover:border-primary/45";
            }

            return (
              <button
                key={time}
                type="button"
                disabled={isDisabled}
                onClick={() => setSelectedTime(time)}
                className={`flex flex-col p-3 rounded-xl border text-left transition-all ${buttonClass} ${
                  !isDisabled ? "cursor-pointer hover:shadow-md" : ""
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-extrabold text-sm">{label}</span>
                  {isLunch && !booked && !pending && (
                    <span className="text-[10px] bg-amber-500/10 text-amber-400 font-bold px-1.5 py-0.5 rounded border border-amber-500/20">
                      Spicy
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-zinc-400 mt-1 line-clamp-1">
                  {statusText}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
