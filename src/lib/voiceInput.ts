export function startVoiceInput(
  onResult: (text: string) => void,
  onError?: (err: string) => void
): () => void {
  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.('Voice input not supported in this browser (use Chrome).');
    return () => {};
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;

  recognition.onresult = (event: any) => {
    const transcript = Array.from(event.results)
      .map((r: any) => r[0].transcript)
      .join('');
    if (event.results[event.results.length - 1].isFinal) {
      onResult(transcript);
    }
  };

  recognition.onerror = (event: any) => onError?.(event.error);
  recognition.start();

  return () => recognition.stop();
}