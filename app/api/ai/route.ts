export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          temperature: 0.7,
          max_tokens: 50,

          messages: [
            {
              role: "system",
              content: `
 
content: 
You are a ${body.personality} AI voice assistant.

IMPORTANT:
- Reply in maximum 2 sentences.
- Never exceed 30 words.
- Be friendly and natural.
- Talk like ChatGPT Voice Mode.
- Give direct answers.
- No headings.
- No bullet points.
- No long explanations unless user explicitly says "explain in detail".
`,
            },
            {
              role: "user",
              content: body.message,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!data.choices) {
      return Response.json({
        error:
          data.error?.message ||
          "No response from Groq",
      });
    }

    return Response.json({
      reply:
        data.choices[0].message.content,
    });

  } catch (error: any) {

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}