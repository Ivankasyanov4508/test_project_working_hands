<template>
  <div class="calendar-header">
    <button @click="onPrevMonth" class="nav-button prev"><</button>

    <slot name="header-content" :monthYearLabel="monthYearLabel">
      <div class="month-year-container">
        <span class="month-year-display">
          {{ monthYearLabel }}
        </span>
      </div>
    </slot>

    <button @click="onNextMonth" class="nav-button next">></button>
  </div>
</template>

<script setup lang="ts">
import type { CalendarHeaderProps, CalendarHeaderEmits } from "@/types/index";

withDefaults(
  defineProps<
    CalendarHeaderProps & {
      monthYearLabel: string;
      locale?: string;
    }
  >(),
  {
    locale: "en-US",
  },
);
const emit = defineEmits<CalendarHeaderEmits>();

const onPrevMonth = () => {
  emit("prev-month");
};

const onNextMonth = () => {
  emit("next-month");
};
</script>

<style scoped>
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  font-weight: bold;
}

.calendar-header.dark {
  background-color: #333;
  color: white;
  border-bottom: 1px solid #555;
}

.calendar-header.dark .nav-button {
  background: #444;
  color: white;
  border: 1px solid #666;
}

.calendar-header.dark .nav-button:hover:not(:disabled) {
  background-color: #555;
}

.nav-button {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.nav-button:hover:not(:disabled) {
  background-color: #e9ecef;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.month-year-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.month-select,
.year-select {
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.month-year-display,
.year-display {
  padding: 0.25rem 0.5rem;
  font-size: 1.1rem;
  color: #0056b3;
}
</style>
