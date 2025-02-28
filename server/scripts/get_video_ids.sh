#!/bin/bash

# Source conda
source ~/miniconda3/bin/activate 

# YouTube channel URL of the influencer
CHANNEL_URL="https://www.youtube.com/@NoelDeyzel/"

# Output file to store the video IDs
OUTPUT_FILE="video_ids.txt"

# Fetch video IDs of YouTube Shorts (videos < 60 seconds)
# yt-dlp --get-id --match-filters "duration<60" "$CHANNEL_URL" > "$OUTPUT_FILE"
yt-dlp --get-id --match-filters "duration<60" --no-post-overwrites "$CHANNEL_URL" > "$OUTPUT_FILE"


# Optionally, add a timestamp to the file name to track multiple runs
mv "$OUTPUT_FILE" "video_ids_$(date +'%Y%m%d_%H%M').txt"

