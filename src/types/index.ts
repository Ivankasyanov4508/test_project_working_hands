import type { Ref, ComputedRef } from "vue";

export interface DateAdapter {
  getWeekdays(firstDayOfWeek?: number, locale?: string): string[];
  getMonthName(month: number, year: number, locale?: string): string;
}
export interface CalendarDayBase {
  date: Date;
  isCurrentMonth: boolean;
  isSelected?: boolean;
  isToday?: boolean;
  initialDisplayDate?: Date | null;
}

export type CalendarDayType = CalendarDayBase;

export interface CalendarConfig {
  firstDayOfWeek?: number;
  weekends?: number[];
  dateFormat?: string;
  locale?: string;
  initialDate?: string;
}

export type CalendarEmits = {
  (e: "select", date: Date): void;
  (e: "month-change", month: number, year: number): void;
  (e: "day-click", day: CalendarDayType): void;
};

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface CalendarNavigationReturn {
  currentMonth: Ref<number>;
  currentYear: Ref<number>;
  navigateMonth: (direction: -1 | 1) => void;
}

export interface CalendarDaysReturn {
  daysInMonth: Ref<CalendarDayType[]>;
  getDaysGrid: () => CalendarDayType[][];
}

export interface CalendarSelectionReturn {
  selectedDate: Ref<Date | null>;
  isSelected: (date: Date) => boolean;
  selectDate: (date: Date | null) => void;
}

export interface CalendarDisplayReturn {
  weekdays: ComputedRef<string[]>;
  monthYearLabel: ComputedRef<string>;
}

export interface UseCalendarReturn
  extends CalendarNavigationReturn,
    CalendarDaysReturn,
    CalendarSelectionReturn,
    CalendarDisplayReturn {
  initialDisplayDate: Ref<Date | null>;
}

export interface CalendarProps {
  initialDate?: string;
  firstDayOfWeek?: number;
  weekends?: number[];
  dateFormat?: string;
  locale?: string;
}

export type CalendarNavigationOnlyReturn = Pick<
  CalendarNavigationReturn,
  "currentMonth" | "currentYear"
>;

export type CalendarDaysOnlyReturn = Pick<
  CalendarDaysReturn,
  "daysInMonth" | "getDaysGrid"
>;

export type CalendarSelectionOnlyReturn = Pick<
  CalendarSelectionReturn,
  "selectedDate" | "isSelected" | "selectDate"
>;

export type CalendarDisplayOnlyReturn = Pick<
  CalendarDisplayReturn,
  "weekdays" | "monthYearLabel"
>;

export interface CalendarHeaderProps {}

export type CalendarHeaderEmits = {
  (e: "prev-month"): void;
  (e: "next-month"): void;
  (e: "month-change", month: number): void;
};

export interface CalendarGridProps {
  days: CalendarDayType[][];
  weekdays: string[];
  weekendDays?: number[];
}

export interface CalendarDayProps {
  day: CalendarDayType;
  initialDisplayDate?: Date | null;
}

export type CalendarDayEmits = {
  (e: "select", day: CalendarDayType): void;
  (e: "hover", day: CalendarDayType): void;
  (e: "focus", day: CalendarDayType): void;
};

export type DaysConfig = {
  currentMonth: Ref<number>;
  currentYear: Ref<number>;
  weekends?: number[];
  firstDayOfWeek?: number;
};

export type UseCalendarDaysReturn = CalendarDaysReturn;

export type DisplayConfig = {
  currentMonth: Ref<number>;
  currentYear: Ref<number>;
  firstDayOfWeek?: number;
};

export type UseCalendarDisplayReturn = CalendarDisplayReturn;

export type ExtendedDisplayConfig = DisplayConfig & {
  currentMonth: any;
  currentYear: any;
  locale?: string;
};

export interface CalendarDayGenerationConfig {
  currentMonth: number;
  currentYear: number;
  weekends?: number[];
  firstDayOfWeek?: number;
  selectedDate?: Date | null;
}

export interface LocalCalendarGridProps {
  days: CalendarDayType[][];
  weekdays: string[];
  weekendDays?: number[];
}

export type UseCalendarNavigationReturn = CalendarNavigationReturn;

export interface NavigationConfig {
  initialDate?: string;
}

export interface SelectionConfig {
  initialDate?: string;
}

export type UseCalendarSelectionReturn = CalendarSelectionReturn;
