import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { FactCheckResult, Source } from "../../types";

const API_KEY = process.env.GEMINI_API_KEY; // Remove NEXT_PUBLIC_ prefix for server-only access

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
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

export async function POST(request: NextRequest) {
  try {
    const { claim } = await request.json();

    if (!claim || !claim.trim()) {
      return NextResponse.json(
        { error: "Claim cannot be empty." },
        { status: 400 }
      );
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: claim,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text;
    if (!rawText) {
      return NextResponse.json(
        { error: "Model response was empty." },
        { status: 500 }
      );
    }

    const parts = rawText.split("||");

    if (parts.length < 2) {
      // Fallback if the model doesn't follow the format
      console.warn(
        "Model response did not contain '||' separator. Treating entire text as reasoning."
      );
      return NextResponse.json({
        verdict: "Uncertain",
        reasoning:
          rawText ||
          "The model provided a response, but it was not in the expected format.",
        sources: [],
      });
    }

    const [verdict, ...reasoningParts] = parts;
    const reasoning = reasoningParts.join("||").trim();

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources: Source[] = groundingChunks
      .map((chunk: any) => ({
        uri: chunk.web?.uri,
        title: chunk.web?.title,
      }))
      .filter((source: Source) => source.uri && source.title);

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(
      new Map(sources.map((s) => [s.uri, s])).values()
    );

    const result: FactCheckResult = {
      verdict: verdict.trim(),
      reasoning,
      sources: uniqueSources,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Failed to check fact: ${error.message}`
            : "An unknown error occurred during fact checking.",
      },
      { status: 500 }
    );
  }
}
