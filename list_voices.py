import os
import requests

ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")  # Zorg dat deze in je .env staat of handmatig hier invoegen

def list_voices():
    url = "https://api.elevenlabs.io/v1/voices"
    headers = {
        "xi-api-key": ELEVEN_API_KEY,
        "accept": "application/json"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        voices = response.json().get("voices", [])
        print(f"🎤 {len(voices)} stemmen gevonden:\n")
        for voice in voices:
            print(f"Naam: {voice['name']}")
            print(f"Language: {voice.get('labels', {}).get('accent', 'onbekend')}")
            print(f"Voice ID: {voice['voice_id']}")
            print("-" * 40)
    else:
        print(f"❌ Fout bij ophalen: {response.status_code} - {response.text}")

if __name__ == "__main__":
    list_voices()
