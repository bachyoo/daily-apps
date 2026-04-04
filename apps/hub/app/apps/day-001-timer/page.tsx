'use client';

import { useState, useEffect, useCallback } from 'react';

export default function TimerApp() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(5 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const presets = [
    { label: '1m', value: 60 },
    { label: '3m', value: 180 },
    { label: '5m', value: 300 },
    { label: '10m', value: 600 },
    { label: '15m', value: 900 },
    { label: '30m', value: 1800 },
  ];

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) return;
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  const displayMinutes = Math.floor(remainingSeconds / 60);
  const displaySeconds = remainingSeconds % 60;
  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 100;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const handlePreset = useCallback((secs: number) => {
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    setMinutes(Math.floor(secs / 60));
    setSeconds(secs % 60);
    setIsRunning(false);
    setIsFinished(false);
  }, []);

  const handleStart = () => {
    if (remainingSeconds <= 0) {
      const total = minutes * 60 + seconds;
      if (total <= 0) return;
      setTotalSeconds(total);
      setRemainingSeconds(total);
    }
    setIsRunning(true);
    setIsFinished(false);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setRemainingSeconds(totalSeconds);
  };

  const handleCustomTime = (m: number, s: number) => {
    const cm = Math.max(0, Math.min(99, m));
    const cs = Math.max(0, Math.min(59, s));
    setMinutes(cm);
    setSeconds(cs);
    const total = cm * 60 + cs;
    setTotalSeconds(total);
    setRemainingSeconds(total);
    setIsFinished(false);
  };

  // Dynamic colors based on state
  const ringColor = isFinished
    ? '#ef4444'
    : isRunning
      ? '#22d3ee'
      : '#818cf8';
  const glowColor = isFinished
    ? 'rgba(239,68,68,0.4)'
    : isRunning
      ? 'rgba(34,211,238,0.3)'
      : 'rgba(129,140,248,0.3)';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-3xl" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white/90 tracking-wide">TIMER</h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto mt-2 rounded-full" />
        </div>

        {/* Timer Ring */}
        <div className="relative w-72 h-72">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
            {/* Background ring */}
            <circle
              cx="150" cy="150" r="140"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            {/* Track ring */}
            <circle
              cx="150" cy="150" r="140"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="8"
              strokeDasharray={`${circumference}`}
            />
            {/* Progress ring */}
            <circle
              cx="150" cy="150" r="140"
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
                filter: `drop-shadow(0 0 12px ${glowColor})`,
              }}
            />
            {/* Dot indicator at progress end */}
            {!isFinished && (
              <circle
                cx={150 + 140 * Math.cos(2 * Math.PI * progress / 100 - Math.PI / 2)}
                cy={150 + 140 * Math.sin(2 * Math.PI * progress / 100 - Math.PI / 2)}
                r="6"
                fill={ringColor}
                style={{ filter: `drop-shadow(0 0 8px ${glowColor})`, transition: 'all 1s linear' }}
              />
            )}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isFinished ? (
              <div className="text-center animate-pulse">
                <p className="text-5xl mb-2">🔔</p>
                <p className="text-lg font-semibold text-red-400">Time&apos;s up!</p>
              </div>
            ) : (
              <>
                <span className="text-6xl font-mono font-light text-white tabular-nums tracking-wider">
                  {String(displayMinutes).padStart(2, '0')}
                  <span className="animate-pulse text-white/50">:</span>
                  {String(displaySeconds).padStart(2, '0')}
                </span>
                {isRunning && (
                  <span className="text-xs text-white/30 mt-2 uppercase tracking-widest">running</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Custom Time Input */}
        {!isRunning && !isFinished && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0} max={99}
              value={minutes}
              onChange={(e) => handleCustomTime(Number(e.target.value), seconds)}
              className="w-16 text-center text-xl font-mono bg-white/5 border border-white/10 rounded-xl py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm"
            />
            <span className="text-white/30 text-xl font-light">:</span>
            <input
              type="number"
              min={0} max={59}
              value={seconds}
              onChange={(e) => handleCustomTime(minutes, Number(e.target.value))}
              className="w-16 text-center text-xl font-mono bg-white/5 border border-white/10 rounded-xl py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm"
            />
          </div>
        )}

        {/* Presets */}
        {!isRunning && (
          <div className="flex flex-wrap justify-center gap-2">
            {presets.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePreset(p.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  totalSeconds === p.value && !isFinished
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white/70'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="group relative px-10 py-3.5 rounded-2xl text-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-2xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow" />
              <span className="relative">
                {isFinished || remainingSeconds < totalSeconds ? '▶ 재시작' : '▶ 시작'}
              </span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-10 py-3.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-2xl text-lg font-semibold hover:bg-amber-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              ⏸ 일시정지
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-3.5 bg-white/5 border border-white/10 text-white/50 rounded-2xl text-lg font-semibold hover:bg-white/10 hover:text-white/70 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            ↺
          </button>
        </div>

      </div>

      {/* Minimal footer */}
      <p className="absolute bottom-4 text-white/10 text-xs tracking-wider">DAILY APPS — DAY 001</p>
    </div>
  );
}
