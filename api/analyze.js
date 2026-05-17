export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY" });
    }

    const { enemy = [], ally = [] } = req.body || {};

    const prompt = `
Jesteś ekspertem od Epic Seven RTA.

Drużyna przeciwnika:
${enemy.map((x, i) => `${i + 1}. ${x.name || x.n || x}`).join("\n") || "brak"}

Moja drużyna:
${ally.map((x, i) => `${i + 1}. ${x.name || x.n || x}`).join("\n") || "brak"}

Zadanie:
1. Oceń zagrożenia przeciwnika.
2. Wskaż najlepszego bana przeciwnika.
3. Oceń moją drużynę i jej synergię.
4. Zaproponuj kolejne picki, które dobrze komponują się z moją drużyną.
5. Podaj krótkie wskazówki draftowe.

Pisz po polsku, konkretnie i praktycznie.
`;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "Jesteś ekspertem od Epic Seven RTA. Odpowiadasz po polsku."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 900
      })
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return res.status(openaiResponse.status).json({
        error: "OpenAI API error",
        details: data
      });
    }

    const text = data.choices?.[0]?.message?.content || "";

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      details: err?.message || String(err)
    });
  }
}
