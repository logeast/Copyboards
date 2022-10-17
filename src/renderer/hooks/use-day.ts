/**
 * Parse and displays dates and time.
 */

export function useDay(date: Date) {
  const now = new Date();
  const datetime = new Date(date || now);

  const today = now.toDateString() === datetime.toDateString();

  return {
    date: today ? "Today" : datetime.toDateString(),
    time: `${datetime.getHours()}:${datetime.getMinutes()}`,
  };
}
