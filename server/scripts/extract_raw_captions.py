import sys
import os
import cv2
import yt_dlp as ytdlp
import easyocr

# Suppress stdout
class SuppressStdout:
    def __enter__(self):
        self._original_stdout = sys.stdout
        sys.stdout = open(os.devnull, 'w')

    def __exit__(self, exc_type, exc_val, exc_tb):
        sys.stdout.close()
        sys.stdout = self._original_stdout

# Function to download YouTube video using yt-dlp

def download_video(video_id, output_path):
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {
        'format': 'mp4',
        'outtmpl': os.path.join(output_path, '%(id)s.%(ext)s'),
        'quiet': True,  # Suppress download logs
        'no_warnings': True,  # Suppress warnings
    }
    with ytdlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([video_url])
    return os.path.join(output_path, f"{video_id}.mp4")

# Function to extract frames from video at a specified time interval

def extract_frames(video_path, interval_seconds=2):
    cap = cv2.VideoCapture(video_path)
    frames = []
    fps = cap.get(cv2.CAP_PROP_FPS)  # Get frames per second
    interval_frames = int(fps * interval_seconds)  # Calculate the number of frames to skip
    count = 0
    success, image = cap.read()
    while success:
        if count % interval_frames == 0:
            frames.append(image)
        success, image = cap.read()
        count += 1
    cap.release()
    return frames

# Function to perform OCR on frames and filter out duplicate captions

def extract_text_from_frames(frames):
    reader = easyocr.Reader(['en'])
    text_data = []
    seen_captions = set()
    for frame in frames:
        result = reader.readtext(frame)
        for _, text, _ in result:
            if text not in seen_captions:
                text_data.append(text)
                seen_captions.add(text)
    return text_data

# Main function

def main(video_id):
    output_path = './videos'
    os.makedirs(output_path, exist_ok=True)

    # Suppress stdout during processing
    with SuppressStdout():
        # Download video
        video_path = download_video(video_id, output_path)

        # Extract frames at a 2-second interval
        frames = extract_frames(video_path, interval_seconds=2)

        # Extract text
        text_data = extract_text_from_frames(frames)

    # Enable stdout and return the extracted captions
    return "\n".join(text_data)

if __name__ == "__main__":
    import sys
    video_id = sys.argv[1]
    captions = main(video_id)
    print(captions) 