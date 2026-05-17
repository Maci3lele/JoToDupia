module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY in Vercel Environment Variables' });
  }

  try {
    const draft = req.body || {};
    const model = process.env.OPENAI_MODEL || 'gpt-5.5';

    const prompt = `Jesteś ekspertem Epic Seven RTA. Oceń draft i odpowiedz po polsku.

ZASADY:
- Gra ma 5 picków, a na końcu banowany jest 1 pick przeciwnika.
- Użytkownik chce praktyczną podpowiedź do draftu, nie ogólny opis gry.
- Korzystaj z danych lokalnego algorytmu jako kandydatów, ale możesz je przetasować, jeśli draft tego wymaga.
- Nie wymyślaj postaci spoza przekazanych list kandydatów.
- Bądź konkretny: ban, counter picki, synergia z moją drużyną, luki w drafcie.
- Jeśli moje picki są puste, skup się na kontrach i banie.
- Jeśli przeciwnik jest pusty, skup się na budowaniu mojej drużyny.

DANE DRAFTU JSON:
${JSON.stringify(draft, null, 2)}

Format odpowiedzi:
# 🚫 Ban
Krótko wskaż najlepszy ban i 1-2 alternatywy.

# 🛡️ Kontry
Wypisz 4-6 najlepszych counter picków z krótkim uzasadnieniem.

# 🤝 Synergia mojej drużyny
Wypisz co pasuje do moich picków i jaką rolę uzupełnia.

# 📌 Plan draftu
Podaj 3 konkretne kroki: co pickować, czego unikać, co banować.

# ⚠️ Ryzyka
Wskaż 2-3 największe zagrożenia w tym drafcie.`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        input: prompt,
        max_output_tokens: 1400
      })
    });

    const data = await response.json();
    if (!response.ok) {
      const message = data?.error?.message || 'OpenAI request failed';
      return res.status(response.status).json({ error: message });
    }

    const analysis = data.output_text || (data.output || [])
      .flatMap(item => item.content || [])
      .map(part => part.text || '')
      .join('\n')
      .trim();

    return res.status(200).json({ analysis });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unexpected server error' });
  }
};
