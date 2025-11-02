<template>
  <div class="calendar-grid">
    <div class="weekdays-header">
      <div
        v-for="(weekday, index) in weekdays"
        :key="index"
        class="weekday-cell"
        :class="{ weekend: isWeekend(index) }"
      >
        {{ weekday }}
      </div>
    </div>

    <div v-for="(week, weekIndex) in days" :key="weekIndex" class="week-row">
      <CalendarDay
        v-for="day in week"
        :key="day.date.getTime()"
        :day="day"
        :initialDisplayDate="day.initialDisplayDate"
        @select="(selectedDay) => emit('day-select', selectedDay)"
        @hover="(hoveredDay) => emit('day-hover', hoveredDay)"
        @focus="(focusedDay) => emit('day-focus', focusedDay)"
      >
      </CalendarDay>
    </div>
  </div>
</template>

<script setup lang="ts">
import CalendarDay from "./CalendarDay.vue";
import type { CalendarDayType, LocalCalendarGridProps } from "@/types";

const props = withDefaults(
  defineProps<LocalCalendarGridProps>(),
  {
    weekendDays: () => [0, 6],
  },
);

const emit = defineEmits<{
  "day-select": [day: CalendarDayType];
  "day-hover": [day: CalendarDayType];
  "day-focus": [day: CalendarDayType];
}>();

const isWeekend = (dayIndex: number) => {
  return props.weekendDays.includes(dayIndex);
};
</script>

<style scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.weekdays-header {
  display: contents;
}

.weekday-cell {
  background-color: #f5f5f5;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
}

.weekday-cell.weekend {
  color: #d32f2f;
}

.week-row {
  display: contents;
}
.calendar-grid {
  gap: 0;
}

.weekday-cell {
  padding: 0.5rem 0.25rem;
  font-size: 0.8rem;
}
</style>
