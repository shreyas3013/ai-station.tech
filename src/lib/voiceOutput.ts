let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string): void {
  speechSynthesis.cancel();

  const clean = text
    .replace(/```[\s\S]*?```/g, 'code block')
    .replace(/[#*`_~]/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = 'en-US';
  utterance.rate = 1.05;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const loadVoice = () => {
    const voices = speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      v.name.includes('Google') ||
      v.name.includes('Natural') ||
      v.name.includes('Samantha')
    );
    if (preferred) utterance.voice = preferred;
  };

  if (speechSynthesis.getVoices().length > 0) {
    loadVoice();
  } else {
    speechSynthesis.onvoiceschanged = loadVoice;
  }

  currentUtterance = utterance;
  speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  return speechSynthesis.speaking;
}