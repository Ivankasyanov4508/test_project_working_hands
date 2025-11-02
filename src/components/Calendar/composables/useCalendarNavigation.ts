import { ref } from "vue";
import type { UseCalendarNavigationReturn } from "@/types/index";

interface NavigationConfig {
  initialDate?: Date | null;
}

export const useCalendarNavigation = (
  config?: NavigationConfig,
): UseCalendarNavigationReturn => {
  const initialDate = config?.initialDate || new Date();

  const currentMonth = ref<number>(initialDate.getMonth());
  const currentYear = ref<number>(initialDate.getFullYear());

  const navigateMonth = (direction: -1 | 1) => {
    const newMonth = currentMonth.value + direction;

    if (newMonth < 0) {
      currentMonth.value = 11;
      currentYear.value--;
    } else if (newMonth > 11) {
      currentMonth.value = 0;
      currentYear.value++;
    } else {
      currentMonth.value = newMonth;
    }
  };
  return {
    currentMonth,
    currentYear,
    navigateMonth,
  };
};
