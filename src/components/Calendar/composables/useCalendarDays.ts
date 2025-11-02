import { ref, watch, type Ref } from "vue";
import type {
  CalendarDayType,
  UseCalendarDaysReturn,
  DaysConfig,
} from "@/types/index";
import {
  generateCalendarDays,
  createCalendarGrid,
} from "../utils/calendarUtils";

export const useCalendarDays = (
  config: DaysConfig,
  selectedDateRef?: { value: Date | null },
  initialDisplayDateRef?: Ref<Date | null>,
): UseCalendarDaysReturn => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth: Ref<CalendarDayType[]> = ref([]);

  const updateDaysInMonth = () => {
    daysInMonth.value = generateCalendarDays({
      currentMonth: config.currentMonth.value,
      currentYear: config.currentYear.value,
      weekends: config.weekends,
      firstDayOfWeek: config.firstDayOfWeek,
      selectedDate: selectedDateRef?.value || null,
    }).map((day) => ({
      ...day,
      initialDisplayDate: initialDisplayDateRef?.value || null,
    }));
  };

  watch([config.currentMonth, config.currentYear], updateDaysInMonth, {
    immediate: true,
  });

  const getDaysGrid = (): CalendarDayType[][] => {
    return createCalendarGrid(daysInMonth.value);
  };

  return {
    daysInMonth,
    getDaysGrid,
  };
};
