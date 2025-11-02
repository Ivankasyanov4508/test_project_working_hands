
import { dateAdapter } from "./dateUtils";

export { dateAdapter };

export const getWeekdays = (firstDayOfWeek: number = 0): string[] => {
  return dateAdapter.getWeekdays(firstDayOfWeek);
};

export const getMonthName = (month: number, year: number): string => {
  return dateAdapter.getMonthName(month, year);
};
