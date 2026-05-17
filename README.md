# E7 Draft Assistant AI

Jednoplikowy frontend + endpoint Vercel `/api/analyze` do analizy AI draftu Epic Seven RTA.

## Jak wrzucić na GitHub + Vercel

1. Utwórz nowe repo na GitHubie, np. `e7-draft-assistant-ai`.
2. Wrzuć do repo wszystkie pliki z tej paczki:
   - `index.html`
   - `api/analyze.js`
   - `package.json`
   - `.gitignore`
3. Wejdź na Vercel i wybierz **Add New Project**.
4. Wskaż swoje repo z GitHuba.
5. W projekcie Vercel dodaj zmienną środowiskową:
   - Name: `OPENAI_API_KEY`
   - Value: Twój klucz API z OpenAI
6. Opcjonalnie dodaj:
   - Name: `OPENAI_MODEL`
   - Value: `gpt-5.5`
7. Kliknij **Deploy**.
8. Po wdrożeniu Vercel da Ci link do aplikacji.

## Jak działa

- Frontend działa w `index.html`.
- Po kliknięciu **Analizuj draft** aplikacja najpierw generuje fallback lokalny.
- Następnie wysyła dane draftu do `/api/analyze`.
- Endpoint trzyma klucz API po stronie serwera, więc nie widać go w przeglądarce.
- Jeśli API nie odpowie, użytkownik nadal widzi analizę lokalną.

## Lokalny test

Po zainstalowaniu Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

W lokalnym środowisku ustaw `OPENAI_API_KEY`, np. w `.env.local`:

```text
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-5.5
```

Nie wrzucaj `.env.local` na GitHuba.
