
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export async function generateSqlFromNaturalLanguage(
  naturalLanguageQuery: string,
  schema: string
): Promise<string> {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Given the following SQLite database schema:
    ---
    ${schema}
    ---
    Translate the following natural language question into a read-only SQL SELECT query.
    - Only return the SQL query.
    - Do not include any explanations, comments, or markdown formatting like \`\`\`sql.
    - Ensure the query is valid for SQLite.

    Question: "${naturalLanguageQuery}"

    SQL Query:
  `;

  try {
    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });
    const sql = response.text.trim();
    // A simple cleanup in case the model returns markdown
    return sql.replace(/^```sql\s*|```$/g, '').trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate SQL. See console for details.");
  }
}
