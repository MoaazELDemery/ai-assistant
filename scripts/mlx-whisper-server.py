#!/usr/bin/env python3
"""
MLX-Whisper Server - OpenAI-compatible STT API for Apple Silicon
Optimized for M4 Ultra
"""

import tempfile
import os
import shutil
import sys

# Ensure Homebrew paths are in PATH for ffmpeg (required by mlx_whisper)
HOMEBREW_PATHS = ["/opt/homebrew/bin", "/usr/local/bin"]
for path in HOMEBREW_PATHS:
    if path not in os.environ.get("PATH", ""):
        os.environ["PATH"] = f"{path}:{os.environ.get('PATH', '')}"

# Verify ffmpeg is available
if not shutil.which("ffmpeg"):
    print("ERROR: ffmpeg not found. Please install it with: brew install ffmpeg")
    sys.exit(1)

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
import uvicorn

# Import mlx_whisper
import mlx_whisper

app = FastAPI(title="MLX-Whisper Server")

# Model will be downloaded on first use
MODEL = "mlx-community/whisper-large-v3-turbo"

@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL}

@app.post("/v1/audio/transcriptions")
async def transcribe(
    file: UploadFile = File(...),
    model: str = Form(default=MODEL),
    language: str = Form(default=None),
    response_format: str = Form(default="json"),
):
    """OpenAI-compatible transcription endpoint"""

    # Get file extension, default to .webm if not present
    original_ext = os.path.splitext(file.filename or "audio.webm")[1]
    if not original_ext:
        original_ext = ".webm"
    
    # Read the uploaded content
    content = await file.read()
    
    # Validate content
    if not content or len(content) == 0:
        return JSONResponse(
            {"error": "Empty audio file received"},
            status_code=400
        )
    
    # Minimum 1KB to ensure we have actual audio data, not just headers
    MIN_AUDIO_SIZE = 1000
    if len(content) < MIN_AUDIO_SIZE:
        print(f"Audio file too small: {len(content)} bytes (minimum: {MIN_AUDIO_SIZE})")
        return JSONResponse(
            {"error": f"Audio file too small ({len(content)} bytes). Please record for at least 1 second."},
            status_code=400
        )
    
    print(f"Received audio file: {file.filename}, size: {len(content)} bytes, content_type: {file.content_type}")
    
    # Save original file
    with tempfile.NamedTemporaryFile(delete=False, suffix=original_ext) as tmp:
        tmp.write(content)
        original_path = tmp.name
    
    # Convert to WAV using ffmpeg for better compatibility
    wav_path = original_path.replace(original_ext, ".wav")
    
    try:
        # Convert to WAV format that mlx_whisper can reliably process
        import subprocess
        convert_cmd = [
            "ffmpeg", "-y", "-nostdin",
            "-i", original_path,
            "-ar", "16000",  # 16kHz sample rate
            "-ac", "1",       # Mono
            "-c:a", "pcm_s16le",  # 16-bit PCM
            wav_path
        ]
        
        result = subprocess.run(convert_cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            print(f"FFmpeg conversion failed: {result.stderr}")
            # Fall back to original file
            transcribe_path = original_path
        else:
            transcribe_path = wav_path
            print(f"Converted to WAV: {wav_path}")
        
        # Transcribe with MLX-Whisper
        transcribe_result = mlx_whisper.transcribe(
            transcribe_path,
            path_or_hf_repo=MODEL,
            language=language if language and language != "auto" else None,
        )

        text = transcribe_result.get("text", "").strip()
        detected_language = transcribe_result.get("language", language or "unknown")

        if response_format == "text":
            return text

        return JSONResponse({
            "text": text,
            "language": detected_language,
        })

    except Exception as e:
        print(f"Transcription error: {e}")
        return JSONResponse(
            {"error": f"Transcription failed: {str(e)}"},
            status_code=500
        )

    finally:
        # Clean up temp files
        if os.path.exists(original_path):
            os.unlink(original_path)
        if os.path.exists(wav_path):
            os.unlink(wav_path)

@app.post("/v1/audio/translations")
async def translate(
    file: UploadFile = File(...),
    model: str = Form(default=MODEL),
    response_format: str = Form(default="json"),
):
    """OpenAI-compatible translation endpoint (to English)"""

    # Get file extension, default to .webm if not present
    original_ext = os.path.splitext(file.filename or "audio.webm")[1]
    if not original_ext:
        original_ext = ".webm"
    
    content = await file.read()
    
    if not content or len(content) == 0:
        return JSONResponse(
            {"error": "Empty audio file received"},
            status_code=400
        )
    
    with tempfile.NamedTemporaryFile(delete=False, suffix=original_ext) as tmp:
        tmp.write(content)
        original_path = tmp.name
    
    wav_path = original_path.replace(original_ext, ".wav")

    try:
        # Convert to WAV format
        import subprocess
        convert_cmd = [
            "ffmpeg", "-y", "-nostdin",
            "-i", original_path,
            "-ar", "16000",
            "-ac", "1",
            "-c:a", "pcm_s16le",
            wav_path
        ]
        
        result = subprocess.run(convert_cmd, capture_output=True, text=True)
        transcribe_path = wav_path if result.returncode == 0 else original_path
        
        translate_result = mlx_whisper.transcribe(
            transcribe_path,
            path_or_hf_repo=MODEL,
            task="translate",
        )

        text = translate_result.get("text", "").strip()

        if response_format == "text":
            return text

        return JSONResponse({"text": text})

    except Exception as e:
        print(f"Translation error: {e}")
        return JSONResponse(
            {"error": f"Translation failed: {str(e)}"},
            status_code=500
        )

    finally:
        if os.path.exists(original_path):
            os.unlink(original_path)
        if os.path.exists(wav_path):
            os.unlink(wav_path)

if __name__ == "__main__":
    print(f"Starting MLX-Whisper Server with model: {MODEL}")
    print("Optimized for Apple Silicon (M4 Ultra)")
    print("API: http://localhost:8000")
    print("Health: http://localhost:8000/health")
    uvicorn.run(app, host="0.0.0.0", port=8000)
