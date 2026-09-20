// Lightweight prose wrapper for static content pages (Terms, Privacy, About, Contact).
export function ProseContainer({ children }) {
  return (
    <div className="prose-container max-w-none">
      <style>{`
        .prose-container h1 { font-size: 1.875rem; font-weight: 800; margin-bottom: 0.5rem; }
        .prose-container h2 { font-size: 1.25rem; font-weight: 700; margin-top: 1.75rem; margin-bottom: 0.5rem; }
        .prose-container p { color: hsl(var(--muted-foreground)); line-height: 1.7; margin-bottom: 0.75rem; }
        .prose-container ul { list-style: disc; padding-left: 1.25rem; margin-bottom: 0.75rem; }
        .prose-container li { color: hsl(var(--muted-foreground)); line-height: 1.7; margin-bottom: 0.25rem; }
        .prose-container a { color: hsl(var(--primary)); font-weight: 500; }
        .prose-container a:hover { text-decoration: underline; }
      `}</style>
      {children}
    </div>
  );
}

export default ProseContainer;
