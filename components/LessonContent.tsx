
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
    { title: 'Introduction',    subtitle: 'Why this matters',          icon: '◎', color: '#6366f1' },
    { title: 'Core Concept',    subtitle: 'The big idea',              icon: '◈', color: '#8b5cf6' },
    { title: 'How It Works',    subtitle: 'Under the hood',            icon: '⬡', color: '#06b6d4' },
    { title: 'In Practice',     subtitle: 'Real examples',             icon: '◆', color: '#10b981' },
    { title: 'Edge Cases',      subtitle: 'Watch out for these',       icon: '⚠️', color: '#f59e0b' },
    { title: 'Patterns',        subtitle: 'Best practices',            icon: '◉', color: '#f43f5e' },
    { title: 'Deep Dive',       subtitle: 'Going further',             icon: '◑', color: '#a78bfa' },
    { title: 'Putting It Together', subtitle: 'The full picture',      icon: '⬟', color: '#34d399' },
    { title: 'Summary',         subtitle: 'What you learned today',    icon: '✦', color: '#6366f1' },
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
          --bg: #04050d;
          --surface: rgba(10,12,26,0.85);
          --border: rgba(255,255,255,0.06);
          --text: #d1d5db;
          --text-dim: rgba(148,163,184,0.55);
          --font-display: 'Fraunces', Georgia, serif;
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
          box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 32px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(40px);
        }

        .lc-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 32px;
          border-bottom: 1px solid var(--border);
          background: rgba(4,5,13,0.7);
          flex-shrink: 0;
        }
        .lc-chapter-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.25em;
          color: var(--text-dim);
          text-transform: uppercase;
          font-weight: 700;
        }
        .lc-chapter-label span {
          color: var(--accent);
        }
        .lc-page-counter {
          font-family: var(--font-mono);
          font-size: 10px;
          color: var(--text-dim);
          letter-spacing: 0.1em;
        }
        .lc-page-counter strong { color: var(--accent); }

        .lc-progress-strip {
          height: 3px;
          background: rgba(255,255,255,0.04);
          flex-shrink: 0;
          position: relative;
        }
        .lc-progress-fill {
          height: 100%;
          transition: width 0.7s cubic-bezier(0.19, 1, 0.22, 1);
          background: linear-gradient(90deg, var(--accent), #fff);
          box-shadow: 0 0 15px var(--accent);
        }

        .lc-page-header {
          padding: 48px 48px 32px;
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
          color: var(--accent);
          opacity: 0.04;
          line-height: 1;
          pointer-events: none;
          font-family: var(--font-mono);
        }
        .lc-page-tag {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: color-mix(in srgb, var(--accent) 15%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
          border-radius: 100px;
          padding: 6px 16px 6px 12px;
          margin-bottom: 20px;
        }
        .lc-page-tag-icon { font-size: 14px; color: var(--accent); }
        .lc-page-tag-text {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--accent);
          font-weight: 800;
        }
        .lc-page-title {
          font-family: var(--font-display);
          font-size: clamp(32px, 4vw, 44px);
          font-weight: 800;
          line-height: 1.1;
          color: #fff;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
          font-style: italic;
        }
        .lc-page-subtitle {
          font-family: var(--font-body);
          font-size: 14px;
          font-weight: 500;
          color: var(--text-dim);
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .lc-content {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 48px;
          scroll-behavior: smooth;
        }
        .lc-content::-webkit-scrollbar { width: 4px; }
        .lc-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

        .lc-text, .lc-anim {
          animation: lcFadeUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) both;
        }
        @keyframes lcFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lc-text {
          font-family: var(--font-body);
          font-size: 17px;
          line-height: 1.85;
          color: #94a3b8;
          margin-bottom: 24px;
          font-weight: 400;
        }
        .lc-text:first-of-type {
          font-size: 20px;
          color: #e2e8f0;
          font-weight: 300;
          line-height: 1.6;
        }

        .lc-code-block {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          margin: 32px 0;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .lc-code-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: #0b0e14;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .lc-code-dots { display: flex; gap: 6px; }
        .lc-code-dots span { width: 10px; height: 10px; border-radius: 50%; }
        .lc-code-label {
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(148,163,184,0.6);
          letter-spacing: 0.1em;
          flex: 1;
          font-weight: 600;
        }
        .lc-copy-btn {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.15em;
          color: #fff;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          cursor: pointer;
          padding: 4px 10px;
          transition: all 0.2s;
        }
        .lc-copy-btn:hover { background: rgba(255,255,255,0.1); color: var(--accent); }

        .lc-code-pre {
          background: #010208;
          margin: 0;
          padding: 28px;
          overflow-x: auto;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1.8;
          color: #a5b4fc;
        }

        .lc-callout {
          border-radius: 20px;
          border: 1px solid;
          padding: 24px 28px;
          margin: 28px 0;
        }
        .lc-callout-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .lc-callout-icon { font-size: 20px; }
        .lc-callout-label {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 800;
        }
        .lc-callout-body {
          font-family: var(--font-body);
          font-size: 15.5px;
          line-height: 1.7;
          margin: 0;
          font-style: italic;
          opacity: 0.9;
        }

        .lc-footer {
          flex-shrink: 0;
          padding: 20px 32px;
          border-top: 1px solid var(--border);
          background: rgba(4,5,13,0.6);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .lc-nav-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          border-radius: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.03);
          color: var(--text-dim);
          font-weight: 700;
        }
        .lc-nav-btn:hover:not(:disabled) {
          background: rgba(255,255,255,0.06);
          color: #fff;
          transform: translateY(-1px);
        }
        .lc-nav-btn:disabled { opacity: 0.2; cursor: not-allowed; }
        .lc-nav-btn.primary {
          background: color-mix(in srgb, var(--accent) 15%, transparent);
          border-color: color-mix(in srgb, var(--accent) 40%, transparent);
          color: var(--accent);
        }
        .lc-nav-btn.cta {
          background: #fff;
          border-color: transparent;
          color: #000;
          padding: 12px 32px;
          box-shadow: 0 10px 30px rgba(255,255,255,0.15);
        }
        .lc-nav-btn.cta:hover { transform: translateY(-2px) scale(1.05); box-shadow: 0 15px 40px rgba(255,255,255,0.2); }

        .lc-progress-bar { display: flex; align-items: center; gap: 8px; flex: 1; justify-content: center; }
        .lc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          border: none;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .lc-dot.visited { background: color-mix(in srgb, var(--accent) 40%, transparent); }
        .lc-dot.active {
          background: var(--accent);
          width: 24px;
          border-radius: 4px;
          box-shadow: 0 0 20px var(--accent);
        }

        .lc-summary-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 32px 0; }
        .lc-summary-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
        }
        .lc-summary-card-num {
          font-family: var(--font-mono);
          font-size: 32px;
          font-weight: 800;
          color: var(--accent);
          line-height: 1;
          margin-bottom: 8px;
        }
        .lc-summary-card-label { font-family: var(--font-body); font-size: 13px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; }

        .lc-completion-banner {
          background: color-mix(in srgb, #10b981 10%, transparent);
          border: 1px solid color-mix(in srgb, #10b981 30%, transparent);
          border-radius: 20px;
          padding: 28px;
          display: flex;
          align-items: center;
          gap: 20px;
          margin-top: 32px;
        }
        .lc-completion-icon { font-size: 32px; color: #10b981; }
        .lc-completion-text { font-family: var(--font-display); font-size: 18px; color: #fff; line-height: 1.4; font-style: italic; font-weight: 700; }

        .lc-kbd-hint {
          font-family: var(--font-mono);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: var(--text-dim);
          text-align: center;
          padding: 12px 0 0;
          text-transform: uppercase;
        }
        kbd {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 2px 6px;
          margin: 0 4px;
        }
      `}</style>

      <div className="lc-pamphlet">
        <div className="lc-topbar">
          <span className="lc-chapter-label">
            PYQUEST / <span>NEURAL BENCHMARK</span>
          </span>
          <span className="lc-page-counter">
            MODULE <strong>{currentPage + 1}</strong> / {pages.length}
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
                    <div className="lc-completion-text">Uplink Complete. Architectural patterns synthesized.</div>
                    <p className="text-sm text-slate-500 mt-1">Ready to initialize the logical kernel? The challenge awaits.</p>
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
