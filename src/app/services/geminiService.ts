
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FactCheckResult, Source } from "../types";
import 'dotenv/config';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are an expert AI Fact Checker. Your primary goal is to analyze the user's claim for factual accuracy using the provided Google Search results.

Follow these instructions precisely:
1.  Start your entire response with a single-word verdict from this exact list: Factual, False, Misleading, Partially True, Unverifiable.
2.  After the verdict, you MUST use '||' as a separator.
3.  After the separator, provide a concise, neutral, and thorough explanation for your verdict based on the information from the search results.
4.  Do NOT mention the sources in your reasoning; they will be displayed separately. Do NOT add any pleasantries or conversational filler.

Example Response Format:
Misleading||The claim cherry-picks data from a broader report. While the numbers are technically correct for the specified period, they omit the larger context that shows an opposite trend over a longer timeframe.`;

export const checkFact = async (claim: string): Promise<FactCheckResult> => {
  if (!claim.trim()) {
    throw new Error("Claim cannot be empty.");
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: claim,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text;
    const parts = rawText.split('||');
    
    if (parts.length < 2) {
      // Fallback if the model doesn't follow the format
      console.warn("Model response did not contain '||' separator. Treating entire text as reasoning.");
      return {
        verdict: 'Uncertain',
        reasoning: rawText || "The model provided a response, but it was not in the expected format.",
        sources: [],
      };
    }

    const [verdict, ...reasoningParts] = parts;
    const reasoning = reasoningParts.join('||').trim();

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = groundingChunks
      .map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title,
      }))
      .filter((source: Source) => source.uri && source.title);

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
      
    return {
      verdict: verdict.trim(),
      reasoning,
      sources: uniqueSources,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to check fact: ${error.message}`);
    }
    throw new Error("An unknown error occurred during fact checking.");
  }
};
