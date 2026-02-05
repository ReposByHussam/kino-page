import { loadAllScreenings } from './apiScreenings.js';

const UPCOMING_LIMITS = Object.freeze({
  MAX_DAYS: 5,
  MAX_SCREENINGS: 10,
});

function mapApiScreening(screening) {
  if (!screening?.attributes?.start_time) return null;

  return {
    id: screening.id,
    startTime: new Date(screening.attributes.start_time),
    room: screening.attributes.room,
  };
}

function isUpcoming(screening, now) {
  const stockholmNow = getStockholmDateKey(now);
  const stockholmScreeningDate = getStockholmDateKey(screening.startTime);

  return stockholmScreeningDate > stockholmNow;
}

function sortByStartTimeAsc(a, b) {
  return a.startTime - b.startTime;
}

function getStockholmDateKey(date) {
  const parts = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Stockholm',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const y = parts.find(p => p.type === 'year').value;
  const m = parts.find(p => p.type === 'month').value;
  const d = parts.find(p => p.type === 'day').value;

  return `${y}-${m}-${d}`;
}


function groupScreeningsByDay(screenings, { now, maxDays = UPCOMING_LIMITS.MAX_DAYS, maxScreenings = UPCOMING_LIMITS.MAX_SCREENINGS }) {
  const daysMap = new Map();
  let totalCount = 0;

  for (const screening of screenings) {
    if (!isUpcoming(screening, now)) continue;

    if (totalCount >= maxScreenings) break;

    const dayKey = getStockholmDateKey(screening.startTime);

    if (!daysMap.has(dayKey)) {
      if (daysMap.size >= maxDays) break;
      daysMap.set(dayKey, []);
    }

    daysMap.get(dayKey).push(screening);
    totalCount++;
  }
  
  return Array.from(daysMap.entries()).map(([date, screenings]) => ({
    date,
    screenings,
  }));
}


export async function getScreenings(
  { now = new Date(), loadScreenings = loadAllScreenings } = {}
) {
  const externalScreenings = await loadScreenings();

  if (!externalScreenings || !externalScreenings.length) return [];

  const screenings = externalScreenings
    .map(mapApiScreening)
    .filter(Boolean)
    .sort(sortByStartTimeAsc);

  return groupScreeningsByDay(screenings, { now, ...UPCOMING_LIMITS });
}
