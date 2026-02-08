import * as d3 from 'd3';
import { HistogramBin, Statistics } from '../types';

export const parseCSV = (csvText: string): number[] => {
  // Split by newlines or commas, filter out non-numeric values
  const rawValues = csvText.split(/[\s,]+/);
  const numbers: number[] = [];

  for (const val of rawValues) {
    const trimmed = val.trim();
    if (trimmed === '') continue;
    const num = Number(trimmed);
    if (!isNaN(num)) {
      numbers.push(num);
    }
  }
  return numbers;
};

export const calculateStatistics = (data: number[]): Statistics => {
  if (data.length === 0) {
    return { mean: 0, stdDev: 0, min: 0, max: 0, count: 0, median: 0 };
  }

  const mean = d3.mean(data) || 0;
  const stdDev = d3.deviation(data) || 0;
  const min = d3.min(data) || 0;
  const max = d3.max(data) || 0;
  const median = d3.median(data) || 0;

  return {
    mean,
    stdDev,
    min,
    max,
    count: data.length,
    median,
  };
};

export const generateHistogramData = (data: number[], numBins = 10): HistogramBin[] => {
  if (data.length === 0) return [];

  const min = d3.min(data) || 0;
  const max = d3.max(data) || 0;

  // Create a linear scale to determine the domain
  const x = d3.scaleLinear().domain([min, max]);

  // Generate bins using d3.bin
  const binGenerator = d3.bin().domain(x.domain() as [number, number]).thresholds(x.ticks(numBins));
  const bins = binGenerator(data);

  return bins.map((bin) => ({
    range: `${formatNumber(bin.x0 || 0)} - ${formatNumber(bin.x1 || 0)}`,
    x0: bin.x0 || 0,
    x1: bin.x1 || 0,
    count: bin.length,
  }));
};

const formatNumber = (num: number): string => {
  return Math.abs(num) < 1 && num !== 0 ? num.toFixed(3) : parseFloat(num.toFixed(2)).toString();
};
