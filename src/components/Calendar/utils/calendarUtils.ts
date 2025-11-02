import type {
  CalendarDayType,
  CalendarDayGenerationConfig,
} from "@/types/index";

export const getCalendarBoundary = (
  year: number,
  month: number,
  firstDayOfWeek: number = 0,
  isEnd: boolean = false,
): Date => {
  let date: Date;
  let offset: number;

  if (isEnd) {
    date = new Date(year, month + 1, 0);
    offset = (7 - ((date.getDay() - firstDayOfWeek + 7) % 7)) % 7;
    date.setDate(date.getDate() + offset);
  } else {
    date = new Date(year, month, 1);
    offset = (date.getDay() - firstDayOfWeek + 7) % 7;
    date.setDate(date.getDate() - offset);
  }

  return date;
};

export const generateCalendarDays = (
  config: CalendarDayGenerationConfig,
): CalendarDayType[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDay = getCalendarBoundary(
    config.currentYear,
    config.currentMonth,
    config.firstDayOfWeek || 0,
    false,
  );
  const endDay = getCalendarBoundary(
    config.currentYear,
    config.currentMonth,
    config.firstDayOfWeek || 0,
    true,
  );

  const current = new Date(startDay);
  const days: CalendarDayType[] = [];

  while (current <= endDay) {
    const dateCopy = new Date(current);
    const isCurrentMonth = current.getMonth() === config.currentMonth;

    const isToday =
      dateCopy.getDate() === today.getDate() &&
      dateCopy.getMonth() === today.getMonth() &&
      dateCopy.getFullYear() === today.getFullYear();

    days.push({
      date: dateCopy,
      isCurrentMonth,
      isToday,
    });

    current.setDate(current.getDate() + 1);
  }

  return days;
};

export const createCalendarGrid = (
  days: CalendarDayType[],
): CalendarDayType[][] => {
  const grid: CalendarDayType[][] = [];

  for (let i = 0; i < days.length; i += 7) {
    grid.push(days.slice(i, i + 7));
  }
  return grid;
};
