"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { checkFact } from "./services/geminiService"
import { MagnifyingGlassIcon, SparklesIcon, LinkIcon } from "./components/icons"
import type { FactCheckResult as FactCheckResultType } from "./types"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function App() {
  const [claim, setClaim] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<FactCheckResultType | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!claim.trim() || isLoading) return

      setIsLoading(true)
      setError(null)
      setResult(null)

      try {
        const apiResult = await checkFact(claim)
        setResult(apiResult)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError("An unexpected error occurred. Please try again.")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [claim, isLoading],
  )

  const getVerdictColor = (verdict: string): string => {
    const lowerVerdict = verdict.toLowerCase()
    if (lowerVerdict.includes("factual"))
      return "from-emerald-500/20 to-green-500/20 border-emerald-500/30 text-emerald-400"
    if (lowerVerdict.includes("false")) return "from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400"
    if (lowerVerdict.includes("misleading"))
      return "from-amber-500/20 to-yellow-500/20 border-amber-500/30 text-amber-400"
    if (lowerVerdict.includes("partially true"))
      return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    return "from-slate-500/20 to-gray-500/20 border-slate-500/30 text-slate-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/20 backdrop-blur-sm">
              <MagnifyingGlassIcon className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
              AI Detective
            </h1>
          </div>
          <p className="text-xl text-slate-400 font-light">Your AI-Powered Truth Seeker</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
        </header>

        {/* Main Input Card */}
        <Card className="mb-8 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl shadow-2xl">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="claim-input" className="text-sm font-medium text-slate-300">
                  Enter your claim to fact-check
                </label>
                <div className="relative">
                  <Textarea
                    id="claim-input"
                    value={claim}
                    onChange={(e) => setClaim(e.target.value)}
                    placeholder="Paste a claim, news article, or statement here..."
                    className="p-3 min-h-[120px] bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:ring-blue-500/20 resize-none text-base leading-relaxed"
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-500">{claim.length}/1000</div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !claim.trim()}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                    <span>Analyzing Truth...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <SparklesIcon className="w-5 h-5" />
                    <span>Verify Claim</span>
                  </div>
                )}
              </Button>
            </form>
          </div>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 bg-red-950/50 border-red-800/50 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300">
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <p className="text-red-300 font-medium">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="bg-slate-900/50 border-slate-700/50 backdrop-blur-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <div className="p-8">
              {/* Verdict Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-white">Verdict:</h2>
                <div
                  className={`px-6 py-3 rounded-2xl border bg-gradient-to-r backdrop-blur-sm ${getVerdictColor(result.verdict)}`}
                >
                  <span className="text-lg font-bold">{result.verdict}</span>
                </div>
              </div>

              {/* Reasoning Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                    Analysis
                  </h3>
                  <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                    <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-base">{result.reasoning}</p>
                  </div>
                </div>

                {/* Sources Section */}
                {result.sources && result.sources.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                      Sources ({result.sources.length})
                    </h3>
                    <div className="grid gap-3">
                      {result.sources.map((source, index) => (
                        <a
                          key={index}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-start gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all duration-300 hover:scale-[1.01] max-w-2xl"
                        >
                          <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                            <LinkIcon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-slate-200 group-hover:text-white font-medium transition-colors">
                              {source.title || "Source"}
                            </p>
                            <p className="text-slate-500 text-sm truncate mt-1">{source.uri}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 py-8">
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <SparklesIcon className="w-4 h-4" />
            <span className="text-sm">Powered by Google Gemini AI</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
