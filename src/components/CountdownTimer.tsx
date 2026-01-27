'use client';

import { useState, useEffect } from 'react';

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const difference = midnight.getTime() - now.getTime();

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-slate-400">Daily update in:</span>
      <div className="flex items-center gap-1 font-mono font-bold text-violet-400">
        <span className="bg-slate-800 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span>:</span>
        <span className="bg-slate-800 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span>:</span>
        <span className="bg-slate-800 px-2 py-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
