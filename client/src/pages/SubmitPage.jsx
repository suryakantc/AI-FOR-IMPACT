import React, { useState } from 'react';
import ProcessingSteps from '../components/ProcessingSteps';
import ResultCard from '../components/ResultCard';
import { submitComplaint } from '../services/api';
import { Send, Sparkles, MessageSquareCode, ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
  'Hostel ke room 204 me fan 3 din se kharab hai',
  'Mess me khana bahut kharab mil raha hai, aaj dal me keeda mila',
  'Library me AC nahi chal raha, padhne me dikkat ho rahi hai',
  'Boys hostel floor 3 pe bathroom ka flush 1 week se tuta hai, paani beh raha hai',
];

export default function SubmitPage() {
  const [inputText, setInputText] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [tempResult, setTempResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setError('');
    setResult(null);
    setTempResult(null);
    setIsApiLoading(true);
    setIsProcessing(true);

    try {
      const data = await submitComplaint(inputText);
      // Wait for AI response to load and store temporarily
      setTempResult(data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit complaint. Try again.');
      setIsProcessing(false);
    } finally {
      setIsApiLoading(false);
    }
  };

  const handleAnimationComplete = () => {
    // When the visual steps finish, show the card
    setResult(tempResult);
    setIsProcessing(false);
  };

  const autofill = (text) => {
    setInputText(text);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-fade-in">
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm shadow-primary/5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Campus AI Workflow
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-text tracking-tight">
          VaakTicket <span className="text-primary-light">AI</span>
        </h1>
        <p className="text-text-muted mt-3 text-sm md:text-base max-w-xl mx-auto">
          Submit unstructured Hindi, English, or mixed-language complaints. Our AI instantly translates, structures, classifies, and routes them.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 bg-surface-card border border-surface-border rounded-[20px] p-6 md:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="complaint" className="block text-sm font-semibold text-text-muted mb-2">
                Explain your issue
              </label>
              <textarea
                id="complaint"
                rows={4}
                className="w-full bg-surface bg-opacity-50 border border-surface-border rounded-xl p-4 text-text placeholder-text-dim focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition duration-200 text-sm md:text-base leading-relaxed resize-none"
                placeholder="Apni complaint yahan likho... e.g. Hostel ke room 204 me fan kharab hai"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isProcessing || isApiLoading}
              />
            </div>

            {error && (
              <div className="text-sm font-semibold text-danger bg-danger/10 border border-danger/20 p-3 rounded-lg animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!inputText.trim() || isProcessing || isApiLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-primary hover:bg-primary-light text-white font-bold transition shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isApiLoading ? (
                <>Analyzing Complaint...</>
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
        <div className="bg-surface-card border border-surface-border rounded-[20px] p-6 shadow-xl">
          <h3 className="text-xs font-bold font-heading text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <MessageSquareCode className="w-4 h-4 text-primary-light" />
            Quick Demo Presets
          </h3>
          <div className="space-y-2.5">
            {SUGGESTIONS.map((text, idx) => (
              <button
                key={idx}
                onClick={() => autofill(text)}
                disabled={isProcessing || isApiLoading}
                className="w-full text-left p-3 rounded-xl bg-surface-hover/30 border border-surface-border/50 hover:border-primary/40 text-xs text-text-muted hover:text-text hover:bg-surface-hover transition duration-150 flex items-center justify-between group"
              >
                <span className="line-clamp-2 pr-2 leading-relaxed">{text}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-primary-light transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Row: Animated Steps & Results */}
      <div className="space-y-8 pb-16">
        <ProcessingSteps
          isProcessing={isProcessing}
          onComplete={handleAnimationComplete}
        />

        {result && (
          <div className="animate-fade-in-up">
            <ResultCard complaint={result} />
          </div>
        )}
      </div>
    </div>
  );
}
