import tweepy
import time
import json
from datetime import datetime, timedelta
from pathlib import Path

# Twitter API credentials
API_KEY = "8NXMn63pCQyegD2O21OC9k0Em"
API_KEY_SECRET = "lU6QGmx66sQND97kCrHeSbwst1TORYp8Deyo9dUh11UqplQowV"
BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAD8RyQEAAAAAyM1iLDu5Z3P41x6zLYeXCF%2F4Voo%3DXLKZfnjc1PGCCOn54amiwLDBGrurpzZ56DOHOWKHIFFYXlUAFn"
ACCESS_TOKEN = "1862202880452960256-udLdqOarv3MeXjMKb7qSZReqCzdB9I"
ACCESS_TOKEN_SECRET = "Pz89DpHTD9CnFGTbo6NSCRyNnHGSLGA18qEI5Ej0WkJdo"

# Initialize Tweepy client
client = tweepy.Client(
    bearer_token=BEARER_TOKEN,
    consumer_key=API_KEY,
    consumer_secret=API_KEY_SECRET,
    access_token=ACCESS_TOKEN,
    access_token_secret=ACCESS_TOKEN_SECRET
)

def count_tweets(symbol: str) -> dict:
    """
    Count tweets for a given symbol from the last hour and return metrics
    """
    query = f"${symbol} -is:retweet"  # Exclude retweets
    
    try:
        # Search tweets from the last hour
        start_time = datetime.utcnow() - timedelta(hours=1)
        
        tweets = client.search_recent_tweets(
            query=query,
            max_results=100,  # Maximum allowed per request
            tweet_fields=['created_at', 'public_metrics'],
            start_time=start_time
        )
        
        # Count total tweets
        tweet_count = 0
        if tweets.data:
            tweet_count = len(tweets.data)
        
        # Create metrics
        metrics = {
            'symbol': symbol,
            'count': tweet_count,
            'timestamp': datetime.now().isoformat(),
            'query': query,
            'window': '1h'
        }
        
        return metrics
        
    except Exception as e:
        print(f"Error counting tweets: {e}")
        return {
            'symbol': symbol,
            'count': 0,
            'timestamp': datetime.now().isoformat(),
            'error': str(e),
            'window': '1h'
        }

def save_metrics(metrics: dict):
    """
    Save metrics to a JSON file in the public directory
    """
    # Save to both public/ and dist/ to ensure it works in both dev and prod
    directories = [
        Path('public/data'),
        Path('dist/data')
    ]
    
    for output_dir in directories:
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / 'twitter_metrics.json'
        
        try:
            # Load existing data
            if output_file.exists():
                with open(output_file, 'r') as f:
                    data = json.load(f)
            else:
                data = []
                
            # Add new metrics
            data.append(metrics)
            
            # Keep only last 4 hours of data (16 entries at 15-minute intervals)
            cutoff = len(data) - 16
            if cutoff > 0:
                data = data[cutoff:]
                
            # Save updated data
            with open(output_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            print(f"Error saving metrics to {output_dir}: {e}")

def main():
    symbols = ['PELIOS']  # Add more symbols as needed
    
    print("Starting Twitter counter...")
    print(f"Tracking symbols: {', '.join(symbols)}")
    
    while True:
        try:
            for symbol in symbols:
                print(f"\nCounting tweets for ${symbol}...")
                metrics = count_tweets(symbol)
                print(f"Found {metrics['count']} tweets in the last hour")
                save_metrics(metrics)
            
            # Wait 15 minutes
            print("\nWaiting 15 minutes until next count...")
            time.sleep(900)  # 900 seconds = 15 minutes
            
        except KeyboardInterrupt:
            print("\nStopping Twitter counter...")
            break
        except Exception as e:
            print(f"\nError in main loop: {e}")
            time.sleep(60)  # Wait 1 minute before retrying

if __name__ == "__main__":
    main()