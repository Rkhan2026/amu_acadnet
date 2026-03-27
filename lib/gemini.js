import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenAI({ apiKey });

// In-memory cache to avoid redundant Gemini API calls
// Using global to persist across Next.js hot-reloads in development
const cache = global.embeddingCache || new Map();
if (process.env.NODE_ENV !== "production") global.embeddingCache = cache;

/**
 * Generates an embedding for the given text using Gemini's embedding model.
 * @param {string} text - The input text to embed.
 * @returns {Promise<number[]>} - The embedding vector.
 */
export async function getEmbedding(text) {
  if (!text || text.trim() === "") return null;

  // Check cache first
  if (cache.has(text)) {
    return cache.get(text);
  }

  try {
    const result = await genAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: [{ parts: [{ text }] }],
    });

    const embedding = result.embeddings[0].values;

    // Save to cache
    cache.set(text, embedding);

    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}

/**
 * Calculates the cosine similarity between two vectors.
 * @param {number[]} vecA
 * @param {number[]} vecB
 * @returns {number} - Similarity score between -1 and 1.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
