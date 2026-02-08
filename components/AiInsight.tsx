import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Statistics, HistogramBin } from '../types';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';

interface AiInsightProps {
  stats: Statistics;
  bins: HistogramBin[];
}

export const AiInsight: React.FC<AiInsightProps> = ({ stats, bins }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async () => {
    if (!process.env.API_KEY) {
      setError("API Key is missing. Please set process.env.API_KEY.");
      return;
    }

    setLoading(true);
    setError(null);
    setInsight('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct a prompt summarizing the data
      const prompt = `
        You are a senior data scientist. Analyze the following dataset summary and histogram data.
        
        Statistics:
        - Mean: ${stats.mean.toFixed(2)}
        - Standard Deviation: ${stats.stdDev.toFixed(2)}
        - Median: ${stats.median.toFixed(2)}
        - Min: ${stats.min}
        - Max: ${stats.max}
        - Count: ${stats.count}
        
        Histogram Distribution (Bin Range -> Count):
        ${bins.map(b => `${b.range} -> ${b.count}`).join('\n')}
        
        Provide a concise but insightful analysis of this distribution. 
        1. Describe the shape (Normal, Skewed, Bimodal, etc.).
        2. Identify any potential outliers.
        3. Interpret what the Standard Deviation implies about the spread relative to the Mean.
        4. Keep it under 150 words. Format with Markdown.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        setInsight(text);
      } else {
        setError("Received empty response from AI.");
      }
    } catch (err: any) {
      console.error("AI Error:", err);
      setError("Failed to generate insight. " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-900 rounded-xl p-1 border border-slate-700 shadow-lg mt-8 relative overflow-hidden group">
      {/* Fancy gradient border effect */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"></div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold text-white">AI Data Scientist</h3>
          </div>
          {!insight && !loading && (
             <button 
                onClick={generateInsight}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2 shadow-lg hover:shadow-purple-500/25"
             >
               <Sparkles className="w-4 h-4" />
               Analyze Distribution
             </button>
          )}
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-purple-500" />
            <p className="text-sm animate-pulse">Consulting the oracle...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3 text-red-200 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Analysis Failed</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {insight && (
          <div className="bg-slate-800/50 rounded-lg p-5 border border-slate-700/50">
            <div className="prose prose-invert prose-sm max-w-none">
                {/* Minimal markdown rendering */}
                {insight.split('\n').map((line, i) => (
                    <p key={i} className={`mb-2 ${line.startsWith('#') ? 'font-bold text-white text-base' : 'text-slate-300'}`}>
                        {line.replace(/^#+\s/, '')}
                    </p>
                ))}
            </div>
            <div className="mt-4 flex justify-end">
                 <button 
                    onClick={generateInsight}
                    className="text-xs text-slate-500 hover:text-purple-400 transition-colors flex items-center gap-1"
                 >
                   <Sparkles className="w-3 h-3" /> Regenerate
                 </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
