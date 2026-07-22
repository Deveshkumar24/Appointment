"use client";

import React, { useState, useEffect } from "react";
import StatusMeter from "../components/StatusMeter";
import CalendarGrid from "../components/CalendarGrid";
import BookingForm from "../components/BookingForm";
import Confetti from "../components/Confetti";
import AdminDashboard from "../components/AdminDashboard";
import { INITIAL_BOOKINGS, FUNNY_STATUSES, FUNNY_REJECTIONS } from "../utils/constants";

export default function Home() {
  const [bookings, setBookings] = useState([]);
  const [busyLevel, setBusyLevel] = useState(99);
  const [currentStatus, setCurrentStatus] = useState("Ignoring 47 unread Slack notifications");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [confettiActive, setConfettiActive] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [analyzingIds, setAnalyzingIds] = useState({}); // Tracking which booking IDs are being "reviewed"
  const [activeTab, setActiveTab] = useState("book"); // 'book' or 'admin'

  // Initialize data from localStorage or fallback
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedBookings = localStorage.getItem("aditi_bookings");
      const storedBusy = localStorage.getItem("aditi_busy_level");
      const storedStatus = localStorage.getItem("aditi_status");

      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      } else {
        // Start with an empty board by default
        setBookings([]);
        localStorage.setItem("aditi_bookings", JSON.stringify([]));
      }

      if (storedBusy) {
        setBusyLevel(Number(storedBusy));
      } else {
        setBusyLevel(99);
      }

      if (storedStatus) {
        setCurrentStatus(storedStatus);
      } else {
        setCurrentStatus("Ignoring 47 unread Slack notifications");
      }
    }
  }, []);

  // Sync bookings to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("aditi_bookings", JSON.stringify(bookings));
  }, [bookings]);

  const handleClearBoard = () => {
    setBookings([]);
  };

  // Make Aditi's status cycle every 12 seconds to make the app feel alive and "live-updating"
  useEffect(() => {
    const interval = setInterval(() => {
      const randomStatus = FUNNY_STATUSES[Math.floor(Math.random() * FUNNY_STATUSES.length)];
      setCurrentStatus(randomStatus.text);
      setBusyLevel(randomStatus.level);
      localStorage.setItem("aditi_status", randomStatus.text);
      localStorage.setItem("aditi_busy_level", String(randomStatus.level));
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleBookingSubmit = (newBooking) => {
    const bookingId = `booking-${Date.now()}`;
    const bookingWithId = {
      ...newBooking,
      id: bookingId,
      status: "pending",
      rejectionReason: ""
    };

    setBookings((prev) => [bookingWithId, ...prev]);
    setSelectedTime(""); // Reset slot picker

    // Trigger confetti for application submission!
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const filteredBookings = searchName
    ? bookings.filter((b) => b.name.toLowerCase().includes(searchName.toLowerCase()))
    : bookings.slice(0, 5); // show last 5 by default

  return (
    <main className="min-h-screen relative bg-background overflow-hidden text-text-main flex flex-col justify-between transition-colors duration-300">
      {/* Background neon glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[130px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] -z-10 pointer-events-none"></div>

      {/* Confetti element */}
      <Confetti active={confettiActive} />

      {/* Navigation header */}
      <header className="border-b border-glass-border bg-glass-bg backdrop-blur-md sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-black text-xl text-white shadow-lg shadow-primary/20">
              📅
            </div>
            <div>
              <h1 className="text-xl font-black text-text-main tracking-tight leading-none">
                MEET ADITI
              </h1>
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1 block">
                The 9-to-5 Appointment Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-[11px] font-bold text-text-muted bg-dark-surface border border-glass-border px-3 py-1 rounded-full">
              Status: Fully Busy ☕
            </span>
            {/* Navigation Tabs */}
            <div className="flex bg-dark-surface/60 p-1 rounded-xl border border-glass-border">
              <button
                onClick={() => setActiveTab("book")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "book"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                🤝 Apply
              </button>
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-secondary text-white shadow-md"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                🔒 Portal
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        {activeTab === "book" ? (
          <>
            {/* Live Busy-ness status */}
            <StatusMeter busyLevel={busyLevel} currentStatus={currentStatus} />

            {/* Form and Calendar Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 flex flex-col gap-6">
                <CalendarGrid
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  bookings={bookings}
                />
              </div>
              <div className="lg:col-span-5">
                <BookingForm
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onSubmit={handleBookingSubmit}
                />
              </div>
            </div>

            {/* Live Application status board */}
            <div className="glass-card rounded-2xl p-6 border border-glass-border">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-zinc-800/80 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-text-main">Live Application Board</h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    See who successfully bribed Aditi or got roasted in real-time.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Filter Input */}
                  <input
                    type="text"
                    placeholder="🔍 Search name..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="rounded-xl px-3 py-1.5 glass-input text-xs text-text-main w-full sm:w-36"
                  />
                  {/* Clear button */}
                  {bookings.length > 0 && (
                    <button
                      onClick={handleClearBoard}
                      className="px-3 py-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                    >
                      Clear Board
                    </button>
                  )}
                </div>
              </div>

              {/* Status List */}
              <div className="flex flex-col gap-3">
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-500">
                    No bookings found. Apply above to be the first!
                  </div>
                ) : (
                  filteredBookings.map((b) => {
                    let badgeClass = "";
                    let containerClass = "border-glass-border";

                    if (b.status === "approved") {
                      badgeClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                      containerClass = "border-emerald-500/20 hover:border-emerald-500/30";
                    } else if (b.status === "rejected") {
                      badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
                      containerClass = "border-rose-500/20 hover:border-rose-500/30";
                    } else {
                      badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    }

                    const meetingDateFormatted = new Date(b.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });

                    return (
                      <div
                        key={b.id}
                        className={`p-4 rounded-xl border bg-dark-surface/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all ${containerClass}`}
                      >
                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-text-main">{b.name}</span>
                            <span className="text-[10px] text-text-muted font-bold capitalize">
                              ({b.relationship})
                            </span>
                          </div>
                          <p className="text-xs text-text-muted line-clamp-1">
                            📅 {meetingDateFormatted} at {b.time} • Bribe:{" "}
                            <span className="text-text-main font-bold">
                              {b.bribe === "none" ? "Nothing (Very Bold)" : b.bribe}
                            </span>
                          </p>
                          {b.status === "rejected" && b.rejectionReason ? (
                            <p className="text-[11px] text-rose-400 bg-rose-950/10 border border-rose-900/30 p-2 rounded mt-1 italic max-w-lg">
                              ❌ Roasted: "{b.rejectionReason}"
                            </p>
                          ) : null}
                        </div>

                        <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border tracking-widest self-start sm:self-auto ${badgeClass}`}>
                          {b.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        ) : (
          <AdminDashboard
            bookings={bookings}
            setBookings={setBookings}
            busyLevel={busyLevel}
            setBusyLevel={setBusyLevel}
            currentStatus={currentStatus}
            setCurrentStatus={setCurrentStatus}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-glass-border bg-glass-bg/50 py-6 mt-12 text-center text-xs text-text-muted">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} Busy Queen Scheduler. Strictly for fun and procrastination.</p>
          <p className="mt-1 font-semibold text-text-muted/80">
            Aditi is probably sleeping right now. Do not spam.
          </p>
        </div>
      </footer>
    </main>
  );
}
