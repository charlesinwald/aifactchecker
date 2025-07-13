
import { FactCheckResult } from "../types";

export const checkFact = async (claim: string): Promise<FactCheckResult> => {
  if (!claim.trim()) {
    throw new Error("Claim cannot be empty.");
  }

  try {
    const response = await fetch('/api/fact-check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ claim }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result: FactCheckResult = await response.json();
    return result;
  } catch (error) {
    console.error("Error calling fact-check API:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to check fact: ${error.message}`);
    }
    throw new Error("An unknown error occurred during fact checking.");
  }
};
