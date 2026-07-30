/** Shared typography wrapper for the policy pages. */
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-[1.35rem] [&_h2]:font-extrabold [&_h2]:text-deep [&_h3]:mt-7 [&_h3]:font-display [&_h3]:text-[1.05rem] [&_h3]:font-bold [&_h3]:text-deep [&_li]:mt-2 [&_li]:text-[1rem] [&_li]:leading-relaxed [&_li]:text-slate-soft [&_p]:mt-4 [&_p]:text-[1rem] [&_p]:leading-relaxed [&_p]:text-slate-soft [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}
