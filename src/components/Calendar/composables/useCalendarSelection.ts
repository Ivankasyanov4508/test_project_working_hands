import { ref } from "vue";
import type { UseCalendarSelectionReturn } from "@/types/index";

export const useCalendarSelection = (): UseCalendarSelectionReturn => {
  const selectedDate = ref<Date | null>(null);

  const isSelected = (date: Date): boolean => {
    if (!selectedDate.value) return false;
    return (
      new Date(date).setHours(0, 0, 0, 0) ===
      new Date(selectedDate.value).setHours(0, 0, 0, 0)
    );
  };

  const selectDate = (date: Date | null) => {
    selectedDate.value = date;
  };

  return {
    selectedDate,
    isSelected,
    selectDate,
  };
};
