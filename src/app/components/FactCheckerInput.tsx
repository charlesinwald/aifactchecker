
import React from 'react';
import { SparklesIcon } from './icons';

interface FactCheckerInputProps {
  claim: string;
  setClaim: (claim: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const FactCheckerInput: React.FC<FactCheckerInputProps> = ({ claim, setClaim, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="relative">
        <textarea
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="Paste a claim, news article, or tweet here..."
          className="w-full h-40 p-4 pr-12 text-brand-text bg-brand-secondary border-2 border-brand-accent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none placeholder-gray-400"
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !claim.trim()}
        className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-brand-accent disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <SparklesIcon className="w-5 h-5" />
            <span>Check Fact</span>
          </>
        )}
      </button>
    </form>
  );
};

export default FactCheckerInput;
