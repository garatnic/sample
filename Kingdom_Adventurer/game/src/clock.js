const startTime = Date.UTC(4037, 8, 17, 8);
const realSecondsPerGameHour = 75;
const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

export function gameMinutes(elapsedSeconds) {
  return Math.floor(elapsedSeconds * 60 / realSecondsPerGameHour);
}

export function gameDay(minute) {
  return Math.floor((startTime + minute * 60_000) / 86_400_000);
}

export function gameDateTime(minute) {
  const date = new Date(startTime + minute * 60_000);
  const weekday = weekdays[date.getUTCDay()];
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return {
    date: `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日（${weekday}）`,
    time: `${hours}:${minutes}`,
  };
}
