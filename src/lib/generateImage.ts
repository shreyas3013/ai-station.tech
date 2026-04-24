// Image generation via Lovable AI Gateway edge function (Nano Banana).
// Falls back to Pollinations (URL-only, no API key) if the gateway fails.
export async function generateImage(prompt: string): Promise<string> {
  try {
    const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-image`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        apikey: key,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });
    if (res.ok) {
      const { url: imageUrl } = await res.json();
      if (imageUrl) return imageUrl;
    }
  } catch {
    /* fall through to Pollinations */
  }

  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&seed=${Date.now()}`;
}