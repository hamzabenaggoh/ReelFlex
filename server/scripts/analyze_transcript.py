import os
import sys
import json
from dotenv import load_dotenv
from openai import OpenAI
import requests

# Load environment variables
load_dotenv()

# Set up OpenAI API key
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def get_transcript(video_id):
    """Fetch transcript from your REST API."""
    try:
        # Use the new endpoint to get the transcript
        response = requests.get(f'http://localhost:5045/api/videos/{video_id}/transcript')
        response.raise_for_status()
        return response.json()['transcript']
    except requests.exceptions.RequestException as e:
        print(f"Error fetching transcript: {e}", file=sys.stderr)
        return None

def analyze_transcript(transcript, analysis_type="summary"):
    """
    Analyze the transcript using OpenAI's API.
    
    analysis_type options:
    - "summary": Generate a concise summary
    - "key_points": Extract key points
    - "workout_details": Extract workout-related information
    - "custom": Custom analysis based on prompt
    """
    
    prompts = {
        "summary": "Please provide a concise summary of this video transcript:",
        "key_points": "Extract the main key points from this transcript:",
        "workout_details": "Extract workout-related information from this transcript, including exercises, sets, reps, and any tips mentioned:",
        "custom": "Analyze this transcript and provide insights:"
    }
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant that analyzes YouTube video transcripts, particularly focusing on fitness and workout-related content."},
                {"role": "user", "content": f"{prompts[analysis_type]}\n\nTranscript:\n{transcript}"}
            ],
            max_tokens=500,
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error analyzing transcript: {e}", file=sys.stderr)
        return None

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 analyze_transcript.py <video_id> [analysis_type]", file=sys.stderr)
        print("Analysis types: summary, key_points, workout_details, custom", file=sys.stderr)
        sys.exit(1)

    video_id = sys.argv[1]
    analysis_type = sys.argv[2] if len(sys.argv) > 2 else "summary"

    # Get transcript
    transcript = get_transcript(video_id)
    if not transcript:
        print("Could not fetch transcript", file=sys.stderr)
        sys.exit(1)

    # Analyze transcript
    analysis = analyze_transcript(transcript, analysis_type)
    if not analysis:
        print("Could not analyze transcript", file=sys.stderr)
        sys.exit(1)

    # Output results as JSON
    result = {
        "video_id": video_id,
        "analysis_type": analysis_type,
        "analysis": analysis
    }
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main() 