
import React, { useState, useCallback } from 'react';
import { analyzeNews } from './services/geminiService';
import { AnalysisResult, DetectionStatus } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = useCallback(async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeNews(inputText);
      setResult(analysis);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  return (
    <div className="min-h-screen bg-[#0e1117] text-white flex flex-col items-center pt-20 px-4">
      <div className="w-full max-w-[700px]">
        {/* Logo and Title */}
        <div className="flex items-center gap-4 mb-8">
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            className="text-gray-400"
            stroke="currentColor" 
            strokeWidth="1.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
          </svg>
          <h1 className="text-5xl font-bold tracking-tight">TruthScan</h1>
        </div>

        <div className="space-y-6">
          <h2 className="text-3xl font-bold">AI Fake News Detection System</h2>
          
          <p className="text-[#fafafa] opacity-90 text-base leading-relaxed">
            Enter a news headline or article to check whether it is <span className="font-bold">Fake</span> or <span className="font-bold">Real</span> using an AI-based text classification model.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <span>📝</span>
              <span>Enter News Text</span>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., narendra modi is the prime minister of india"
              className="w-full h-52 bg-[#262730] border border-[#4b4d5a] rounded-md p-4 text-white focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all resize-none"
            />
          </div>

          <button
            onClick={handleCheck}
            disabled={loading || !inputText.trim()}
            className={`flex items-center gap-2 px-5 py-2 rounded-md border border-[#4b4d5a] transition-all ${
              loading || !inputText.trim() 
                ? 'bg-[#262730] text-gray-500 cursor-not-allowed' 
                : 'bg-[#262730] hover:bg-[#31333f] active:scale-[0.98]'
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span className="text-lg">🔍</span>
            )}
            <span className="font-medium">Check Authenticity</span>
          </button>

          {/* Result Banner */}
          {result && (
            <div className={`mt-6 p-4 rounded-md flex items-center gap-3 animate-in fade-in duration-300 ${
              result.status === DetectionStatus.REAL 
                ? 'bg-[#1d3d2a] text-[#7dfa93]' 
                : result.status === DetectionStatus.FAKE 
                ? 'bg-[#4a1d1d] text-[#ff8a8a]'
                : 'bg-[#4a3a1d] text-[#ffed8a]'
            }`}>
              <span className="text-lg">
                {result.status === DetectionStatus.REAL ? '✅' : result.status === DetectionStatus.FAKE ? '🚫' : '⚠️'}
              </span>
              <span className="font-normal text-lg">
                {result.status === DetectionStatus.REAL ? 'Real News' : result.status === DetectionStatus.FAKE ? 'Fake News' : 'Misleading News'}
              </span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-900/40 rounded-md text-red-200 text-sm">
              System Error: {error}
            </div>
          )}

          {/* Optional: Details section (Hidden by default to keep "Exact" look, but useful) */}
          {result && (
            <div className="mt-12 pt-8 border-t border-[#262730] opacity-40 hover:opacity-100 transition-opacity">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4">Ensemble Analysis Details</h4>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>Semantic (BERT) Score: {result.semanticScore}%</div>
                <div>Factual Grounding: {result.factualScore}%</div>
              </div>
              <p className="mt-4 text-sm italic">{result.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
