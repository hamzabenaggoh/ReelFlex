# getTranscript.py
import sys
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter



# Get the video ID from the command line argument
video_id = sys.argv[1]

try:
    # Get the transcript for the video
    transcript = YouTubeTranscriptApi.get_transcript(video_id)

    formatter = TextFormatter()

    json_formatted = formatter.format_transcript(transcript)

    # Print the formatted transcript
    print(json_formatted)

except Exception as e:
    print(f"Error fetching transcript: {e}")
    sys.exit(1)
