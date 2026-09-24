import { useEffect, useState } from 'react';

export default function App() {
  const [question, setQuestion] = useState(null);
  const [status, setStatus] = useState('loading');
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  async function loadQuestion(signal) {
    setStatus('loading');

    try {
      const response = await fetch('/api/prompt', { signal, cache: 'no-store' });
      if (!response.ok) throw new Error('Question unavailable');

      const nextQuestion = await response.json();
      if (!nextQuestion.statement || !['fact', 'fiction'].includes(nextQuestion.type)) {
        throw new Error('Invalid question');
      }

      setQuestion(nextQuestion);
      setSelected(null);
      setStatus('ready');
    } catch (error) {
      if (error.name !== 'AbortError') setStatus('error');
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadQuestion(controller.signal);
    return () => controller.abort();
  }, []);

  function answer(choice) {
    if (selected) return;
    setSelected(choice);
    if (choice === question.type) {
      setScore((current) => current + 1);
    }
  }

  return (
    <main className="page">
      <header>
        <h1>Fact <span>or</span> Fiction?</h1>
        <p>Can you tell which statements are true?</p>
      </header>

      <section className="card" aria-live="polite">
        <p className="score">Score: {score}</p>

        {status === 'loading' && <p className="statement">Finding a question…</p>}

        {status === 'error' && (
          <div className="message" role="alert">
            <p>Could not load a question.</p>
            <button onClick={() => loadQuestion()}>Try again</button>
          </div>
        )}

        {status === 'ready' && (
          <>
            <p className="statement">“{question.statement}”</p>
            <div className="choices">
              <button disabled={Boolean(selected)} onClick={() => answer('fact')}>Fact</button>
              <button disabled={Boolean(selected)} onClick={() => answer('fiction')}>Fiction</button>
            </div>

            {selected && (
              <div className="message" role="status">
                <p>{selected === question.type ? 'Correct!' : `Not quite. It is ${question.type}.`}</p>
                <button onClick={() => loadQuestion()}>Next question</button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
