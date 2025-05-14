import { TWITTER_CONFIG } from './config';

interface TwitterMetrics {
  symbol: string;
  count: number;
  timestamp: string;
  window: string;
}

interface TwitterStats {
  tweetCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  recentTweets: string[];
}

export async function getTwitterStats(symbol: string): Promise<TwitterStats> {
  try {
    // Create metrics file if it doesn't exist
    let metrics: TwitterMetrics[] = [];
    
    try {
      const response = await fetch('/data/twitter_metrics.json');
      if (response.ok) {
        metrics = await response.json();
      }
    } catch (error) {
      console.warn('Could not load Twitter metrics, using empty data');
    }
    
    // Get the latest metrics for the symbol
    const latestMetrics = metrics
      .filter(m => m.symbol.toLowerCase() === symbol.toLowerCase())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (!latestMetrics.length) {
      return {
        tweetCount: 0,
        sentiment: 'neutral',
        recentTweets: []
      };
    }

    // Get current and previous counts to determine trend
    const currentCount = latestMetrics[0].count;
    const previousCount = latestMetrics[1]?.count ?? currentCount;

    // Calculate sentiment based on trend
    const sentiment: 'positive' | 'negative' | 'neutral' = 
      currentCount > previousCount ? 'positive' :
      currentCount < previousCount ? 'negative' :
      'neutral';

    return {
      tweetCount: currentCount,
      sentiment,
      recentTweets: []
    };
  } catch (error) {
    console.error('Twitter metrics error:', error);
    return {
      tweetCount: 0,
      sentiment: 'neutral',
      recentTweets: []
    };
  }
}