export const SESSION_SIZE = 10;

export const REVIEW_UNLOCKS = {
  violin: {
    3: ["G3", "D4", "A4", "E5"],
  },
  trumpet: {
    1: ["C", "D", "E", "F", "G"],
  },
};

export const REVIEW_UNLOCK_HINTS = {
  violin: {
    title: "Open Strings",
    link: "/lesson/violin/open-strings",
  },
  trumpet: {
    title: "Getting Started",
    link: "/lesson/trumpet/getting-started",
  },
};

export function unlockedNotes(instrument, completedLessons = []) {
  const unlocks = REVIEW_UNLOCKS[instrument];
  if (!unlocks) {
    return [];
  }

  const completed = new Set(
    (completedLessons || []).map((number) => Number(number))
  );
  const notes = [];
  const seen = new Set();

  for (const [lessonNumber, lessonNotes] of Object.entries(unlocks)) {
    if (!completed.has(Number(lessonNumber))) {
      continue;
    }

    for (const note of lessonNotes) {
      if (!seen.has(note)) {
        seen.add(note);
        notes.push(note);
      }
    }
  }

  return notes;
}

export function isNoteDue(card, now = Date.now()) {
  if (!card || typeof card.dueAt !== "number") {
    return true;
  }

  return card.dueAt <= now;
}

export function countDueNotes(unlocked, srsMap = {}, now = Date.now()) {
  return unlocked.filter((note) => isNoteDue(srsMap[note], now)).length;
}

export function buildReviewQueue(
  unlocked,
  srsMap = {},
  now = Date.now(),
  cap = SESSION_SIZE
) {
  const due = [];
  const fresh = [];

  for (const note of unlocked) {
    const card = srsMap[note];
    if (!card) {
      fresh.push(note);
    } else if (isNoteDue(card, now)) {
      due.push(note);
    }
  }

  return [...due, ...fresh].slice(0, cap);
}

export function buildWeakQueue(unlocked, srsMap = {}, cap = SESSION_SIZE) {
  return [...unlocked]
    .sort((a, b) => {
      const easeA = srsMap[a]?.ease ?? 2.5;
      const easeB = srsMap[b]?.ease ?? 2.5;
      return easeA - easeB;
    })
    .slice(0, cap);
}
