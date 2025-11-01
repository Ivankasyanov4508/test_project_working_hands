# Компонент CalendarGrid.vue - Документация реализации

## Назначение
Компонент CalendarGrid.vue отвечает за отображение сетки календаря, включая заголовки дней недели и дни месяца. Компонент отвечает за правильное позиционирование дней в сетке, включая дни из предыдущего и следующего месяца для заполнения недель, а также передачу событий клика от CalendarDay вверх по иерархии.

## Структура компонента

### Свойства (Props)
```typescript
interface CalendarGridProps {
  days: CalendarDay[][];         // Двумерный массив дней (недели с днями)
  weekdays: string[];            // Названия дней недели
  selectedDate: Date | null;     // Выбранная дата
  locale?: string;               // Локаль для локализации (по умолчанию 'en-US')
}
```

### События (Emits)
```typescript
type CalendarGridEmits = {
  'day-select': [day: CalendarDay]; // При клике на день
  'day-hover': [day: CalendarDay];  // При наведении на день
}
```

## Реализация

### Template
```vue
<template>
  <div class="calendar-grid">
    <!-- Заголовки дней недели -->
    <div class="weekdays-header">
      <div 
        v-for="(weekday, index) in weekdays" 
        :key="index"
        class="weekday-cell"
        :class="{ 'weekend': isWeekend(index) }"
      >
        {{ weekday }}
      </div>
    
    <!-- Сетка дней -->
    <div 
      v-for="(week, weekIndex) in days" 
      :key="weekIndex"
      class="week-row"
    >
      <CalendarDay
        v-for="(day, dayIndex) in week"
        :key="day.date.getTime()"
        :day="day"
        @select="onDaySelect"
        @hover="onDayHover"
      >
        <!-- Передаем слот для кастомизации дня -->
        <template #default="slotProps">
          <slot 
            name="day" 
            :day="slotProps.day" 
            :isSelected="slotProps.isSelected"
            :isToday="slotProps.isToday"
          />
        </template>
      </CalendarDay>
    </div>
  </div>
</template>
```

### Script
```vue
<script setup lang="ts">
import { computed } from 'vue';
import CalendarDay from './CalendarDay.vue';
import { CalendarDay as CalendarDayType, CalendarGridProps } from './types';

// Определяем пропсы
const props = withDefaults(defineProps<CalendarGridProps>(), {
  locale: 'en-US'
});

// Определяем эмиты
const emit = defineEmits<CalendarGridEmits>();

// Вычисляемые свойства
// Определяем, является ли день выходным (для стилизации)
const isWeekend = (dayIndex: number) => {
  // В большинстве локалей выходные - это воскресенье (0) и суббота (6)
  // Но может быть настроено иначе через config
  return dayIndex === 0 || dayIndex === 6;
};

// Методы
const onDaySelect = (day: CalendarDayType) => {
  emit('day-select', day);
};

const onDayHover = (day: CalendarDayType) => {
  emit('day-hover', day);
};
</script>
```

### Стили
```vue
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
  color: #d32f2f; /* Красный цвет для выходных */
}

.week-row {
  display: contents;
}

/* Стили для мобильных устройств */
@media (max-width: 768px) {
  .calendar-grid {
    gap: 0;
  }
  
  .weekday-cell {
    padding: 0.5rem 0.25rem;
    font-size: 0.8rem;
  }
}
</style>
```

## Опциональные функции

### Поддержка слотов
Компонент поддерживает слоты для кастомизации отображения дней:

```vue
<template>
  <div class="calendar-grid">
    <!-- Заголовки дней недели -->
    <div class="weekdays-header">
      <div 
        v-for="(weekday, index) in weekdays" 
        :key="index"
        class="weekday-cell"
        :class="{ 'weekend': isWeekend(index) }"
      >
        {{ weekday }}
      </div>
    </div>
    
    <!-- Сетка дней -->
    <div 
      v-for="(week, weekIndex) in days" 
      :key="weekIndex"
      class="week-row"
    >
      <CalendarDay
        v-for="(day, dayIndex) in week"
        :key="day.date.getTime()"
        :day="day"
        @select="onDaySelect"
      >
        <!-- Слот по умолчанию для кастомизации дня -->
        <template #default="slotProps">
          <slot 
            name="day" 
            v-bind="slotProps"
          />
        </template>
        
        <!-- Слот для заголовка дня -->
        <template #day-header>
          <slot name="day-header" />
        </template>
        
        <!-- Слот для содержимого дня -->
        <template #day-content="slotProps">
          <slot 
            name="day-content" 
            v-bind="slotProps"
          >
            {{ slotProps.day.date.getDate() }}
          </slot>
        </template>
      </CalendarDay>
    </div>
  </div>
</template>
```

### Поддержка тем
Компонент может поддерживать светлую и темную темы:

```vue
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

.calendar-grid.dark {
  background-color: #444;
  border: 1px solid #666;
}

.weekday-cell {
  background-color: #f5f5f5;
  padding: 0.75rem 0.5rem;
  text-align: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
}

.weekday-cell.dark {
  background-color: #333;
  color: #f5f5f5;
}

.week-row {
  display: contents;
}
</style>
```

### Поддержка событий
Компонент может поддерживать дополнительные события:

```typescript
type CalendarGridEmits = {
  'day-select': [day: CalendarDay]; // При клике на день
  'day-hover': [day: CalendarDay];  // При наведении на день
  'day-focus': [day: CalendarDay];  // При фокусе на день
  'day-keydown': [day: CalendarDay, event: KeyboardEvent]; // При нажатии клавиши на дне
  'week-start': [week: CalendarDay[]]; // При начале новой недели
}
```

## Использование в родительском компоненте
```vue
<template>
  <CalendarGrid
    :days="daysGrid"
    :weekdays="weekdays"
    :selectedDate="selectedDate"
    @day-select="handleDaySelect"
    @day-hover="handleDayHover"
  >
    <!-- Кастомизация отображения дня -->
    <template #day="{ day, isSelected, isToday }">
      <div class="custom-day" :class="{ selected: isSelected, today: isToday }">
        {{ day.date.getDate() }}
      </div>
    </template>
  </CalendarGrid>
</template>
```

## Особенности реализации
1. Компонент получает все необходимые данные через props
2. Использует компонент CalendarDay для отображения отдельных дней
3. Правильно отображает дни из предыдущего и следующего месяцев
4. Поддерживает кастомизацию через слоты
5. Имеет доступные элементы интерфейса
6. Стилизован с использованием scoped CSS
7. Адаптивный дизайн для мобильных устройств
8. Поддерживает темы (светлая/темная)