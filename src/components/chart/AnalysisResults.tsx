import React from 'react';
import { Level } from '../../types/chart';
import type { Scenario } from './ScenarioSelector';

interface Props {
  levels: Level[];
  scenario: Scenario;
}

export const AnalysisResults: React.FC<Props> = ({ levels, scenario }) => {
  const scenarioDescription = {
    bullish: `Price likely to break above ${levels.filter(l => l.type === 'resistance').length} resistance levels`,
    bearish: `Price likely to break below ${levels.filter(l => l.type === 'support').length} support levels`,
    neutral: 'Price likely to stay within the range'
  }[scenario];

  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h3 className={`text-lg font-semibold mb-2 ${
        scenario === 'bullish' ? 'text-green-400' :
        scenario === 'bearish' ? 'text-red-400' :
        'text-blue-400'
      }`}>
        {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Scenario
      </h3>
      <p className="text-gray-400">{scenarioDescription}</p>
    </div>
  );
};