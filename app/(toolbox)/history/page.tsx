import { listRecentToolRuns } from '@/features/runs/run.repository';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  try {
    const runs = await listRecentToolRuns();

    return (
      <>
        <div className="page-head">
          <div>
            <p className="eyebrow">Developer / history</p>
            <h1>Saved runs</h1>
            <p>Inspect the 50 most recent saved utility runs.</p>
          </div>
        </div>
        {runs.length === 0 ? (
          <p className="muted">No saved runs yet.</p>
        ) : (
          <div className="history-list">
            {runs.map((run) => (
              <article className="card" key={run.id}>
                <div className="history-meta">
                  <strong>{run.tool}</strong>
                  <time dateTime={run.created_at}>{new Date(run.created_at).toLocaleString()}</time>
                </div>
                <details>
                  <summary>Input</summary>
                  <pre>{run.input}</pre>
                </details>
                <details open>
                  <summary>Output</summary>
                  <pre>{JSON.stringify(run.output, null, 2)}</pre>
                </details>
              </article>
            ))}
          </div>
        )}
      </>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load saved runs.';
    return <p role="alert">{message}</p>;
  }
}
