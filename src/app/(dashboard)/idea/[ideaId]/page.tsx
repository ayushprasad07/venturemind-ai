"use client"
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Cpu, ChevronRight } from 'lucide-react';

const fetchData = async (ideaId: string) => {
  const response = await axios.get(`/api/fetch-idea-by-id/${ideaId}`);
  if (response.data.success) return response.data.data;
  throw new Error(response.data.message);
};

const SectionCard = ({
  label,
  index,
  children,
}: {
  label: string;
  index: number;
  children: React.ReactNode;
}) => (
  <div
    className="relative w-full"
    style={{
      opacity: 0,
      animation: `fadeUp 0.45s cubic-bezier(0.4,0,0.2,1) ${0.15 + index * 0.08}s forwards`,
    }}
  >
    {/* Section label */}
    <div className="mb-3 flex items-center gap-2">
      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-gray-400 dark:text-neutral-600">
        {String(index).padStart(2, '0')}
      </span>
      <div className="h-px flex-1 bg-gray-100 dark:bg-neutral-900" />
      <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-gray-400 dark:text-neutral-600">
        {label}
      </span>
    </div>

    {/* Content area — no card, just a left accent line */}
    <div className="relative border-l border-gray-200 dark:border-neutral-800 pl-6">
      <div className="prose-idea">{children}</div>
    </div>
  </div>
);

const MetaCell = ({ label, value }: { label: string; value?: string }) => (
  <div className="group">
    <p className="mb-1 font-mono text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-neutral-600">
      {label}
    </p>
    <p className="border-b border-gray-100 dark:border-neutral-900 pb-2 font-mono text-[13px] text-gray-800 dark:text-neutral-200 transition-colors group-hover:border-blue-500/40">
      {value ?? '—'}
    </p>
  </div>
);

const mdComponents = {
  h1: ({ children }: any) => (
    <h1 className="mb-3 font-mono text-xl font-medium tracking-wide text-gray-900 dark:text-neutral-100">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="mb-2 mt-6 font-mono text-sm font-medium tracking-[0.1em] text-gray-700 dark:text-neutral-300 uppercase">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="mb-2 mt-4 font-mono text-xs font-medium text-blue-500 uppercase tracking-widest">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="mb-3 font-sans text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="mb-3 space-y-1.5 pl-0">{children}</ul>
  ),
  ol: ({ children }: any) => (
    <ol className="mb-3 space-y-1.5 pl-4 list-decimal font-sans text-sm text-gray-600 dark:text-neutral-400">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="flex items-start gap-3 font-sans text-sm leading-relaxed text-gray-600 dark:text-neutral-400">
      <span className="mt-2.5 inline-block h-1 w-1 shrink-0 rounded-full bg-blue-500/60" />
      <span>{children}</span>
    </li>
  ),
  strong: ({ children }: any) => (
    <strong className="font-medium text-gray-900 dark:text-neutral-200">{children}</strong>
  ),
  em: ({ children }: any) => (
    <em className="italic text-blue-500 dark:text-blue-400">{children}</em>
  ),
  code: ({ inline, children }: any) =>
    inline ? (
      <code className="rounded bg-gray-100 dark:bg-neutral-900 px-1.5 py-0.5 font-mono text-[11px] text-blue-600 dark:text-blue-400">
        {children}
      </code>
    ) : (
      <pre className="my-4 overflow-x-auto rounded border border-gray-100 dark:border-neutral-900 bg-gray-50 dark:bg-neutral-950 p-4">
        <code className="font-mono text-[12px] text-gray-700 dark:text-neutral-300">{children}</code>
      </pre>
    ),
  blockquote: ({ children }: any) => (
    <blockquote className="my-3 border-l-2 border-blue-500/40 pl-4 text-sm italic text-gray-500 dark:text-neutral-500">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-5 border-gray-100 dark:border-neutral-900" />,
  table: ({ children }: any) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse font-mono text-[12px]">{children}</table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-950 px-4 py-2 text-left text-[9px] tracking-widest text-gray-500 dark:text-neutral-500 uppercase">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border-b border-gray-100 dark:border-neutral-900 px-4 py-2 text-sm text-gray-600 dark:text-neutral-400">
      {children}
    </td>
  ),
};

const Idea = () => {
  const { ideaId } = useParams();
  const router = useRouter();

  const { data: idea, isLoading, isError, error } = useQuery({
    queryKey: ["idea", ideaId],
    queryFn: () => fetchData(ideaId as string),
    enabled: !!ideaId,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-neutral-950 font-mono">
        <div className="h-5 w-5 animate-spin rounded-full border border-gray-200 dark:border-neutral-800 border-t-blue-500" />
        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 dark:text-neutral-600">
          Fetching idea...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-neutral-950 font-mono px-4">
        <div className="text-center">
          <p className="mb-2 text-[9px] tracking-[0.2em] uppercase text-gray-400 dark:text-neutral-600">
            Error
          </p>
          <p className="text-sm text-red-500">
            {(error as Error).message}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-6 text-[10px] tracking-[0.14em] uppercase text-blue-500 hover:opacity-70 transition-opacity"
          >
            ← Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    { key: 'analysis',            label: 'Analysis' },
    { key: 'marketAnalysis',      label: 'Market analysis' },
    { key: 'technicalFeasibility',label: 'Technical feasibility' },
    { key: 'businessModel',       label: 'Business model' },
  ].filter(s => idea?.[s.key]);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
      `}</style>

      <div className="relative min-h-screen w-full bg-white dark:bg-neutral-950 font-mono">
        <div className="mx-auto w-full px-6 py-12 md:px-8 md:py-16">

          {/* Top nav row */}
          <div
            className="mb-12 flex items-center justify-between"
            style={{ opacity: 0, animation: 'fadeUp 0.4s ease 0.05s forwards' }}
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-[10px] tracking-[0.14em] uppercase text-gray-400 dark:text-neutral-600 transition-colors hover:text-gray-700 dark:hover:text-neutral-300"
            >
              <ArrowLeft className="h-3 w-3" />
              Dashboard
            </button>

            <div className="flex items-center gap-2 text-[10px] tracking-[0.1em] text-gray-300 dark:text-neutral-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-[pulse_2s_ease-in-out_infinite]" />
              <Cpu className="h-3 w-3" />
              <span>VM-AI · v2.1.0</span>
            </div>
          </div>

          {/* Badges */}
          <div
            className="mb-4 flex items-center gap-2"
            style={{ opacity: 0, animation: 'fadeUp 0.4s ease 0.08s forwards' }}
          >
            <span className="border border-blue-500/30 px-2.5 py-0.5 text-[9px] tracking-[0.18em] uppercase text-blue-500">
              IDEA REPORT
            </span>
            <span className="border border-emerald-500/30 px-2.5 py-0.5 text-[9px] tracking-[0.18em] uppercase text-emerald-500">
              ANALYZED
            </span>
          </div>

          {/* Title */}
          <div
            style={{ opacity: 0, animation: 'fadeUp 0.45s ease 0.12s forwards' }}
          >
            <h1 className="mb-2 text-3xl font-medium leading-snug tracking-tight text-gray-900 dark:text-neutral-100 break-words font-sans">
              {idea?.title}
            </h1>
            <p className="text-[10px] tracking-[0.1em] uppercase text-gray-300 dark:text-neutral-700">
              GENERATED · VM-AI · v2.1.0
            </p>
          </div>

          {/* Divider */}
          <div
            className="my-8 h-px bg-gray-100 dark:bg-neutral-900"
            style={{ opacity: 0, animation: 'fadeUp 0.4s ease 0.16s forwards' }}
          />

          {/* Meta grid */}
          <div
            className="mb-10 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4"
            style={{ opacity: 0, animation: 'fadeUp 0.45s ease 0.2s forwards' }}
          >
            <MetaCell label="Industry"    value={idea?.industry} />
            <MetaCell label="Target user" value={idea?.targetUser} />
            <MetaCell label="Problem"     value={idea?.problem} />
            <MetaCell label="Feasibility" value="High" />
          </div>

          {/* Divider */}
          <div
            className="mb-12 h-px bg-gray-100 dark:bg-neutral-900"
            style={{ opacity: 0, animation: 'fadeUp 0.4s ease 0.24s forwards' }}
          />

          {/* Content sections */}
          <div className="space-y-12">
            {sections.length > 0 ? (
              sections.map((s, i) => (
                <SectionCard key={s.key} label={s.label} index={i + 1}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                    {idea?.[s.key]}
                  </ReactMarkdown>
                </SectionCard>
              ))
            ) : (
              <SectionCard label="Analysis" index={1}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {idea?.analysis ?? '_No analysis available._'}
                </ReactMarkdown>
              </SectionCard>
            )}
          </div>

          {/* Footer */}
          <div
            className="mt-16 flex items-center justify-between border-t border-gray-100 dark:border-neutral-900 pt-6 text-[10px] tracking-[0.1em] uppercase text-gray-300 dark:text-neutral-700"
            style={{ opacity: 0, animation: 'fadeUp 0.4s ease 0.5s forwards' }}
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-[pulse_2s_ease-in-out_infinite]" />
              <span>Neural engine online</span>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1 transition-colors hover:text-gray-600 dark:hover:text-neutral-400"
            >
              New idea
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Idea;