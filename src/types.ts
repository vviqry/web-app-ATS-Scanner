/**
 * Types for Pemindai ATS Pintar components and system communication
 */

export interface RevisionSuggestion {
  category: string;
  originalPhrase: string;
  suggestedPhrase: string;
  explanation: string;
}

export interface ScanResult {
  score: number;
  summaryText: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  revisionSuggestions: RevisionSuggestion[];
}

export interface HistoricalScan {
  id: string;
  timestamp: string;
  score: number;
  jobRole: string;
  jobDescription: string;
  cvFilename: string;
  cvText: string;
  result: ScanResult;
}
