import React, { useEffect, useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

const stepsConfig = [
  { id: 1, text: 'Detecting language...' },
  { id: 2, text: 'Extracting complaint data...' },
  { id: 3, text: 'Classifying issue...' },
  { id: 4, text: 'Calculating urgency...' },
  { id: 5, text: 'Generating ticket...' },
];

export default function ProcessingSteps({ isProcessing, onComplete }) {
  const [activeStep, setActiveStep] = useState(0); // 0 means not started
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    if (!isProcessing) {
      setActiveStep(0);
      setCompletedSteps([]);
      return;
    }

    let current = 1;
    setActiveStep(1);

    const interval = setInterval(() => {
      setCompletedSteps((prev) => [...prev, current]);
      current += 1;
      
      if (current <= stepsConfig.length) {
        setActiveStep(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [isProcessing, onComplete]);

  if (!isProcessing) return null;

  return (
    <div className="w-full glass-card rounded-[24px] p-6 shadow-2xl animate-fade-in border border-surface-border">
      <h3 className="text-sm font-bold font-heading text-text uppercase tracking-widest mb-6 flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary-light" />
        Processing Complaint...
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
        {stepsConfig.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = activeStep === step.id;
          const isPending = step.id > activeStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'bg-surface-hover/80 border-primary/60 text-text shadow-[0_0_15px_rgba(124,58,237,0.2)]'
                  : isCompleted
                  ? 'bg-success/5 border-success/30 text-text-muted opacity-90'
                  : 'bg-surface/30 border-surface-border text-text-dim'
              }`}
            >
              <div className="flex items-center justify-center w-6 h-6 shrink-0">
                {isCompleted ? (
                  <div className="bg-success/20 text-success p-1 rounded-full animate-scale-in">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : isActive ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-primary-light" />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-text-dim/40" />
                )}
              </div>
              <span className="font-bold text-[11px] uppercase tracking-wider leading-snug">{step.text}</span>
            </div>
        })}
      </div>
    </div>
  );
}

