export interface HistogramBin {
  range: string;
  count: number;
  x0: number;
  x1: number;
}

export interface Statistics {
  mean: number;
  stdDev: number;
  min: number;
  max: number;
  count: number;
  median: number;
}

export interface AnalysisState {
  data: number[];
  bins: HistogramBin[];
  stats: Statistics | null;
  fileName?: string;
}
