'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@daily-apps/shared';

export default function TimerApp() {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(5 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Presets
  const presets = [
    { label: '1분', value: 60 },
    { label: '3분', value: 180 },
    { label: '5분', value: 300 },
    { label: '10분', value: 600 },
    { label: '15분', value: 900 },
    { label: '30분', value: 1800 },
  ];

  // Timer tick
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

  // Format time display
  const displayMinutes = Math.floor(remainingSeconds / 60);
  const displaySeconds = remainingSeconds % 60;
  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  // Handlers
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
    const clamped_m = Math.max(0, Math.min(99, m));
    const clamped_s = Math.max(0, Math.min(59, s));
    setMinutes(clamped_m);
    setSeconds(clamped_s);
    const total = clamped_m * 60 + clamped_s;
    setTotalSeconds(total);
    setRemainingSeconds(total);
    setIsFinished(false);
  };

  return (
    <AppLayout appName="Timer">
      <div className="flex flex-col items-center gap-6">

        {/* Progress Ring */}
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              stroke={isFinished ? '#ef4444' : '#3b82f6'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isFinished ? (
              <div className="text-center">
                <p className="text-4xl mb-1">🔔</p>
                <p className="text-lg font-semibold text-red-500">완료!</p>
              </div>
            ) : (
              <span className="text-5xl font-mono font-bold text-gray-900 tabular-nums">
                {String(displayMinutes).padStart(2, '0')}:{String(displaySeconds).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        {/* Custom Time Input (only when not running) */}
        {!isRunning && !isFinished && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0} max={99}
              value={minutes}
              onChange={(e) => handleCustomTime(Number(e.target.value), seconds)}
              className="w-16 text-center text-lg font-mono border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500 font-semibold">:</span>
            <input
              type="number"
              min={0} max={59}
              value={seconds}
              onChange={(e) => handleCustomTime(minutes, Number(e.target.value))}
              className="w-16 text-center text-lg font-mono border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Preset Buttons */}
        {!isRunning && (
          <div className="flex flex-wrap justify-center gap-2">
            {presets.map((p) => (
              <button
                key={p.value}
                onClick={() => handlePreset(p.value)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  totalSeconds === p.value && !isFinished
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {isFinished || remainingSeconds < totalSeconds ? '재시작' : '시작'}
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-8 py-3 bg-yellow-500 text-white rounded-full text-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              일시정지
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-full text-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            초기화
          </button>
        </div>

      </div>
    </AppLayout>
  );
}
