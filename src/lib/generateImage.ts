// Image generation via Pollinations (free, CORS-friendly, no key).
// Replicate is not browser-callable due to CORS, so we use Pollinations for
// reliable client-side generation.
export async function generateImage(prompt: string): Promise<string> {
  const encoded = encodeURIComponent(prompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&nologo=true&seed=${Date.now()}`;
}
