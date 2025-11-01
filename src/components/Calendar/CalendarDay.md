# Компонент CalendarDay.vue - Документация реализации

## Назначение
Компонент CalendarDay.vue отвечает за отображение отдельной ячейки дня в календаре. Компонент отвечает за отображение визуальных состояний (выбран, сегодня, другой месяц, отключен) и обработку кликов с эмитом событий.

## Структура компонента

### Свойства (Props)
```typescript
interface CalendarDayProps {
  day: CalendarDay;              // Объект дня: { date: Date, isCurrentMonth: boolean, isToday: boolean, isSelected: boolean, isDisabled: boolean }
}
```

### События (Emits)
```typescript
type CalendarDayEmits = {
  'select': [day: CalendarDay];  // При клике на день
  'hover': [day: CalendarDay];   // При наведении на день
  'focus': [day: CalendarDay];   // При фокусе на день
}
```

## Реализация

### Template
```vue
<template>
  <div
    :class="dayClasses"
    :aria-label="formatDate(day.date)"
    :aria-selected="day.isSelected"
    :aria-disabled="day.isDisabled"
    :tabindex="day.isDisabled ? -1 : 0"
    @click="onSelect"
    @mouseenter="onHover"
    @focus="onFocus"
    @keydown.enter="onSelect"
    @keydown.space="onSelect"
  >
    <!-- Слот по умолчанию для кастомизации содержимого дня -->
    <slot :day="day" :isSelected="day.isSelected" :isToday="day.isToday">
      <!-- По умолчанию отображаем номер дня -->
      <span class="day-number">{{ day.date.getDate() }}</span>
    </slot>
  </div>
</template>
```

### Script
```vue
<script setup lang="ts">
import { computed } from 'vue';
import { CalendarDay as CalendarDayType, CalendarDayProps } from './types';

// Определяем пропсы
const props = defineProps<CalendarDayProps>();

// Определяем эмиты
const emit = defineEmits<CalendarDayEmits>();

// Вычисляемые свойства для классов
const dayClasses = computed(() => ({
  'calendar-day': true,
  'current-month': props.day.isCurrentMonth,
  'other-month': !props.day.isCurrentMonth,
  'today': props.day.isToday,
  'selected': props.day.isSelected,
  'disabled': props.day.isDisabled,
  'weekend': isWeekend(props.day.date.getDay())
}));

// Методы
const onSelect = () => {
  if (!props.day.isDisabled) {
    emit('select', props.day);
  }
};

const onHover = () => {
  emit('hover', props.day);
};

const onFocus = () => {
  emit('focus', props.day);
};

// Вспомогательные функции
const isWeekend = (dayOfWeek: number) => {
  // В большинстве локалей выходные - это воскресенье (0) и суббота (6)
  return dayOfWeek === 0 || dayOfWeek === 6;
};

const formatDate = (date: Date) => {
  // Форматируем дату для aria-label
  return date.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
 });
};
</script>
```

### Стили
```vue
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
}
</style>
```

## Опциональные функции

### Поддержка слотов
Компонент поддерживает слоты для кастомизации отображения дня:

```vue
<template>
  <div
    :class="dayClasses"
    :aria-label="formatDate(day.date)"
    :aria-selected="day.isSelected"
    :aria-disabled="day.isDisabled"
    :tabindex="day.isDisabled ? -1 : 0"
    @click="onSelect"
    @mouseenter="onHover"
    @focus="onFocus"
    @keydown.enter="onSelect"
    @keydown.space="onSelect"
  >
    <!-- Слот для кастомизации всего содержимого дня -->
    <slot 
      :day="day" 
      :isSelected="day.isSelected" 
      :isToday="day.isToday"
      :isCurrentMonth="day.isCurrentMonth"
      :isDisabled="day.isDisabled"
    >
      <!-- Слот для заголовка дня -->
      <slot name="day-header">
        <!-- Содержимое по умолчанию для заголовка -->
      </slot>
      
      <!-- Основное содержимое дня -->
      <div class="day-content">
        <span class="day-number">{{ day.date.getDate() }}</span>
        
        <!-- Слот для дополнительного контента в дне -->
        <slot name="day-content" :day="day">
          <!-- Дополнительный контент по умолчанию -->
        </slot>
      </div>
      
      <!-- Слот для футера дня -->
      <slot name="day-footer">
        <!-- Содержимое по умолчанию для футера -->
      </slot>
    </slot>
 </div>
</template>
```

### Поддержка тем
Компонент может поддерживать светлую и темную темы:

```vue
<style scoped>
.calendar-day {
  /* ... общие стили ... */
}

.calendar-day.dark {
  background-color: #333;
  border-color: #555;
  color: #f5f5f5;
}

.calendar-day.dark:hover:not(.disabled) {
  background-color: #444;
}

.calendar-day.dark.today {
  background-color: #1a237e;
  border-color: #3949ab;
}

.calendar-day.dark.selected {
  background-color: #0d47a1;
  border-color: #1565c0;
}

.calendar-day.dark.other-month {
  color: #aaa;
  background-color: #22;
}

.calendar-day.dark.disabled {
  color: #666;
  background-color: #222;
}
</style>
```

### Поддержка событий
Компонент может поддерживать дополнительные события:

```typescript
type CalendarDayEmits = {
  'select': [day: CalendarDay];        // При клике на день
  'hover': [day: CalendarDay];         // При наведении на день
  'focus': [day: CalendarDay];         // При фокусе на день
  'keydown': [day: CalendarDay, event: KeyboardEvent]; // При нажатии клавиши
 'contextmenu': [day: CalendarDay, event: MouseEvent]; // При правом клике
}
```

## Использование в родительском компоненте
```vue
<template>
  <CalendarDay
    :day="calendarDay"
    @select="handleDaySelect"
    @hover="handleDayHover"
  >
    <!-- Кастомизация отображения дня -->
    <template #default="{ day, isSelected, isToday }">
      <div class="custom-day" :class="{ selected: isSelected, today: isToday }">
        <span class="day-number">{{ day.date.getDate() }}</span>
        <!-- Можно добавить дополнительные элементы -->
        <div v-if="hasEvents(day)" class="event-indicator"></div>
      </div>
    </template>
  </CalendarDay>
</template>
```

## Особенности реализации
1. Компонент получает все необходимые данные через props
2. Отображает визуальные состояния (выбран, сегодня, другой месяц, отключен)
3. Обрабатывает клики и эмитит события
4. Поддерживает клавиатурную навигацию
5. Имеет доступные элементы интерфейса (aria-атрибуты)
6. Стилизован с использованием scoped CSS
7. Поддерживает кастомизацию через слоты
8. Адаптивный дизайн
9. Поддержка тем (светлая/темная)