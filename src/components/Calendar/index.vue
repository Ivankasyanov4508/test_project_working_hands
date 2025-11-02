<template>
  <div class="calendar">
    <CalendarHeader
      v-bind="{ monthYearLabel, locale }"
      @prev-month="onNavigatePrevMonth"
      @next-month="onNavigateNextMonth"
    />
    <CalendarGrid
      :days="updatedDaysGrid"
      :weekdays="weekdays"
      :weekendDays="props.weekends"
      @day-select="onDaySelect"
    />
  </div>
</template>

<script setup lang="ts">
import { provide, computed } from "vue";
import CalendarHeader from "./CalendarHeader.vue";
import CalendarGrid from "./CalendarGrid.vue";
import { useCalendar } from "./composables/useCalendar";
import type {
  CalendarProps,
  CalendarEmits,
  CalendarDayType,
} from "@/types/index";

const props = withDefaults(defineProps<CalendarProps>(), {
  firstDayOfWeek: 1,
  disabledDates: () => [],
  weekends: () => [0, 6],
  dateFormat: "YYYY-MM-DD",
  locale: "en-US",
  initialDate: undefined,
});

const emit = defineEmits<CalendarEmits>();

provide<(dayOfWeek: number) => boolean>(
  "checkIsWeekend",
  (dayOfWeek: number) => {
    return props.weekends.includes(dayOfWeek);
  },
);

const {
  monthYearLabel,
  weekdays,
  navigateMonth,
  getDaysGrid,
  selectDate,
  isSelected,
  initialDisplayDate,
} = useCalendar({
  firstDayOfWeek: props.firstDayOfWeek,
  weekends: props.weekends,
  dateFormat: props.dateFormat,
  locale: props.locale,
  initialDate: props.initialDate,
});

const onNavigatePrevMonth = () => {
  navigateMonth(-1);
};

const onNavigateNextMonth = () => {
  navigateMonth(1);
};

const onDaySelect = (day: CalendarDayType) => {
  selectDate(day.date);
  emit("select", day.date);
  emit("day-click", day);
};

const updatedDaysGrid = computed(() => {
  const grid = getDaysGrid();
  return grid.map((week) =>
    week.map((day) => ({
      ...day,
      isSelected: isSelected(day.date),
      initialDisplayDate: initialDisplayDate.value,
    })),
  );
});
</script>

<style scoped>
.calendar {
  width: 100%;
  max-width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  background-color: white;
}
</style>
