// El-achtige frontend met press-and-hold audio-opname, sessiegeheugen en bedrijfs-URL input
import React, { useState, useEffect, useRef } from 'react';
import useRecorder from './useRecorder';

export default function ElFrontend() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const sessionId = useRef(crypto.randomUUID());

  const [audioBlob, startRecording, stopRecording, isRecording] = useRecorder();

  useEffect(() => {
    if (audioBlob) {
      handleUpload(audioBlob);
    }
  }, [audioBlob]);

  const handleUpload = async (blob) => {
    setIsLoading(true);
    setAudioUrl(null);
    setTranscript('');

    const formData = new FormData();
    formData.append("audio", blob);
    formData.append("session_id", sessionId.current);

    try {
      const response = await fetch('https://concierge-webbot-hildo.onrender.com/ask', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setAudioUrl(data.audio_url);
      setTranscript(data.text);
    } catch (error) {
      console.error("Error during upload:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompanyUrl = async () => {
    const normalizedUrl = companyUrl.startsWith("http") ? companyUrl : `https://${companyUrl}`;

    const formData = new FormData();
    formData.append("url", normalizedUrl);
    formData.append("session_id", sessionId.current);

    try {
      const response = await fetch('https://concierge-webbot-hildo.onrender.com/upload_url', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setAudioUrl(data.audio_url);
      setTranscript(data.text);
      setCompanyUrl('');
    } catch (error) {
      console.error("Error during upload_url:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <h1 className="text-3xl font-bold mb-6">🎙️ El - Voice Concierge</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Voer een bedrijfswebsite in (bijv. handjehelpen.nl)"
          value={companyUrl}
          onChange={(e) => setCompanyUrl(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded-md mr-2"
        />
        <button
          onClick={handleCompanyUrl}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          Vraag iets over deze website
        </button>
      </div>

      <div className="mb-6">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-6 py-3 rounded-full text-white ${isRecording ? 'bg-red-600' : 'bg-green-600'}`}
        >
          {isRecording ? 'Stop opname' : 'Start opname'}
        </button>
      </div>

      {isLoading && <p>Even geduld, ik denk na en praat terug...</p>}
      {transcript && <p className="my-4 italic">💬 {transcript}</p>}
      {audioUrl && (
        <audio controls className="mt-4">
          <source src={audioUrl} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
