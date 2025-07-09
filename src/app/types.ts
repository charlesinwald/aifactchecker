
export interface Source {
    uri: string;
    title: string;
  }
  
  export interface FactCheckResult {
    verdict: string;
    reasoning: string;
    sources: Source[];
  }
  