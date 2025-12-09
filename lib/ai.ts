import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function groqSummarize(text: string) {
  const completion = await groq.chat.completions.create({
    model: "llama3-70b-8192",
    messages: [
      { role: "system", content: "Summarize logs into human-readable insight." },
      { role: "user", content: text }
    ]
  });

  return completion.choices[0].message.content;
}
