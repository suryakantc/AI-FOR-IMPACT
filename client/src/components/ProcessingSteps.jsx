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
    <div className="w-full bg-surface-card border border-surface-border rounded-[20px] p-6 shadow-xl animate-fade-in">
      <h3 className="text-lg font-extrabold font-heading text-text mb-6 flex items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        Processing Complaint...
      </h3>
      <div className="flex flex-wrap md:flex-nowrap items-stretch gap-3 w-full">
        {stepsConfig.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = activeStep === step.id;
          const isPending = step.id > activeStep;

          return (
            <div
              key={step.id}
              className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 flex-1 min-w-[140px] ${
                isActive
                  ? 'bg-surface-hover border-primary/55 text-text shadow-[0_0_12px_rgba(124,58,237,0.15)]'
                  : isCompleted
                  ? 'bg-surface-card border-success/25 text-text-muted opacity-80'
                  : 'bg-surface-card border-surface-border text-text-dim'
              }`}
            >
              <div className="flex items-center justify-center w-6 h-6 shrink-0">
                {isCompleted ? (
                  <div className="bg-success/20 text-success p-1 rounded-full animate-scale-in">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : isActive ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-primary" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-text-dim/40" />
                )}
              </div>
              <span className="font-semibold text-xs leading-snug">{step.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
