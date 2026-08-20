import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  angleAt,
  angleCenter,
  bandWidth,
  indexForAngle,
  yearSpans,
  toArcAngle,
} from "./weeklyData";

/** Warm ramp: quiet sand at low prices, rust at the peaks. */
const COLOR_RAMP = ["#c9bca6", "#d9a06a", "#e0703f", "#b33a21"];

const fmtPrice = d3.format("$,.0f");
const fmtAxis = (v) => (v >= 1000 ? `$${d3.format(",.0f")(v / 1000)}k` : `$${v}`);
const fmtWeek = d3.utcFormat("%b %-d, %Y");

/**
 * Weekly BTC close as bars radiating from a centre point.
 *
 * Hover is resolved from the pointer's *angle*, not per-bar mouseover: at
 * ~260 weeks each bar is only a few pixels of arc, which is far too small to
 * hit reliably. One transparent overlay catches the pointer and the readout
 * lands in the middle of the ring, where there's room for it.
 */
const RadialBarChart = ({ width, height, weeks = [] }) => {
  const svgRef = useRef();
  const [hover, setHover] = useState(null);

  const cx = width / 2;
  const cy = height / 2;
  // Leaves room outside the rim for boundary ticks and the year labels.
  const outerR = Math.max(40, Math.min(width, height) / 2 - 40);
  const innerR = Math.max(26, outerR * 0.38);

  useEffect(() => {
    if (!weeks.length || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const maxClose = d3.max(weeks, (d) => d.close);

    // scaleRadial maps value to radius by area, so a bar twice the value
    // covers twice the ink instead of looking exaggerated at the rim.
    const r = d3.scaleRadial().domain([0, maxClose]).range([innerR, outerR]);
    const color = d3
      .scaleSequential()
      .domain([0, maxClose])
      .interpolator(d3.interpolateRgbBasis(COLOR_RAMP));

    const arc = d3
      .arc()
      .innerRadius(innerR)
      .outerRadius((d) => r(d.close))
      .startAngle((_, i) => toArcAngle(angleAt(i, weeks.length)))
      .endAngle((_, i) =>
        toArcAngle(angleAt(i, weeks.length) + bandWidth(weeks.length))
      )
      .padAngle(0)
      .cornerRadius(0.6);

    const root = svg.select(".ring").attr("transform", `translate(${cx},${cy})`);
    const spans = yearSpans(weeks);
    const n = weeks.length;

    // --- alternating year bands (bottom layer) ---
    // A faint wash behind every other year, so the eye can pick out where one
    // year ends without having to read a label.
    const band = d3
      .arc()
      .innerRadius(innerR)
      .outerRadius(outerR + 6)
      .startAngle((d) => toArcAngle(angleAt(d.start, n)))
      .endAngle((d) => toArcAngle(angleAt(d.end, n)));

    root
      .select(".year-bands")
      .selectAll("path")
      .data(spans.filter((_, i) => i % 2 === 1))
      .join("path")
      .attr("d", band)
      .attr("fill", "#171412")
      .attr("opacity", 0.045);

    // --- price rings (drawn under the bars) ---
    const ticks = r.ticks(3).filter((t) => t > 0);
    root
      .select(".grid")
      .selectAll("circle")
      .data(ticks)
      .join("circle")
      .attr("r", r)
      .attr("fill", "none")
      .attr("stroke", "#e0d9ce")
      .attr("stroke-dasharray", "2 4");

    // Price labels sit in the top gap, above their ring. Painted last-ish with
    // a paper-coloured halo so they stay legible over bars and year bands.
    root
      .select(".grid-labels")
      .selectAll("text")
      .data(ticks)
      .join("text")
      .attr("y", (d) => -r(d))
      .attr("dy", "-0.5em")
      .attr("text-anchor", "middle")
      .attr("font-family", "IBM Plex Mono, monospace")
      .attr("font-size", 11)
      .attr("font-weight", 500)
      .attr("letter-spacing", "0.04em")
      .attr("fill", "#4a443d")
      .attr("stroke", "#fdfcfa")
      .attr("stroke-width", 3.5)
      .attr("stroke-linejoin", "round")
      .attr("paint-order", "stroke")
      .text(fmtAxis);

    // --- bars ---
    root
      .select(".bars")
      .selectAll("path")
      .data(weeks)
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.close))
      // The final week is still in progress, so outline rather than fill it.
      .attr("stroke", (d) => (d.partial ? "#171412" : "none"))
      .attr("stroke-width", (d) => (d.partial ? 0.9 : 0));

    // --- year boundary ticks ---
    // One line per Jan 1 transition, running from the inner radius out past
    // the rim to meet its label. The first span starts at the ring's own gap,
    // so it needs no divider.
    root
      .select(".year-ticks")
      .selectAll("line")
      .data(spans.slice(1))
      .join("line")
      .attr("x1", (d) => Math.cos(angleAt(d.start, n)) * innerR)
      .attr("y1", (d) => Math.sin(angleAt(d.start, n)) * innerR)
      .attr("x2", (d) => Math.cos(angleAt(d.start, n)) * (outerR + 12))
      .attr("y2", (d) => Math.sin(angleAt(d.start, n)) * (outerR + 12))
      .attr("stroke", "#171412")
      .attr("stroke-opacity", 0.24)
      .attr("stroke-width", 1);

    // --- year labels, centred on each band rather than sat on its edge ---
    const labelR = outerR + 24;
    root
      .select(".years")
      .selectAll("text")
      .data(spans)
      .join("text")
      .attr("x", (d) => Math.cos(angleCenter((d.start + d.end - 1) / 2, n)) * labelR)
      .attr("y", (d) => Math.sin(angleCenter((d.start + d.end - 1) / 2, n)) * labelR)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-family", "IBM Plex Mono, monospace")
      .attr("font-size", 11)
      .attr("font-weight", 500)
      .attr("letter-spacing", "0.1em")
      .attr("fill", "#4a443d")
      // Hide a stub year that has too few weeks to label legibly.
      .attr("opacity", (d) => (d.end - d.start >= 4 ? 1 : 0))
      .text((d) => d.year);
  }, [weeks, cx, cy, innerR, outerR]);

  // --- highlight the hovered bar ---
  useEffect(() => {
    if (!svgRef.current || !weeks.length) return;
    const root = d3.select(svgRef.current).select(".ring");
    const maxClose = d3.max(weeks, (d) => d.close);
    const r = d3.scaleRadial().domain([0, maxClose]).range([innerR, outerR]);

    root
      .select(".bars")
      .selectAll("path")
      .attr("opacity", (_, i) => (hover == null || i === hover ? 1 : 0.32));

    const guide = root.select(".guide");
    if (hover == null) {
      guide.attr("display", "none");
    } else {
      const a = angleCenter(hover, weeks.length);
      const tip = r(weeks[hover].close);
      guide
        .attr("display", null)
        .attr("x1", Math.cos(a) * innerR)
        .attr("y1", Math.sin(a) * innerR)
        .attr("x2", Math.cos(a) * (tip + 8))
        .attr("y2", Math.sin(a) * (tip + 8));
    }
  }, [hover, weeks, innerR, outerR]);

  const handleMove = (event) => {
    if (!weeks.length) return;
    const [mx, my] = d3.pointer(event);
    const dx = mx - cx;
    const dy = my - cy;
    const dist = Math.hypot(dx, dy);
    // Ignore the dead zone inside the ring and anything past the rim.
    if (dist < innerR - 4 || dist > outerR + 18) {
      setHover(null);
      return;
    }
    setHover(indexForAngle(Math.atan2(dy, dx), weeks.length));
  };

  const active = hover == null ? null : weeks[hover];
  const latest = weeks.length ? weeks[weeks.length - 1] : null;
  const shown = active || latest;

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      onMouseMove={handleMove}
      onMouseLeave={() => setHover(null)}
      role="img"
      aria-label={`Bitcoin weekly closing price, ${weeks.length} weeks`}
    >
      {/* Layer order matters: bands wash behind everything, ticks and labels
          sit above the bars so they stay readable. */}
      <g className="ring">
        <g className="year-bands" />
        <g className="grid" />
        <g className="bars" />
        <line
          className="guide"
          stroke="#171412"
          strokeWidth="1"
          strokeDasharray="2 2"
          display="none"
        />
        <g className="year-ticks" />
        <g className="grid-labels" />
        <g className="years" />

        {/* Centre readout — the hovered week, or the latest week at rest. */}
        <text
          textAnchor="middle"
          y={-8}
          fontFamily="var(--font-serif)"
          fontSize={innerR > 46 ? 26 : 20}
          fill="var(--ink)"
        >
          {shown ? fmtPrice(shown.close) : ""}
        </text>
        <text
          textAnchor="middle"
          y={12}
          fontFamily="var(--font-mono)"
          fontSize={9.5}
          letterSpacing="0.1em"
          fill="var(--muted-2)"
        >
          {!shown
            ? ""
            : active
            ? `${fmtWeek(active.week).toUpperCase()}${
                active.partial ? " · IN PROGRESS" : ""
              }`
            : "THIS WEEK"}
        </text>
      </g>
    </svg>
  );
};

export default RadialBarChart;
