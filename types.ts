
export interface GroundingSource {
  title: string;
  uri: string;
}

export enum DetectionStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  REAL = 'REAL',
  FAKE = 'FAKE',
  MISLEADING = 'MISLEADING',
  ERROR = 'ERROR'
}

export interface AnalysisResult {
  status: DetectionStatus;
  explanation: string;
  confidence: number;
  semanticScore: number; // 0-100 (BERT-style linguistic check)
  factualScore: number;  // 0-100 (Search-style fact check)
  linguisticMarkers: string[];
  sources: GroundingSource[];
}
