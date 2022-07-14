export default function NotFound() {
  return (
    <main className="max-w-8xl mx-auto flex w-full flex-grow flex-col px-4 sm:px-6 lg:px-8">
      <div className="my-auto flex-shrink-0 py-16 sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-500">404 error</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
        <div className="mt-6">
          <a href="/" className="text-base font-medium text-indigo-600 dark:text-indigo-500">
            Go back home<span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </main>
  );
}
