import type { DateAdapter } from "@/types/index";

export abstract class BaseDateAdapter implements DateAdapter {
  abstract getWeekdays(firstDayOfWeek?: number, locale?: string): string[];
  abstract getMonthName(month: number, year: number, locale?: string): string;
}

export class DefaultDateAdapter extends BaseDateAdapter {
  getWeekdays(firstDayOfWeek: number = 0, locale: string = "en-US"): string[] {
    const weekdays = [];
    const date = new Date();
    const day = date.getDay();
    const diff = (day - firstDayOfWeek + 7) % 7;
    date.setDate(date.getDate() - diff);

    for (let i = 0; i < 7; i++) {
      const weekdayDate = new Date(date);
      weekdayDate.setDate(date.getDate() + i);
      weekdays.push(
        weekdayDate.toLocaleDateString(locale, { weekday: "short" }),
      );
    }

    return weekdays;
  }

  getMonthName(month: number, year: number, locale: string = "en-US"): string {
    const date = new Date(year, month, 1);
    return date.toLocaleDateString(locale, { month: "long", year: "numeric" });
  }
}

export const dateAdapter = new DefaultDateAdapter();
