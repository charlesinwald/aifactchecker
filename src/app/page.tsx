'use client';

import { useState, useCallback } from 'react';
import { checkFact } from './services/geminiService';
import { MagnifyingGlassIcon } from './components/icons';
import FactCheckerInput from './components/FactCheckerInput';
import ErrorMessage from './components/ErrorMessage';
import { FactCheckResult as FactCheckResultType } from './types';
import FactCheckResult from './components/FactCheckResult';


const App: React.FC = () => {
  const [claim, setClaim] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FactCheckResultType | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claim.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiResult = await checkFact(claim);
      setResult(apiResult);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [claim, isLoading]);

  return (
    <div className="min-h-screen w-full text-brand-text flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3">
            <MagnifyingGlassIcon className="w-10 h-10 text-brand-light" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-brand-text">
              AI Detective
            </h1>
          </div>
          <p className="mt-2 text-lg text-brand-light">Your AI-Powered Fact Checker</p>
        </header>
        
        <div className="w-full p-6 bg-brand-secondary/50 border border-brand-accent rounded-xl shadow-2xl backdrop-blur-md">
            <FactCheckerInput 
                claim={claim}
                setClaim={setClaim}
                onSubmit={handleSubmit}
                isLoading={isLoading}
            />
        </div>
        
        <div className="w-full">
            {error && <ErrorMessage message={error} />}
            {result && <FactCheckResult result={result} />}
        </div>
      </main>
      <footer className="text-center py-4 mt-auto">
          <p className="text-sm text-brand-accent">Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
