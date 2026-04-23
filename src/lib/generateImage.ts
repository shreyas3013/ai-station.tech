export async function generateImage(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt);
  const pollinationsUrl =
    `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&seed=${Date.now()}`;

  try {
    const test = await fetch(pollinationsUrl, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
    if (test.ok) return pollinationsUrl;
  } catch { /* fall through */ }

  const replicateRes = await fetch(
    'https://api.replicate.com/v1/models/stability-ai/sdxl/predictions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: { prompt, num_inference_steps: 30 } })
    }
  );

  const { urls } = await replicateRes.json();
  let result: any;
  let delay = 1000;

  while (!result || result.status !== 'succeeded') {
    await new Promise(r => setTimeout(r, delay));
    delay = Math.min(delay * 1.5, 5000);
    const poll = await fetch(urls.get, {
      headers: { 'Authorization': `Bearer ${import.meta.env.VITE_REPLICATE_API_KEY}` }
    });
    result = await poll.json();
    if (result.status === 'failed') throw new Error('Image generation failed');
  }

  return result.output[0];
}