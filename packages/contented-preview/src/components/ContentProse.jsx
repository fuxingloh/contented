import clsx from 'clsx';

export default function ContentProse({ as: Component = 'div', className, ...props }) {
  return (
    <Component
      className={clsx(
        className,
        'prose prose-slate dark:prose-invert max-w-none dark:text-slate-400',
        // headings
        'prose-headings:scroll-mt-28 lg:prose-headings:scroll-mt-[8.5rem]',
        // lead
        'prose-lead:text-slate-500 dark:prose-lead:text-slate-400',
        // links
        'prose-a:font-semibold prose-a:text-rose-500 dark:prose-a:text-rose-400',
        // link underline
        'prose-a:no-underline hover:prose-a:underline ',
        // code
        'prose-code:before:content-none prose-code:after:content-none',
        // hr
        'dark:prose-hr:border-slate-800',
      )}
      {...props}
    />
  );
}
