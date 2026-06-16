import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { CheckCircle2, AlertCircle, Sparkles, Smile } from "lucide-react";

interface RatingDialProps {
  score: number;
}

export function RatingDial({ score }: RatingDialProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Smooth counter animation
    let start = 0;
    const end = score;
    if (start === end) return;

    // determine increment time based on total difference
    const totalDuration = 1000; // ms
    const incrementTime = Math.max(Math.floor(totalDuration / end), 10);
    const timer = setInterval(() => {
      start += 1;
      setAnimatedScore(start);
      if (start >= end) {
        setAnimatedScore(end);
        clearInterval(timer);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [score]);

  // Determine colors and messages
  let strokeColor = "stroke-rose-500";
  let textColor = "text-rose-600";
  let bgColor = "bg-rose-50 border-rose-200 text-rose-800";
  let statusTitle = "Kurang Ramah ATS";
  let statusDesc = "CV Anda memiliki kecocokan rendah dan berisiko ditolak otomatis oleh filter ATS karena kurangnya kata kunci penting.";
  let Icon = AlertCircle;

  if (score >= 55 && score < 75) {
    strokeColor = "stroke-amber-500";
    textColor = "text-amber-600";
    bgColor = "bg-amber-50 border-amber-200 text-amber-800";
    statusTitle = "Berpotensi Kuat";
    statusDesc = "CV Anda cukup baik, namun masih ada beberapa kata kunci kritis dan penulisan pengalaman kerja yang butuh sedikit polesan.";
    Icon = Smile;
  } else if (score >= 75) {
    strokeColor = "stroke-emerald-500";
    textColor = "text-emerald-600";
    bgColor = "bg-emerald-50 border-emerald-200 text-emerald-800";
    statusTitle = "Sangat Ramah ATS!";
    statusDesc = "Luar biasa! CV Anda sangat selaras dengan kriteria Loker. Rekomendasi di bawah akan membuatnya kian sempurna.";
    Icon = CheckCircle2;
  }

  // Circular calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        
        {/* Animated Radial Circle */}
        <div className="relative flex items-center justify-center w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              className="text-stone-100 fill-none"
              strokeWidth="10"
              stroke="currentColor"
              r={radius}
              cx="80"
              cy="80"
            />
            {/* Foreground progress circle */}
            <motion.circle
              className={`${strokeColor} fill-none stroke-linecap-round transition-all duration-300`}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              r={radius}
              cx="80"
              cy="80"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl sm:text-4xl font-display font-extrabold ${textColor}`}>
              {animatedScore}%
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-stone-500 uppercase tracking-widest mt-0.5">
              Skor ATS
            </span>
          </div>
        </div>

        {/* Evaluation Text Block */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center lg:items-start sm:gap-2 justify-center lg:justify-start">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${bgColor} mb-2`}>
              <Icon className="h-4 w-4" />
              {statusTitle}
            </span>
          </div>
          <h3 className="text-lg font-display font-bold text-stone-900 mt-1">
            Persentase Kecocokan CV Anda
          </h3>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            {statusDesc}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone-500 font-mono">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
              Kurang: &lt;55%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              Cukup: 55%-74%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              Optimal: &ge;75%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
