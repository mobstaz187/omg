import React, { useState, useEffect } from 'react';
import { getTwitterStats } from '../../../utils/twitter/api';
import { motion } from 'framer-motion';

interface Props {
  symbol: string;
}

export const TwitterMetricsPanel: React.FC<Props> = ({ symbol }) => {
  const [tweetCount, setTweetCount] = useState<number>(0);
  const [sentiment, setSentiment] = useState<'positive' | 'negative' | 'neutral'>('neutral');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    async function fetchTwitterData() {
      setIsLoading(true);
      setError(null);
      try {
        const stats = await getTwitterStats(symbol);
        setTweetCount(stats.tweetCount);
        setSentiment(stats.sentiment);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Failed to fetch Twitter metrics:', error);
        setError('Failed to fetch Twitter data');
      } finally {
        setIsLoading(false);
      }
    }

    if (symbol) {
      fetchTwitterData();
      // Update every 15 minutes to match Python script
      interval = setInterval(fetchTwitterData, 15 * 60 * 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [symbol]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-xl border border-border p-6"
    >
      <h3 className="text-xl font-semibold text-foreground mb-4">
        <div className="flex items-center gap-2">
          Twitter Metrics
          <span className="text-xs text-muted-foreground font-normal">
            15m Updates
          </span>
        </div>
      </h3>
      
      {isLoading ? (
        <div className="h-[140px] flex items-center justify-center">
          <div className="animate-pulse text-primary">Loading Twitter data...</div>
        </div>
      ) : error ? (
        <div className="h-[140px] flex items-center justify-center">
          <div className="text-red-400">{error}</div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">1h Tweet Count</div>
            <div className="text-2xl font-semibold text-foreground">
              {tweetCount.toLocaleString()}
            </div>
            <div className="mt-2 text-sm">
              <span className={`
                font-medium
                ${sentiment === 'positive' ? 'text-green-400' : 
                  sentiment === 'negative' ? 'text-red-400' : 
                  'text-blue-400'}
              `}>
                {sentiment === 'positive' ? '↗ Trending Up' :
                 sentiment === 'negative' ? '↘ Trending Down' :
                 '→ Stable'}
              </span>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="text-sm text-muted-foreground mb-1">Search Term</div>
            <div className="text-lg font-medium text-primary">
              ${symbol}
            </div>
            {lastUpdate && (
              <div className="mt-2 text-xs text-muted-foreground">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};