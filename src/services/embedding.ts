import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY!);

const MODEL = "sentence-transformers/all-MiniLM-L6-v2";

const cache = new Map<string, number[]>();

function normalizeEmbedding(output: any): number[] {
  if (!output) return [];

  if (ArrayBuffer.isView(output)) {
    return Array.from(output as Float32Array);
  }

  if (Array.isArray(output) && typeof output[0] === "number") {
    return output;
  }

  if (Array.isArray(output) && Array.isArray(output[0])) {
    return output[0];
  }

  throw new Error("Unknown embedding format");
}

export async function hfEmbedding(text: string): Promise<number[]> {
  try {
    if (!text) return [];

    text = text.trim().slice(0, 2000);

    if (cache.has(text)) return cache.get(text)!;

    let lastError: any;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const raw = await client.featureExtraction({
          model: MODEL,
          inputs: text
        });

        const vector = normalizeEmbedding(raw);
        cache.set(text, vector);
        return vector;
      } catch (error) {
        lastError = error;
        console.warn(`HF embedding attempt ${attempt + 1} failed:`, error);
        await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempt)));
      }
    }
    console.error("HF embedding failed after 3 attempts:", lastError);
    throw new Error("Embedding failed");
  } catch (error) {
    console.error("HF embedding error:", error);
    throw new Error("Embedding failed");
  }
}