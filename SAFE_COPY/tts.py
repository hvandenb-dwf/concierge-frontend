# app/tts.py

from elevenlabs.client import ElevenLabs, TextToSpeech
from elevenlabs import Voice
import os

# Maak een client
eleven_client = ElevenLabs(api_key=os.getenv("ELEVEN_API_KEY"))

# Specificeer de gewenste stem (zoals Ruth)
voice = Voice(voice_id=os.getenv("ELEVEN_VOICE_ID", "YUdpWWny7k5yb4QCeweX"))

# Maak de nieuwe TextToSpeech aan
text_to_speech = TextToSpeech(client=eleven_client)

# Hoofdfunctie om audio te genereren
def generate_audio(text: str) -> bytes:
    return text_to_speech(text=text, voice=voice)
