import React, { useState, useEffect } from 'react';
import { parseCSV, calculateStatistics, generateHistogramData } from './utils/statistics';
import { AnalysisState } from './types';
import { FileUpload } from './components/FileUpload';
import { StatCard } from './components/StatCard';
import { HistogramChart } from './components/HistogramChart';
import { AiInsight } from './components/AiInsight';
import { Calculator, Sigma, Activity, BarChart3, RotateCcw } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AnalysisState>({
    data: [],
    bins: [],
    stats: null,
  });

  const handleDataLoaded = (rawData: number[], fileName?: string) => {
    // Process data immediately upon load
    const numbers = rawData.filter((n) => !isNaN(n)); // Extra safety
    if (numbers.length === 0) return;

    const stats = calculateStatistics(numbers);
    
    // Auto-calculate bin count based on Sturges' rule or fixed default
    const binCount = Math.min(20, Math.max(5, Math.ceil(Math.log2(numbers.length) + 1)));
    const bins = generateHistogramData(numbers, binCount);

    setState({
      data: numbers,
      bins,
      stats,
      fileName,
    });
  };

  const handleReset = () => {
      setState({ data: [], bins: [], stats: null });
  };

  const loadSampleData = () => {
      // Generate a normal distribution sample
      const sample = Array.from({length: 500}, () => {
          const u = 1 - Math.random(); 
          const v = Math.random();
          const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
          return 50 + z * 15; // Mean 50, StdDev 15
      });
      handleDataLoaded(sample, "Sample_Normal_Distribution.csv");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                StatVis AI
              </h1>
              <p className="text-slate-400 text-sm">Statistical Analysis & Visualization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             {state.stats && (
                 <button 
                    onClick={handleReset}
                    className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
                 >
                    <RotateCcw className="w-4 h-4" /> Reset
                 </button>
             )}
          </div>
        </header>

        {/* Main Content */}
        {!state.stats ? (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <section>
                <h2 className="text-xl font-semibold mb-4 text-white">Import Data</h2>
                <FileUpload onDataLoaded={handleDataLoaded} />
             </section>
             
             <div className="flex justify-center">
                 <button onClick={loadSampleData} className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4">
                     Or load sample data to test
                 </button>
             </div>
           </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            
            {/* File Info Badge */}
            <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/50 w-fit px-3 py-1 rounded-full border border-slate-700">
                <FileTextIcon className="w-3 h-3" />
                <span>Source: <span className="text-slate-200">{state.fileName || "Unknown"}</span></span>
                <span className="mx-1">•</span>
                <span>{state.data.length} records</span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Mean (Average)" 
                value={state.stats.mean.toFixed(2)} 
                icon={<Calculator className="w-6 h-6 text-blue-400" />}
                colorClass="text-blue-400 bg-blue-400/10"
              />
              <StatCard 
                title="Standard Deviation" 
                value={state.stats.stdDev.toFixed(2)} 
                icon={<Sigma className="w-6 h-6 text-emerald-400" />}
                colorClass="text-emerald-400 bg-emerald-400/10"
              />
               <StatCard 
                title="Min Value" 
                value={state.stats.min.toFixed(2)} 
                icon={<BarChart3 className="w-6 h-6 text-amber-400" />}
                colorClass="text-amber-400 bg-amber-400/10"
              />
               <StatCard 
                title="Max Value" 
                value={state.stats.max.toFixed(2)} 
                icon={<BarChart3 className="w-6 h-6 text-rose-400" />}
                colorClass="text-rose-400 bg-rose-400/10"
              />
            </div>

            {/* Charts & AI */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <HistogramChart data={state.bins} />
                </div>
                <div className="lg:col-span-1">
                    <AiInsight stats={state.stats} bins={state.bins} />
                </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

function FileTextIcon({ className }: { className?: string }) {
    return (
        <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" x2="8" y1="13" y2="13" />
            <line x1="16" x2="8" y1="17" y2="17" />
            <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
    )
}
