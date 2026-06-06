import React, { useState, useRef, useCallback } from 'react';
import ProcessingSteps from '../components/ProcessingSteps';
import ResultCard from '../components/ResultCard';
import { submitComplaint } from '../services/api';
import { Send, Sparkles, MessageSquareCode, ArrowRight, RotateCcw } from 'lucide-react';

const SUGGESTIONS = [
  'Hostel ke room 204 me fan 3 din se kharab hai',
  'Mess me khana bahut kharab mil raha hai, aaj dal me keeda mila',
  'Library me AC nahi chal raha, padhne me dikkat ho rahi hai',
  'Boys hostel floor 3 pe bathroom ka flush 1 week se tuta hai, paani beh raha hai',
];

export default function SubmitPage() {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Use refs to coordinate animation + API completion
  const apiResultRef = useRef(null);
  const apiDoneRef = useRef(false);
  const animDoneRef = useRef(false);

  const tryShowResult = () => {
    if (apiDoneRef.current && animDoneRef.current && apiResultRef.current) {
      setResult(apiResultRef.current);
      setIsProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setError('');
    setResult(null);
    apiResultRef.current = null;
    apiDoneRef.current = false;
    animDoneRef.current = false;
    setIsProcessing(true);

    try {
      const data = await submitComplaint(inputText);
      apiResultRef.current = data.data;
      apiDoneRef.current = true;
      tryShowResult();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit complaint. Try again.');
      setIsProcessing(false);
    }
  };

  const handleAnimationComplete = useCallback(() => {
    animDoneRef.current = true;
    tryShowResult();
  }, []);

  const autofill = (text) => {
    setInputText(text);
  };

  const handleReset = () => {
    setInputText('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-16 animate-fade-in">
      <div className="text-center mb-12 md:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold uppercase tracking-wider mb-5 shadow-lg shadow-primary/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Campus AI Workflow
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading tracking-tight mb-4">
          VaakTicket <span className="gradient-text-accent">AI</span>
        </h1>
        <p className="text-text-muted mt-3 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          Submit unstructured Hindi, English, or mixed-language complaints. Our AI instantly translates, structures, classifies, and routes them to the correct department.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 glass-card rounded-[24px] p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="complaint" className="block text-xs md:text-sm font-bold text-text-muted uppercase tracking-widest mb-3 font-heading">
                Explain your issue
              </label>
              <textarea
                id="complaint"
                rows={5}
                className="w-full glass-input rounded-xl p-4 md:p-5 text-text placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition duration-200 text-sm md:text-base leading-relaxed resize-none shadow-inner"
                placeholder="Apni complaint yahan likho... e.g. Hostel ke room 204 me fan kharab hai"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing}
              />
            </div>

            {error && (
              <div className="text-sm font-semibold text-danger bg-danger/10 border border-danger/20 p-3.5 rounded-xl animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing}
              className="w-full glow-button flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-primary hover:bg-primary-light text-white font-extrabold transition shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Analyzing Complaint...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Analyze & Route Ticket
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Clickable templates for quick demo */}
        <div className="glass-card rounded-[24px] p-6 shadow-2xl">
          <h3 className="text-xs font-bold font-heading text-text-muted uppercase tracking-widest mb-5 flex items-center gap-2">
            <MessageSquareCode className="w-4 h-4 text-primary-light" />
            Quick Demo Presets
          </h3>
          <div className="space-y-3">
            {SUGGESTIONS.map((text, idx) => (
              <button
                key={idx}
                onClick={() => autofill(text)}
                disabled={isProcessing}
                className="w-full text-left p-3.5 rounded-xl bg-surface-hover/30 border border-surface-border/50 hover:border-primary/40 text-xs text-text-muted hover:text-text hover:bg-surface-hover/80 transition duration-200 flex items-center justify-between group cursor-pointer"
              >
                <span className="line-clamp-2 pr-2 leading-relaxed font-medium">{text}</span>
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary-light transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Row: Animated Steps & Results */}
      <div className="space-y-8 pb-16">
        <ProcessingSteps
          isProcessing={isProcessing}
          apiDone={apiDoneRef.current}
          onComplete={handleAnimationComplete}
        />

        {result && (
          <div className="animate-fade-in-up space-y-8">
            <ResultCard complaint={result} />
            <div className="text-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-surface-card border border-surface-border text-text-muted hover:text-text hover:bg-surface-hover transition text-sm font-bold shadow-md cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Submit Another Complaint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
