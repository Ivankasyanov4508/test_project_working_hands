<template>
  <div
    :class="dayClasses"
    :tabindex="0"
    @click="onSelect"
    @mouseenter="onHover"
    @focus="onFocus"
    @keydown.enter="onSelect"
    @keydown.space="onSelect"
  >
    <span class="day-number">{{ day.date.getDate() }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import type { CalendarDayProps, CalendarDayEmits } from "@/types/index";

const props = withDefaults(defineProps<CalendarDayProps>(), {
  initialDisplayDate: null,
});

const emit = defineEmits<CalendarDayEmits>();

const checkIsWeekend = inject<(dayOfWeek: number) => boolean>(
  "checkIsWeekend",
  (dayOfWeek: number) => {
    return dayOfWeek === 0 || dayOfWeek === 6;
  },
);

const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isInitialDisplayDate = (date: Date): boolean => {
  if (!props.initialDisplayDate) return false;
  return (
    date.getDate() === props.initialDisplayDate.getDate() &&
    date.getMonth() === props.initialDisplayDate.getMonth() &&
    date.getFullYear() === props.initialDisplayDate.getFullYear()
  );
};

const dayClasses = computed(() => ({
  "calendar-day": true,
  "current-month": props.day.isCurrentMonth,
  "other-month": !props.day.isCurrentMonth,
  selected: props.day.isSelected,
  weekend: checkIsWeekend(props.day.date.getDay()),
  today:
    isInitialDisplayDate(props.day.date) ||
    (!props.initialDisplayDate && isToday(props.day.date)),
}));

const onSelect = () => {
  emit("select", props.day);
};

const onHover = () => {
  emit("hover", props.day);
};

const onFocus = () => {
  emit("focus", props.day);
};
</script>

<style scoped>
.calendar-day {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  min-width: 40px;
  padding: 0.25rem;
  border: 1px solid #e0e0e0;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  text-align: center;
}

.calendar-day:hover:not(.disabled) {
  background-color: #e9ecef;
}

.calendar-day:focus {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

.calendar-day.current-month {
  color: #333;
}

.calendar-day.other-month {
  color: #999;
  background-color: #f8f9fa;
}

.calendar-day.today {
  background-color: #e3f2fd;
  border-color: #2196f3;
  font-weight: bold;
}

.calendar-day.selected {
  background-color: #007bff;
  color: white;
  border-color: #0056b3;
}

.calendar-day.selected .day-number {
  background-color: #007bff;
  color: white;
}

.calendar-day.today:not(.selected) .day-number {
  border: 1px solid #2196f3;
  background-color: #f0f8ff;
  color: #1976d2;
}

.calendar-day.disabled {
  color: #ccc;
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.calendar-day.weekend:not(.disabled) {
  color: #d32f2f;
}

.day-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

.selected .day-number {
  background-color: #007bff;
  color: white;
}

.today:not(.selected) .day-number {
  border: 1px solid #2196f3;
  background-color: #f0f8ff;
  color: #1976d2;
}
</style>
