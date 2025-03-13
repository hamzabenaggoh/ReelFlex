import time
import datetime
from googleapiclient.discovery import build
import os
from dotenv import load_dotenv
import isodate
import sys
import json

# Load environment variables from .env file
load_dotenv()

# YouTube API Key (retrieved from environment variable)
API_KEY = os.getenv('YOUTUBE_API_KEY')

if not API_KEY:
    raise ValueError("YouTube API key not found in environment variables")

# Initialize YouTube API with API key only
youtube = build("youtube", "v3", developerKey=API_KEY, static_discovery=False)

def get_channel_id(channel_identifier):
    """Get channel ID from username, handle, or channel ID."""
    try:
        # First try as a channel ID
        request = youtube.channels().list(
            part="id",
            id=channel_identifier
        )
        response = request.execute()
        
        if response.get('items'):
            return response['items'][0]['id']

        # Then try as a username
        request = youtube.channels().list(
            part="id",
            forUsername=channel_identifier.replace('@', '')  # Remove @ if present
        )
        response = request.execute()
        
        if response.get('items'):
            return response['items'][0]['id']

        # Finally try searching for the channel
        request = youtube.search().list(
            part="id",
            q=channel_identifier,
            type="channel",
            maxResults=1
        )
        response = request.execute()
        
        if response.get('items'):
            return response['items'][0]['id']['channelId']
            
        return None
    except Exception as e:
        print(f"Error getting channel ID: {e}", file=sys.stderr)
        return None

def get_new_shorts(channel_id):
    """Fetch new short-form videos (under 60s) from a YouTube channel from the last 24 hours."""
    # Get current time minus 24 hours
    one_day_ago = (datetime.datetime.utcnow() - datetime.timedelta(days=1)).isoformat() + "Z"
    
    try:
        request = youtube.search().list(
            part="id,snippet",
            channelId=channel_id,
            maxResults=3,  # Fetch up to 3 recent videos
            order="date",  # Get latest videos first
            type="video",
            publishedAfter=one_day_ago
        )
        response = request.execute()

        shorts = []
        print(f"\nFound {len(response.get('items', []))} total videos", file=sys.stderr)
        
        for item in response.get("items", []):
            video_id = item["id"]["videoId"]
            title = item["snippet"]["title"]
            published_at = item["snippet"]["publishedAt"]
            
            # Validate the published date
            try:
                published_date = datetime.datetime.strptime(published_at, "%Y-%m-%dT%H:%M:%SZ")
                if published_date > datetime.datetime.utcnow():
                    print(f"Warning: Video has future publish date, skipping: {title}", file=sys.stderr)
                    continue
            except ValueError as e:
                print(f"Warning: Invalid date format for video {title}: {e}", file=sys.stderr)
                continue

            # Get video details (duration)
            video_details = youtube.videos().list(
                part="contentDetails,snippet",  # Also get snippet for actual upload date
                id=video_id
            ).execute()

            if not video_details.get("items"):
                print(f"Warning: Could not get details for video {title}", file=sys.stderr)
                continue

            duration = video_details["items"][0]["contentDetails"]["duration"]
            duration_seconds = isodate.parse_duration(duration).total_seconds()
            
            # Use actual upload date from video details
            actual_upload_date = video_details["items"][0]["snippet"]["publishedAt"]
            
            print(f"Video: {title} (Duration: {duration_seconds}s, Published: {actual_upload_date})", file=sys.stderr)

            if duration_seconds <= 60:
                shorts.append({
                    'id': video_id,
                    'title': title,
                    'published_at': actual_upload_date,
                    'duration': duration_seconds,
                    'url': f"https://www.youtube.com/watch?v={video_id}",
                    'shorts_url': f"https://www.youtube.com/shorts/{video_id}"
                })

        print(f"Found {len(shorts)} valid shorts", file=sys.stderr)
        return shorts

    except Exception as e:
        print(f"Error fetching shorts: {e}", file=sys.stderr)
        return []

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 monitor_influencer.py <channel_identifier>", file=sys.stderr)
        print("Example: python3 monitor_influencer.py @NoelDeyzel", file=sys.stderr)
        sys.exit(1)

    channel_identifier = sys.argv[1]
    channel_id = get_channel_id(channel_identifier)
    
    if not channel_id:
        print(f"Error: Could not find channel ID for: {channel_identifier}", file=sys.stderr)
        sys.exit(1)

    shorts = get_new_shorts(channel_id)
    # Print the results as JSON to stdout
    print(json.dumps(shorts, indent=2))

if __name__ == "__main__":
    main()
