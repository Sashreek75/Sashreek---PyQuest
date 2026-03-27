
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LessonSection } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonContentProps {
  introduction: string;
  sections: LessonSection[];
  summary: string;
  /** Called when the user completes all pages and clicks "Go to Challenge" */
  onReadyForChallenge?: () => void;
}

// Each "page" in the pamphlet is a slice of sections with a title
interface Page {
  pageIndex: number;
  title: string;
  subtitle?: string;
  icon: string;
  color: string; // accent color hex
  sections: LessonSection[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Splits the raw sections array into logical pages.
 * Every `heading` section becomes the start of a new page.
 */
function buildPages(
  introduction: string,
  sections: LessonSection[],
  summary: string,
): Page[] {
  const PAGE_META = [
    { title: 'Introduction',    subtitle: 'The Big Picture',          icon: '◎', color: '#f5c842' },
    { title: 'Core Concept',    subtitle: 'The Foundation',           icon: '◈', color: '#f5c842' },
    { title: 'How It Works',    subtitle: 'Under the Hood',           icon: '⬡', color: '#f5c842' },
    { title: 'In Practice',     subtitle: 'Real Examples',            icon: '◆', color: '#f5c842' },
    { title: 'Edge Cases',      subtitle: 'Watch Out',                icon: '⚠️', color: '#f5c842' },
    { title: 'Patterns',        subtitle: 'Best Practices',           icon: '◉', color: '#f5c842' },
    { title: 'Deep Dive',       subtitle: 'Going Further',            icon: '◑', color: '#f5c842' },
    { title: 'Putting It Together', subtitle: 'The Full Picture',     icon: '⬟', color: '#f5c842' },
    { title: 'Summary',         subtitle: 'Key Takeaways',            icon: '✦', color: '#f5c842' },
  ];

  const pages: Page[] = [];

  // Page 0: Introduction
  pages.push({
    pageIndex: 0,
    ...PAGE_META[0],
    sections: [{ id: '__intro', type: 'text', content: introduction }],
  });

  let currentSections: LessonSection[] = [];
  let headingText = '';

  const flush = () => {
    if (currentSections.length === 0 && !headingText) return;
    const metaIndex = Math.min(pages.length, PAGE_META.length - 2);
    const meta = PAGE_META[metaIndex];
    pages.push({
      pageIndex: pages.length,
      title: headingText || meta.title,
      subtitle: meta.subtitle,
      icon: meta.icon,
      color: meta.color,
      sections: [...currentSections],
    });
    currentSections = [];
    headingText = '';
  };

  sections.forEach(s => {
    if (s.type === 'heading') {
      flush();
      headingText = s.content;
    } else {
      currentSections.push(s);
    }
  });
  flush();

  // Final page: Summary
  pages.push({
    pageIndex: pages.length,
    ...PAGE_META[8],
    color: '#6366f1',
    sections: [{ id: '__summary', type: 'text', content: summary }],
  });

  return pages;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const CodeBlock: React.FC<{ label: string; code: string; accent: string }> = ({ label, code, accent }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="lc-code-block" style={{ '--accent': accent } as React.CSSProperties}>
      <div className="lc-code-header">
        <div className="lc-code-dots">
          <span style={{ background: '#f43f5e' }} />
          <span style={{ background: '#f59e0b' }} />
          <span style={{ background: '#10b981' }} />
        </div>
        <span className="lc-code-label">{label || 'kernel_snippet.py'}</span>
        <button className="lc-copy-btn" onClick={copy}>
          {copied ? '✓ COPIED' : 'COPY'}
        </button>
      </div>
      <pre className="lc-code-pre"><code>{code}</code></pre>
    </div>
  );
};

const Callout: React.FC<{ variant?: string; title?: string; content: string }> = ({ variant, title, content }) => {
  const styles: Record<string, { icon: string; bg: string; border: string; textColor: string; label: string }> = {
    'pro-tip': { icon: '💡', bg: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.25)', textColor: '#a5b4fc', label: 'Senior Insight' },
    warning:   { icon: '⚠️', bg: 'rgba(244,63,94,0.07)', border: 'rgba(244,63,94,0.25)', textColor: '#fda4af', label: 'Logic Check' },
    default:   { icon: '🧠', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.25)', textColor: '#6ee7b7', label: 'Key Principle' },
  };
  const s = styles[variant ?? 'default'] ?? styles.default;
  return (
    <div className="lc-callout" style={{ background: s.bg, borderColor: s.border }}>
      <div className="lc-callout-header">
        <span className="lc-callout-icon">{s.icon}</span>
        <span className="lc-callout-label" style={{ color: s.textColor }}>{title || s.label}</span>
      </div>
      <p className="lc-callout-body" style={{ color: s.textColor }}>{content}</p>
    </div>
  );
};

const SectionRenderer: React.FC<{ section: LessonSection; accent: string; index: number }> = ({ section, accent, index }) => {
  const delay = `${index * 60}ms`;

  if (section.type === 'heading') return null;

  if (section.type === 'text') return (
    <p className="lc-text" style={{ animationDelay: delay }}>{section.content}</p>
  );

  if (section.type === 'callout') return (
    <div style={{ animationDelay: delay }} className="lc-anim">
      <Callout variant={section.variant} title={section.title} content={section.content} />
    </div>
  );

  if (section.type === 'code-demo') return (
    <div style={{ animationDelay: delay }} className="lc-anim">
      <CodeBlock label={section.content} code={section.snippet ?? ''} accent={accent} />
    </div>
  );

  return null;
};

const ProgressBar: React.FC<{ total: number; current: number; onJump: (i: number) => void; visited: Set<number> }> = ({ total, current, onJump, visited }) => (
  <div className="lc-progress-bar">
    {Array.from({ length: total }).map((_, i) => (
      <button
        key={i}
        className={`lc-dot ${i === current ? 'active' : ''} ${visited.has(i) ? 'visited' : ''}`}
        onClick={() => onJump(i)}
        aria-label={`Go to page ${i + 1}`}
      />
    ))}
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

const LessonContent: React.FC<LessonContentProps> = ({
  introduction,
  sections,
  summary,
  onReadyForChallenge,
}) => {
  const pages = useMemo(() => buildPages(introduction, sections, summary), [introduction, sections, summary]);
  const [currentPage, setCurrentPage] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([0]));
  const [allRead, setAllRead] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const page = pages[currentPage];
  const isFirst = currentPage === 0;
  const isLast = currentPage === pages.length - 1;

  const goTo = (idx: number) => {
    if (idx < 0 || idx >= pages.length) return;
    setCurrentPage(idx);
    setAnimKey(k => k + 1);
    setVisited(v => new Set([...v, idx]));
    if (idx === pages.length - 1) setAllRead(true);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const next = () => goTo(currentPage + 1);
  const prev = () => goTo(currentPage - 1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentPage, pages.length]);

  return (
    <div className="lc-root">
      <style>{`
        .lc-root {
          --accent: ${page.color};
          --bg: #faf8f5;
          --surface: #ffffff;
          --border: #e8e3db;
          --text: #1a1714;
          --text-dim: #6b6560;
          --font-display: 'DM Serif Display', serif;
          --font-body: 'DM Sans', sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          font-family: var(--font-body);
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          color: var(--text);
          position: relative;
        }

        .lc-pamphlet {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 32px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }

        .lc-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-bottom: 1px solid var(--border);
          background: #faf8f5;
          flex-shrink: 0;
        }
        .lc-chapter-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: var(--text-dim);
          text-transform: uppercase;
          font-weight: 700;
        }
        .lc-chapter-label span {
          color: #d97706;
        }
        .lc-page-counter {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.1em;
        }
        .lc-page-counter strong { color: #d97706; }

        .lc-progress-strip {
          height: 3px;
          background: #faf8f5;
          flex-shrink: 0;
          position: relative;
        }
        .lc-progress-fill {
          height: 100%;
          transition: width 0.7s cubic-bezier(0.19, 1, 0.22, 1);
          background: #f5c842;
        }

        .lc-page-header {
          padding: 40px 48px 24px;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .lc-page-header::before {
          content: attr(data-icon);
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 100px;
          color: #f5c842;
          opacity: 0.1;
          line-height: 1;
          pointer-events: none;
          font-family: var(--font-mono);
        }
        .lc-page-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #f5c84215;
          border: 1px solid #f5c84230;
          border-radius: 100px;
          padding: 4px 12px;
          margin-bottom: 16px;
        }
        .lc-page-tag-icon { font-size: 12px; color: #d97706; }
        .lc-page-tag-text {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #d97706;
          font-weight: 800;
        }
        .lc-page-title {
          font-family: var(--font-display);
          font-size: clamp(28px, 3.5vw, 36px);
          font-weight: 400;
          line-height: 1.2;
          color: var(--text);
          margin: 0 0 8px;
          letter-spacing: -0.01em;
          font-style: italic;
        }
        .lc-page-subtitle {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--text-dim);
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }

        .lc-content {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 40px 48px;
          scroll-behavior: smooth;
        }
        .lc-content::-webkit-scrollbar { width: 4px; }
        .lc-content::-webkit-scrollbar-thumb { background: #e8e3db; border-radius: 4px; }

        .lc-text, .lc-anim {
          animation: lcFadeUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) both;
        }
        @keyframes lcFadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lc-text {
          font-family: var(--font-body);
          font-size: 16px;
          line-height: 1.75;
          color: #4a4540;
          margin-bottom: 20px;
          font-weight: 400;
        }
        .lc-text:first-of-type {
          font-size: 18px;
          color: #1a1714;
          font-weight: 500;
          line-height: 1.6;
        }

        .lc-code-block {
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid #e8e3db;
          margin: 24px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .lc-code-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          background: #faf8f5;
          border-bottom: 1px solid #e8e3db;
        }
        .lc-code-dots { display: flex; gap: 5px; }
        .lc-code-dots span { width: 8px; height: 8px; border-radius: 50%; }
        .lc-code-label {
          font-family: var(--font-mono);
          font-size: 10px;
          color: #9a9088;
          letter-spacing: 0.05em;
          flex: 1;
          font-weight: 600;
        }
        .lc-copy-btn {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.1em;
          color: #1a1714;
          background: #ffffff;
          border: 1px solid #e8e3db;
          border-radius: 6px;
          cursor: pointer;
          padding: 3px 8px;
          transition: all 0.2s;
        }
        .lc-copy-btn:hover { background: #faf8f5; color: #d97706; }

        .lc-code-pre {
          background: #ffffff;
          margin: 0;
          padding: 24px;
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.7;
          color: #1a1714;
        }

        .lc-callout {
          border-radius: 16px;
          border: 1px solid;
          padding: 20px 24px;
          margin: 24px 0;
        }
        .lc-callout-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .lc-callout-icon { font-size: 18px; }
        .lc-callout-label {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 800;
        }
        .lc-callout-body {
          font-family: var(--font-body);
          font-size: 14.5px;
          line-height: 1.6;
          margin: 0;
          font-style: italic;
          opacity: 0.9;
        }

        .lc-footer {
          flex-shrink: 0;
          padding: 16px 32px;
          border-top: 1px solid var(--border);
          background: #faf8f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .lc-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 12px;
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--border);
          background: #ffffff;
          color: var(--text-dim);
          font-weight: 700;
        }
        .lc-nav-btn:hover:not(:disabled) {
          background: #faf8f5;
          color: #1a1714;
          transform: translateY(-1px);
        }
        .lc-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .lc-nav-btn.primary {
          background: #f5c842;
          border-color: #f5c842;
          color: #1a1714;
        }
        .lc-nav-btn.cta {
          background: #1a1714;
          border-color: transparent;
          color: #ffffff;
          padding: 10px 28px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .lc-nav-btn.cta:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }

        .lc-progress-bar { display: flex; align-items: center; gap: 6px; flex: 1; justify-content: center; }
        .lc-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e8e3db;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .lc-dot.visited { background: #9a9088; }
        .lc-dot.active {
          background: #f5c842;
          width: 18px;
          border-radius: 3px;
        }

        .lc-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; }
        .lc-summary-card {
          background: #ffffff;
          border: 1px solid #e8e3db;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
        }
        .lc-summary-card-num {
          font-family: var(--font-mono);
          font-size: 28px;
          font-weight: 800;
          color: #d97706;
          line-height: 1;
          margin-bottom: 4px;
        }
        .lc-summary-card-label { font-family: var(--font-body); font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.05em; }

        .lc-completion-banner {
          background: #16a34a08;
          border: 1px solid #16a34a20;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }
        .lc-completion-icon { font-size: 24px; color: #16a34a; }
        .lc-completion-text { font-family: var(--font-display); font-size: 17px; color: #1a1714; line-height: 1.4; font-style: italic; font-weight: 400; }

        .lc-kbd-hint {
          font-family: var(--font-mono);
          font-size: 8px;
          letter-spacing: 0.1em;
          color: #9a9088;
          text-align: center;
          padding: 10px 0 0;
          text-transform: uppercase;
        }
        kbd {
          background: #ffffff;
          border: 1px solid #e8e3db;
          border-radius: 4px;
          padding: 1px 5px;
          margin: 0 3px;
        }
      `}</style>

      <div className="lc-pamphlet relative">
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 rail-text opacity-20 pointer-events-none z-0">MODULE_CONTENT</div>
        <div className="lc-topbar relative z-10">
          <span className="lc-chapter-label">
            PYQUEST / <span>LEARNING MODULE</span>
          </span>
          <span className="lc-page-counter">
            PAGE <strong>{currentPage + 1}</strong> / {pages.length}
          </span>
        </div>

        <div className="lc-progress-strip">
          <div
            className="lc-progress-fill"
            style={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
          />
        </div>

        <div className="lc-page-header" data-icon={page.icon}>
          <div className="lc-page-tag">
            <span className="lc-page-tag-icon">{page.icon}</span>
            <span className="lc-page-tag-text">{page.subtitle ?? 'Foundations'}</span>
          </div>
          <h2 className="lc-page-title">{page.title}</h2>
          {page.subtitle && (
            <p className="lc-page-subtitle">{page.subtitle}</p>
          )}
        </div>

        <div className="lc-content" ref={contentRef} key={animKey}>
          {isLast ? (
            <div>
              <p className="lc-text">{summary}</p>

              <div className="lc-summary-grid">
                {[
                  { num: pages.length - 2, label: 'Key Concepts' },
                  { num: sections.filter(s => s.type === 'code-demo').length, label: 'Code Snippets' },
                  { num: sections.filter(s => s.type === 'callout').length, label: 'Expert Insights' },
                  { num: Math.ceil((sections.length * 150) / 60), label: 'Minutes of Focus' },
                ].map(({ num, label }) => (
                  <div key={label} className="lc-summary-card">
                    <div className="lc-summary-card-num">{num || '—'}</div>
                    <div className="lc-summary-card-label">{label}</div>
                  </div>
                ))}
              </div>

              {allRead && (
                <div className="lc-completion-banner">
                  <span className="lc-completion-icon">✓</span>
                  <div>
                    <div className="lc-completion-text">Module Complete. Concepts mastered.</div>
                    <p className="text-sm text-slate-500 mt-1">Ready to put your knowledge to the test? The challenge awaits.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            page.sections.map((s, i) => (
              <SectionRenderer key={s.id ?? i} section={s} accent={page.color} index={i} />
            ))
          )}
        </div>

        <div className="lc-footer">
          <button
            className="lc-nav-btn"
            onClick={prev}
            disabled={isFirst}
          >
            ← PREV
          </button>

          <ProgressBar
            total={pages.length}
            current={currentPage}
            onJump={goTo}
            visited={visited}
          />

          {isLast ? (
            <button
              className="lc-nav-btn cta"
              onClick={onReadyForChallenge}
            >
              CHALLENGE →
            </button>
          ) : (
            <button
              className="lc-nav-btn primary"
              onClick={next}
            >
              NEXT →
            </button>
          )}
        </div>
      </div>

      <p className="lc-kbd-hint">
        Navigate using <kbd>←</kbd> <kbd>→</kbd> arrow keys
      </p>
    </div>
  );
};

export default LessonContent;
