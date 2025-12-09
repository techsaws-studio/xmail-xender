"use client";

import { motion } from "framer-motion";

import { SpamScoreResult } from "@/types/email";

import { cn } from "@/lib/utils";

import { ShieldAlert, ShieldCheck, ShieldHalf } from "lucide-react";

interface Props {
  result: SpamScoreResult | null;
}

export function SpamMeter({ result }: Props) {
  if (!result) return null;

  const { score, level } = result;

  const levelConfig = {
    low: {
      label: "Low Risk",
      color: "text-green-600",
      bar: "bg-green-500",
      icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
    },

    medium: {
      label: "Medium Risk",
      color: "text-yellow-600",
      bar: "bg-yellow-500",
      icon: <ShieldHalf className="h-4 w-4 text-yellow-600" />,
    },

    high: {
      label: "High Risk",
      color: "text-red-600",
      bar: "bg-red-500",
      icon: <ShieldAlert className="h-4 w-4 text-red-600" />,
    },
  };

  const cfg = levelConfig[level];

  return (
    <div className="mt-3 w-full">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1">
          {cfg.icon}
          <span className={cn("text-sm font-medium", cfg.color)}>
            {cfg.label}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">{score}/100</span>
      </div>

      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full", cfg.bar)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {result.issues.length > 0 && (
        <ul className="mt-2 text-xs text-muted-foreground list-disc list-inside space-y-1">
          {result.issues.slice(0, 3).map((issue, i) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
