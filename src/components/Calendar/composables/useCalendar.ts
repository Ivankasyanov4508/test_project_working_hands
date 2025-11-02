import { readonly, ref } from "vue";
import { useCalendarNavigation } from "./useCalendarNavigation";
import { useCalendarDays } from "./useCalendarDays";
import { useCalendarSelection } from "./useCalendarSelection";
import { useCalendarDisplay } from "./useCalendarDisplay";
import type { CalendarConfig, UseCalendarReturn } from "@/types/index";

export const useCalendar = (
  initialConfig?: CalendarConfig,
): UseCalendarReturn => {
  const config = ref<CalendarConfig>({
    firstDayOfWeek: 0,
    weekends: [0, 6],
    dateFormat: "YYYY-MM-DD",
    locale: "en-US",
    initialDate: undefined,
  });

  if (initialConfig) {
    const { ...configWithoutModelValue } = initialConfig;
    config.value = { ...config.value, ...configWithoutModelValue };
  }

  const initialDisplayDate = ref<Date | null>(null);

  if (config.value.initialDate) {
    const [year, month, day] = config.value.initialDate.split("-").map(Number);
    initialDisplayDate.value = new Date(year, month - 1, day);
  }

  const { currentMonth, currentYear, navigateMonth } = useCalendarNavigation({
    initialDate: initialDisplayDate.value || undefined,
  });

  const { selectedDate, isSelected, selectDate } = useCalendarSelection();

  const { daysInMonth, getDaysGrid } = useCalendarDays(
    {
      currentMonth,
      currentYear,
      weekends: config.value.weekends,
      firstDayOfWeek: config.value.firstDayOfWeek,
    },
    selectedDate,
    initialDisplayDate,
  );

  const { weekdays, monthYearLabel } = useCalendarDisplay({
    currentMonth,
    currentYear,
    firstDayOfWeek: config.value.firstDayOfWeek,
    locale: config.value.locale,
  });

  return {
    currentMonth: readonly(currentMonth),
    currentYear: readonly(currentYear),
    navigateMonth,
    daysInMonth,
    getDaysGrid,
    selectedDate,
    isSelected: (date: Date) => isSelected(date),
    selectDate,
    weekdays,
    monthYearLabel,
    initialDisplayDate,
  };
};
