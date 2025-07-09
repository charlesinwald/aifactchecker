
import React from 'react';
import { FactCheckResult as FactCheckResultType } from '../types';
import { LinkIcon } from './icons';

interface FactCheckResultProps {
  result: FactCheckResultType;
}

const getVerdictColor = (verdict: string): string => {
  const lowerVerdict = verdict.toLowerCase();
  if (lowerVerdict.includes('factual')) return 'bg-green-600/80 border-green-400';
  if (lowerVerdict.includes('false')) return 'bg-red-600/80 border-red-400';
  if (lowerVerdict.includes('misleading')) return 'bg-yellow-600/80 border-yellow-400';
  if (lowerVerdict.includes('partially true')) return 'bg-blue-600/80 border-blue-400';
  return 'bg-gray-600/80 border-gray-400';
};

const FactCheckResult: React.FC<FactCheckResultProps> = ({ result }) => {
  return (
    <div className="w-full mt-8 p-6 bg-brand-secondary/70 border border-brand-accent rounded-lg backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold text-brand-light">Verdict:</h2>
        <span
          className={`px-4 py-1.5 text-lg font-bold text-white rounded-full border ${getVerdictColor(result.verdict)}`}
        >
          {result.verdict}
        </span>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-brand-light mb-2">Reasoning</h3>
          <p className="text-brand-text leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
        </div>

        {result.sources && result.sources.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-brand-light mb-2">Sources</h3>
            <ul className="space-y-2">
              {result.sources.map((source, index) => (
                <li key={index}>
                  <a
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2 text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 group"
                  >
                    <LinkIcon className="w-5 h-5 mt-1 flex-shrink-0 text-brand-light group-hover:text-blue-300" />
                    <span className="break-all">{source.title || source.uri}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FactCheckResult;
