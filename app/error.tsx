"use client";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <section className="section-card" role="alert">
      <h1>Something went wrong</h1>
      <p>{error.message || "Unexpected error. Please try again."}</p>
      <button type="button" className="btn btn-secondary" onClick={reset}>
        Retry
      </button>
    </section>
  );
}
