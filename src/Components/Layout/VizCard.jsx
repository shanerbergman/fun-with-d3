import React, { useEffect, useState } from "react";

/**
 * The one card shape used across the whole gallery.
 *
 *   ┌───────────────────────────────────────────┐
 *   │ TOY 01                          [ tag ]   │  head
 *   │ Bouncing Balls                            │
 *   ├───────────────────────────────────────────┤
 *   │                 viz                       │  body
 *   ├───────────────────────────────────────────┤
 *   │ [ Pause ]   Balls ───●──── 12             │  foot (from the viz)
 *   └───────────────────────────────────────────┘
 *
 * `wide` switches to the full-bleed chart treatment: larger title, paler
 * plot background, and a space-between footer strip.
 */
const VizCard = ({ eyebrow, title, tag, stats, wide, children }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <article className={`viz-card${wide ? " viz-card--wide" : ""}`}>
      <div className="viz-card__head">
        <div className="viz-card__ident">
          <span className="eyebrow">{eyebrow}</span>
          <h3 className="viz-card__title">{title}</h3>
        </div>
        <div className="viz-card__meta">
          {stats?.map((stat) => (
            <div className="viz-card__stat" key={stat.label}>
              <span className="eyebrow">{stat.label}</span>
              <span className="viz-card__stat-value">{stat.value}</span>
            </div>
          ))}
          {tag && <span className="tag">{tag}</span>}
        </div>
      </div>

      {loading ? (
        <div className="viz-card__body">
          <div className="viz-card__skeleton">
            <span />
            <span />
            <span />
          </div>
        </div>
      ) : (
        children
      )}
    </article>
  );
};

export default VizCard;
