'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { AdBanner } from '@daily-apps/shared';

// === Alarm Sound Generators ===
type AlarmType = 'bell' | 'chime' | 'beep' | 'melody';

const ALARM_OPTIONS: { id: AlarmType; label: string; icon: string }[] = [
  { id: 'bell', label: '벨', icon: '🔔' },
  { id: 'chime', label: '차임', icon: '🎵' },
  { id: 'beep', label: '비프', icon: '📢' },
  { id: 'melody', label: '멜로디', icon: '🎶' },
];

function playAlarm(type: AlarmType) {
  const ctx = new AudioContext();

  const playTone = (freq: number, start: number, duration: number, gainVal = 0.3, waveType: OscillatorType = 'sine') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveType;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainVal, ctx.currentTime + start);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + duration);
  };

  switch (type) {
    case 'bell':
      // Classic bell: 3 dings
      [0, 0.4, 0.8].forEach((t) => {
        playTone(830, t, 0.35, 0.3, 'sine');
        playTone(1660, t, 0.25, 0.1, 'sine');
      });
      break;
    case 'chime':
      // Ascending chime
      [523, 659, 784, 1047].forEach((freq, i) => {
        playTone(freq, i * 0.25, 0.4, 0.25, 'sine');
      });
      break;
    case 'beep':
      // Short urgent beeps
      [0, 0.2, 0.4, 0.7, 0.9, 1.1].forEach((t) => {
        playTone(1000, t, 0.12, 0.35, 'square');
      });
      break;
    case 'melody':
      // Little melody: C-E-G-C
      const notes = [523, 659, 784, 1047, 784, 1047];
      notes.forEach((freq, i) => {
        playTone(freq, i * 0.2, 0.3, 0.2, 'triangle');
      });
      break;
  }

  // Vibrate on mobile
  if (navigator.vibrate) {
    navigator.vibrate([200, 100, 200, 100, 200]);
  }
}

// === Main Component ===
export default function TimerApp() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(5 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [alarmType, setAlarmType] = useState<AlarmType>('bell');
  const [showAlarmPicker, setShowAlarmPicker] = useState(false);
  const [presetChain, setPresetChain] = useState(false); // true = 연속 프리셋 클릭 중
  const alarmPlayed = useRef(false);

  const presets = [
    { label: '1m', value: 60 },
    { label: '3m', value: 180 },
    { label: '5m', value: 300 },
    { label: '10m', value: 600 },
    { label: '30m', value: 1800 },
    { label: '1h', value: 3600 },
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

  // Play alarm when finished
  useEffect(() => {
    if (isFinished && !alarmPlayed.current) {
      alarmPlayed.current = true;
      playAlarm(alarmType);
    }
    if (!isFinished) {
      alarmPlayed.current = false;
    }
  }, [isFinished, alarmType]);

  const displayHours = Math.floor(remainingSeconds / 3600);
  const displayMinutes = Math.floor((remainingSeconds % 3600) / 60);
  const displaySeconds = remainingSeconds % 60;
  const progress = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 100;
  const circumference = 2 * Math.PI * 140;
  const strokeDashoffset = circumference * (1 - progress / 100);

  const applyTime = useCallback((h: number, m: number, s: number) => {
    const ch = Math.max(0, Math.min(99, h));
    const cm = Math.max(0, Math.min(59, m));
    const cs = Math.max(0, Math.min(59, s));
    setHours(ch);
    setMinutes(cm);
    setSeconds(cs);
    const total = ch * 3600 + cm * 60 + cs;
    setTotalSeconds(total);
    setRemainingSeconds(total);
    setIsFinished(false);
  }, []);

  // 수동 입력 시 프리셋 체인 끊기
  const handleManualTime = useCallback((h: number, m: number, s: number) => {
    applyTime(h, m, s);
    setPresetChain(false);
  }, [applyTime]);

  const handlePreset = useCallback((secs: number) => {
    // 첫 클릭: 리셋 후 해당 시간으로, 연속 클릭: 누적
    const base = presetChain ? totalSeconds : 0;
    const newTotal = base + secs;
    const clamped = Math.min(newTotal, 99 * 3600 + 59 * 60 + 59);
    const h = Math.floor(clamped / 3600);
    const m = Math.floor((clamped % 3600) / 60);
    const s = clamped % 60;
    applyTime(h, m, s);
    setIsRunning(false);
    setPresetChain(true);
  }, [applyTime, totalSeconds, presetChain]);

  const handleStart = () => {
    if (remainingSeconds <= 0) {
      const total = hours * 3600 + minutes * 60 + seconds;
      if (total <= 0) return;
      setTotalSeconds(total);
      setRemainingSeconds(total);
    }
    setIsRunning(true);
    setIsFinished(false);
    setPresetChain(false);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setTotalSeconds(0);
    setRemainingSeconds(0);
    setPresetChain(false);
  };

  // 종료: 알림 끄고 초기 상태로
  const handleDismiss = () => {
    setIsFinished(false);
    setRemainingSeconds(0);
    setTotalSeconds(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setPresetChain(false);
  };

  // 재설정: 처음 설정한 시간으로 되돌리기
  const handleRestart = () => {
    setIsFinished(false);
    setRemainingSeconds(totalSeconds);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    setHours(h);
    setMinutes(m);
    setSeconds(s);
    setPresetChain(false);
  };

  const ringColor = isFinished ? '#ef4444' : isRunning ? '#22d3ee' : '#818cf8';
  const glowColor = isFinished ? 'rgba(239,68,68,0.4)' : isRunning ? 'rgba(34,211,238,0.3)' : 'rgba(129,140,248,0.3)';

  const inputClass = "w-14 text-center text-xl font-mono bg-white/5 border border-white/10 rounded-xl py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 backdrop-blur-sm";

  const currentAlarm = ALARM_OPTIONS.find((a) => a.id === alarmType)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">

        {/* Title + Alarm Picker */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white/90 tracking-wide">TIMER</h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto mt-2 rounded-full" />
        </div>

        {/* Timer Ring */}
        <div className="relative w-72 h-72">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeDasharray={`${circumference}`} />
            <circle
              cx="150" cy="150" r="140" fill="none"
              stroke={ringColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${circumference}`} strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease', filter: `drop-shadow(0 0 12px ${glowColor})` }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isFinished ? (
              <div className="text-center animate-pulse">
                <p className="text-5xl mb-2">🔔</p>
                <p className="text-lg font-semibold text-red-400">Time&apos;s up!</p>
              </div>
            ) : (
              <>
                <span className="text-5xl font-mono font-light text-white tabular-nums tracking-wider">
                  {String(displayHours).padStart(2, '0')}
                  <span className="animate-pulse text-white/50">:</span>
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
          <div className="flex items-center gap-2">
            <input type="text" inputMode="numeric" value={String(hours).padStart(2, '0')}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); handleManualTime(Math.min(99, Number(v)), minutes, seconds); }}
              onFocus={(e) => e.target.select()} className={inputClass} />
            <span className="text-white/30 text-lg font-light">:</span>
            <input type="text" inputMode="numeric" value={String(minutes).padStart(2, '0')}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); handleManualTime(hours, Math.min(59, Number(v)), seconds); }}
              onFocus={(e) => e.target.select()} className={inputClass} />
            <span className="text-white/30 text-lg font-light">:</span>
            <input type="text" inputMode="numeric" value={String(seconds).padStart(2, '0')}
              onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); handleManualTime(hours, minutes, Math.min(59, Number(v))); }}
              onFocus={(e) => e.target.select()} className={inputClass} />
          </div>
        )}

        {/* Presets */}
        {!isRunning && (
          <div className="flex justify-center gap-1.5">
            {presets.map((p) => (
              <button key={p.value} onClick={() => handlePreset(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                  totalSeconds === p.value && !isFinished
                    ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10 hover:text-white/70'
                }`}>
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Alarm Selector */}
        {!isRunning && (
          <div className="relative">
            <button
              onClick={() => setShowAlarmPicker(!showAlarmPicker)}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white/80 transition-all"
            >
              <span>{currentAlarm.icon}</span>
              <span>{currentAlarm.label}</span>
              <span className="text-white/30 text-xs">▼</span>
            </button>

            {showAlarmPicker && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 border border-white/10 rounded-xl p-2 flex gap-1 shadow-xl">
                {ALARM_OPTIONS.map((alarm) => (
                  <button
                    key={alarm.id}
                    onClick={() => {
                      setAlarmType(alarm.id);
                      setShowAlarmPicker(false);
                      playAlarm(alarm.id);
                    }}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-all ${
                      alarmType === alarm.id
                        ? 'bg-indigo-500/30 text-indigo-300'
                        : 'text-white/50 hover:bg-white/10 hover:text-white/70'
                    }`}
                  >
                    <span className="text-lg">{alarm.icon}</span>
                    <span>{alarm.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Controls */}
        <div className="flex gap-4">
          {isFinished ? (
            <>
              <button onClick={handleDismiss}
                className="group relative px-8 py-3.5 rounded-2xl text-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-500 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 rounded-2xl shadow-lg shadow-rose-500/25 group-hover:shadow-rose-500/40 transition-shadow" />
                <span className="relative">✕ 종료</span>
              </button>
              <button onClick={handleRestart}
                className="group relative px-8 py-3.5 rounded-2xl text-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 rounded-2xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow" />
                <span className="relative">↻ 재설정</span>
              </button>
            </>
          ) : !isRunning ? (
            <>
              <button onClick={handleStart}
                className="group relative px-10 py-3.5 rounded-2xl text-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 rounded-2xl shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow" />
                <span className="relative">
                  {remainingSeconds < totalSeconds ? '▶ 재시작' : '▶ 시작'}
                </span>
              </button>
              <button onClick={handleReset}
                className="px-6 py-3.5 bg-white/5 border border-white/10 text-white/50 rounded-2xl text-lg font-semibold hover:bg-white/10 hover:text-white/70 transition-all duration-300 hover:scale-105 active:scale-95">
                ↺
              </button>
            </>
          ) : (
            <>
              <button onClick={handlePause}
                className="px-10 py-3.5 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-2xl text-lg font-semibold hover:bg-amber-500/30 transition-all duration-300 hover:scale-105 active:scale-95">
                ⏸ 일시정지
              </button>
              <button onClick={handleReset}
                className="px-6 py-3.5 bg-white/5 border border-white/10 text-white/50 rounded-2xl text-lg font-semibold hover:bg-white/10 hover:text-white/70 transition-all duration-300 hover:scale-105 active:scale-95">
                ↺
              </button>
            </>
          )}
        </div>

      </div>

      <div className="relative z-10 w-full max-w-sm mt-8">
        <AdBanner />
      </div>

      <p className="mt-4 text-white/30 text-xs tracking-wider">DAILY APPS — DAY 001</p>
    </div>
  );
}
