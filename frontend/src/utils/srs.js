const MIN_EASE = 1.3;
const DEFAULT_EASE = 2.5;
const DAY_MS = 24 * 60 * 60 * 1000;

export function newCard(now = Date.now()) {
  return {
    intervalDays: 0,
    ease: DEFAULT_EASE,
    reps: 0,
    dueAt: now,
  };
}

export function gradeGood(card, now = Date.now()) {
  const ease = card?.ease ?? DEFAULT_EASE;
  const reps = (card?.reps ?? 0) + 1;
  let intervalDays;

  if (reps === 1) {
    intervalDays = 1;
  } else if (reps === 2) {
    intervalDays = 3;
  } else {
    intervalDays = Math.max(1, Math.round((card.intervalDays || 1) * ease));
  }

  return {
    intervalDays,
    ease,
    reps,
    dueAt: now + intervalDays * DAY_MS,
  };
}

export function gradeAgain(card, now = Date.now()) {
  const ease = Math.max(MIN_EASE, (card?.ease ?? DEFAULT_EASE) - 0.2);

  return {
    intervalDays: 1,
    ease,
    reps: 0,
    dueAt: now + DAY_MS,
  };
}
