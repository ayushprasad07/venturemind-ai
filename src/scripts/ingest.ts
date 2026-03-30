import fs from "fs";
import Papa from "papaparse";

import { hfEmbedding } from "../services/embedding";
import { pineconeIndex } from "../services/pinecone";

type VectorRecord = {
  id: string;
  values: number[];
  metadata?: {
    name?: string;
    industry?: string;
    country?: string;
    permalink?: string;
    text?: string;
  };
};

const BATCH_SIZE = 50;

async function ingest() {
  console.log("🚀 Ingesting data...");

  const file = fs.readFileSync("src/data/startups_data.csv", "utf8");

  const parsed = Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = parsed.data as any[];

  console.log("Total rows:", rows.length);

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const chunk = rows.slice(i, i + BATCH_SIZE);

    const vectors = await Promise.all(
      chunk.map(async (row) => {
        const cleanText = row.text?.replace(/\s+/g, " ").trim();
        if (!cleanText) return null;
        return await hfEmbedding(cleanText);
      })
    );

    const batch: VectorRecord[] = [];

    chunk.forEach((row, idx) => {
      const vector = vectors[idx];
      if (!vector) return;

      batch.push({
        id: row.id,
        values: vector,
        metadata: {
          name: row.name,
          industry: row.industry,
          country: row.country,
          permalink: row.permalink,
          text: row.text,
        },
      });
    });

    await pineconeIndex.upsert({
      records: batch,
    });

    console.log(`✅ Uploaded batch till row ${i}`);
  }

  console.log("🎉 Ingestion completed!");
}

ingest();