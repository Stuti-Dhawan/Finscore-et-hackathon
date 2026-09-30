import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface ScoreGaugeProps {
  score: number;
}

export function ScoreGauge({ score }: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  let colorClass = "text-destructive";
  let strokeColor = "#ef4444"; // red-500
  let label = "Needs Attention ⚠️";

  if (score >= 85) {
    colorClass = "text-emerald-600 dark:text-emerald-500";
    strokeColor = "#059669";
    label = "Excellent 🌟";
  } else if (score >= 70) {
    colorClass = "text-primary";
    strokeColor = "#1a56db";
    label = "Good 💪";
  } else if (score >= 40) {
    colorClass = "text-yellow-500";
    strokeColor = "#eab308";
    label = "Fair 📈";
  }

  useEffect(() => {
    // Animate score number
    let start = 0;
    const end = score;
    if (start === end) return;
    
    let timer: any;
    const duration = 1500;
    const increment = end / (duration / 16); // 60fps

    const run = () => {
      start += increment;
      if (start >= end) {
        setAnimatedScore(end);
        if (end >= 80) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.4 },
            colors: ['#1a56db', '#059669', '#eab308']
          });
        }
      } else {
        setAnimatedScore(Math.floor(start));
        timer = requestAnimationFrame(run);
      }
    };
    timer = requestAnimationFrame(run);
    
    return () => cancelAnimationFrame(timer);
  }, [score]);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center w-64 h-64 mx-auto my-8">
      <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 200 200">
        {/* Background Circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-muted/50"
        />
        {/* Progress Circle */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          stroke={strokeColor}
          strokeWidth="12"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center mt-2">
        <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Total Score</span>
        <div className="flex items-baseline">
          <span className={`text-6xl font-display font-bold ${colorClass}`}>
            {animatedScore}
          </span>
          <span className="text-xl text-muted-foreground font-medium ml-1">/100</span>
        </div>
        <div className={`mt-2 px-3 py-1 rounded-full text-sm font-bold bg-background shadow-sm border ${colorClass.replace('text-', 'border-').replace('dark:text-emerald-500', '')}`}>
          {label}
        </div>
      </div>
    </div>
  );
}
