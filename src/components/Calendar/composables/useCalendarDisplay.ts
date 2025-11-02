import { computed, type ComputedRef } from "vue";
import type { UseCalendarDisplayReturn, ExtendedDisplayConfig } from "@/types";
import { dateAdapter } from "@/components/Calendar/utils/dateUtils";

export const useCalendarDisplay = (
  config: ExtendedDisplayConfig,
): UseCalendarDisplayReturn => {
  const monthYearLabel: ComputedRef<string> = computed(() => {
    return dateAdapter.getMonthName(
      config.currentMonth.value,
      config.currentYear.value,
      config.locale || "en-US",
    );
  });

  const weekdays: ComputedRef<string[]> = computed(() => {
    return dateAdapter.getWeekdays(
      config.firstDayOfWeek,
      config.locale || "en-US",
    );
  });

  return {
    weekdays,
    monthYearLabel,
  };
};
