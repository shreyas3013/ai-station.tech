export async function generateImage(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt);
  const pollinationsUrl =
    `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&seed=${Date.now()}`;

  // Pollinations serves images directly via URL. A HEAD pre-check is blocked
  // by CORS in the browser, which previously caused us to fall through to
  // Replicate (which also can't be called from the browser due to CORS).
  // The <img> tag loads cross-origin images without CORS, so just return the URL.
  return pollinationsUrl;

  // eslint-disable-next-line no-unreachable
  const _replicateRes = await fetch(
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

  const { urls } = await _replicateRes.json();
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