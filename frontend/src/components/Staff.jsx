// Draws a melody on a treble staff as SVG, one row per line of music.
// Notes are letters C–G drawn from middle C (C4) up to G4; "R" is a rest.
// `beats` sets each note's look (eighth, quarter, dotted, half, whole) and
// spacing. Notes in `hits` are drawn green; the rest are black.

const STEPS = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };

const ROW_WIDTH = 1000;
const ROW_HEIGHT = 130;
const STAFF_TOP = 40;
const LINE_GAP = 12;
const BOTTOM_LINE = STAFF_TOP + 4 * LINE_GAP; // E4
const MIDDLE_LINE = STAFF_TOP + 2 * LINE_GAP; // B4
const CLEF_WIDTH = 70;
const TIME_SIG_WIDTH = 40;
const MEASURE_PAD = 18;

const BLACK = "#000000";
const GREEN = "#16a34a";

// Steps above middle C: C4 = 0, D4 = 1, ... Each step is half a line gap.
function noteY(letter) {
  return BOTTOM_LINE - (STEPS[letter] - 2) * (LINE_GAP / 2);
}

function noteWidth(beats) {
  return 30 + 26 * beats;
}

// Splits the song into 4-beat measures, then packs measures into rows.
function layoutRows(notes, beats) {
  const measures = [];
  let current = [];
  let filled = 0;
  notes.forEach((note, index) => {
    current.push(index);
    filled += beats[index];
    if (filled >= 4 - 1e-9) {
      measures.push(current);
      current = [];
      filled = 0;
    }
  });
  if (current.length) {
    measures.push(current);
  }

  const rows = [];
  let row = null;
  measures.forEach((measure) => {
    const width = MEASURE_PAD + measure.reduce((sum, i) => sum + noteWidth(beats[i]), 0);
    const start = rows.length === 0 ? CLEF_WIDTH + TIME_SIG_WIDTH : CLEF_WIDTH;
    if (!row || row.x + width > ROW_WIDTH - 10) {
      row = { x: start, notes: [], bars: [] };
      rows.push(row);
    }
    let x = row.x + MEASURE_PAD;
    measure.forEach((i) => {
      row.notes.push({ index: i, x: x + 10 });
      x += noteWidth(beats[i]);
    });
    row.x += width;
    row.bars.push(row.x);
  });
  return rows;
}

function Rest({ x, beats, color }) {
  if (beats >= 2) {
    // Half rest: a block sitting on the middle line.
    return <rect x={x - 8} y={MIDDLE_LINE - 6} width={16} height={6} fill={color} />;
  }
  // Quarter rest.
  return (
    <path
      d={`M ${x - 3} ${MIDDLE_LINE - 16} l 7 8 l -6 7 l 7 8 q -9 -3 -5 8`}
      fill="none"
      stroke={color}
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
  );
}

function Note({ x, letter, beats, color }) {
  const y = noteY(letter);
  const hollow = beats >= 2;
  const onLine = STEPS[letter] % 2 === 0;

  return (
    <g>
      {letter === "C" && (
        <line x1={x - 13} x2={x + 13} y1={y} y2={y} stroke={BLACK} strokeWidth={1.5} />
      )}
      <ellipse
        cx={x}
        cy={y}
        rx={7.5}
        ry={5.5}
        transform={`rotate(-20 ${x} ${y})`}
        fill={hollow ? "#ffffff" : color}
        stroke={color}
        strokeWidth={2}
      />
      {beats < 4 && (
        <line x1={x + 6.5} x2={x + 6.5} y1={y - 2} y2={y - 36} stroke={color} strokeWidth={1.7} />
      )}
      {beats === 0.5 && (
        <path
          d={`M ${x + 6.5} ${y - 36} q 2 10 10 14 q 4 5 0 13`}
          fill="none"
          stroke={color}
          strokeWidth={2}
        />
      )}
      {(beats === 1.5 || beats === 3) && (
        <circle cx={x + 15} cy={onLine ? y - LINE_GAP / 2 : y} r={2.2} fill={color} />
      )}
    </g>
  );
}

function Staff({ notes, beats, hits, current }) {
  const rows = layoutRows(notes, beats);

  return (
    <div className="staff">
      {rows.map((row, rowIndex) => {
        const last = rowIndex === rows.length - 1;
        const end = row.bars[row.bars.length - 1];
        return (
          <svg
            key={rowIndex}
            viewBox={`0 0 ${ROW_WIDTH} ${ROW_HEIGHT}`}
            className="staff-row"
            role="img"
            aria-label={`Line ${rowIndex + 1} of the music`}
          >
            {row.notes.some((n) => n.index === current) && (
              <rect
                x={row.notes.find((n) => n.index === current).x - 16}
                y={STAFF_TOP - 22}
                width={32}
                height={4 * LINE_GAP + 44}
                rx={8}
                fill="rgba(49, 94, 170, 0.12)"
              />
            )}

            {[0, 1, 2, 3, 4].map((line) => (
              <line
                key={line}
                x1={10}
                x2={end}
                y1={STAFF_TOP + line * LINE_GAP}
                y2={STAFF_TOP + line * LINE_GAP}
                stroke={BLACK}
                strokeWidth={1.2}
              />
            ))}

            <text
              x={12}
              y={BOTTOM_LINE + 13}
              fontSize={76}
              fontFamily="'Apple Symbols', 'Noto Music', 'Segoe UI Symbol', serif"
              fill={BLACK}
            >
              𝄞
            </text>

            {rowIndex === 0 &&
              [MIDDLE_LINE - 2, BOTTOM_LINE - 2].map((y) => (
                <text
                  key={y}
                  x={CLEF_WIDTH + 14}
                  y={y}
                  fontSize={27}
                  fontWeight={700}
                  fontFamily="Georgia, serif"
                  textAnchor="middle"
                  fill={BLACK}
                >
                  4
                </text>
              ))}

            {row.bars.map((x, i) => {
              const finalBar = last && i === row.bars.length - 1;
              return finalBar ? (
                <g key={x}>
                  <line x1={x - 7} x2={x - 7} y1={STAFF_TOP} y2={BOTTOM_LINE} stroke={BLACK} strokeWidth={1.5} />
                  <rect x={x - 4} y={STAFF_TOP} width={4} height={4 * LINE_GAP} fill={BLACK} />
                </g>
              ) : (
                <line key={x} x1={x} x2={x} y1={STAFF_TOP} y2={BOTTOM_LINE} stroke={BLACK} strokeWidth={1.5} />
              );
            })}

            {row.notes.map(({ index, x }) => {
              const color = hits[index] ? GREEN : BLACK;
              return notes[index] === "R" ? (
                <Rest key={index} x={x} beats={beats[index]} color={BLACK} />
              ) : (
                <Note key={index} x={x} letter={notes[index]} beats={beats[index]} color={color} />
              );
            })}
          </svg>
        );
      })}
    </div>
  );
}

export default Staff;
