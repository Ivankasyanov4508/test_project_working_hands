# Компонент Calendar.vue - Документация реализации

## Назначение
Главный компонент Calendar.vue выступает в роли оркестратора для всего компонента календаря. Он управляет состоянием (текущий месяц, год, выбранная дата), координирует взаимодействие дочерних компонентов, эмитит события наружу и принимает входные параметры.

## Структура компонента

### Свойства (Props)
```typescript
interface CalendarProps {
  modelValue?: Date | null;      // Выбранная дата (для v-model)
  minDate?: Date | null;         // Минимальная разрешенная дата
  maxDate?: Date | null;         // Максимальная разрешенная дата
  locale?: string;               // Локаль
  firstDayOfWeek?: number;       // Первый день недели
  disabledDates?: Date[];        // Отключенные даты
  weekends?: number[];           // Выходные дни
  dateFormat?: string;           // Формат даты
  showMonthDropdown?: boolean;   // Показывать ли дропдаун выбора месяца
  showYearDropdown?: boolean;    // Показывать ли дропдаун выбора года
}
```

### События (Emits)
```typescript
type CalendarEmits = {
  'update:modelValue': [date: Date | null];  // Для v-model
  select: [date: Date];                      // При выборе даты
  'month-change': [month: number, year: number]; // При изменении месяца
  'day-click': [day: CalendarDay];           // При клике на день
}
```

## Реализация

### Template
```vue
<template>
  <div class="calendar-container">
    <!-- Слот для кастомизации заголовка -->
    <slot 
      name="header"
      :month="monthName"
      :year="currentYear"
      :canNavigatePrev="canNavigatePrev"
      :canNavigateNext="canNavigateNext"
    >
      <CalendarHeader
        :month="currentMonth"
        :year="currentYear"
        :monthName="monthName"
        :canNavigatePrev="canNavigatePrev"
        :canNavigateNext="canNavigateNext"
        @prev-month="navigateMonth(-1)"
        @next-month="navigateMonth(1)"
      />
    </slot>
    
    <!-- Слот для кастомизации сетки -->
    <slot 
      name="grid"
      :days="daysGrid"
      :weekdays="weekdays"
      :selectedDate="selectedDate"
    >
      <CalendarGrid
        :days="daysGrid"
        :weekdays="weekdays"
        :selectedDate="selectedDate"
        @day-select="handleDaySelect"
      >
        <!-- Слот для кастомизации отдельного дня -->
        <template #day="slotProps">
          <slot name="day" v-bind="slotProps" />
        </template>
      </CalendarGrid>
    </slot>
  </div>
</template>
```

### Script
```vue
<script setup lang="ts">
import { computed, provide } from 'vue';
import CalendarHeader from './CalendarHeader.vue';
import CalendarGrid from './CalendarGrid.vue';
import { useCalendar } from './composables/useCalendar';
import { CalendarProps, CalendarEmits } from './types';

// Определяем пропсы с значениями по умолчанию
const props = withDefaults(defineProps<CalendarProps>(), {
  locale: 'en-US',
  firstDayOfWeek: 0,
  showMonthDropdown: false,
  showYearDropdown: false,
  dateFormat: 'YYYY-MM-DD'
});

// Определяем эмиты
const emit = defineEmits<CalendarEmits>();

// Инициализируем composable с конфигурацией
const {
  currentMonth,
  currentYear,
  selectedDate,
  daysInMonth,
  monthName,
  weekdays,
  canNavigatePrev,
  canNavigateNext,
  navigateMonth,
  selectDate,
  getDaysGrid
} = useCalendar({
  minDate: props.minDate,
  maxDate: props.maxDate,
  locale: props.locale,
  firstDayOfWeek: props.firstDayOfWeek,
  disabledDates: props.disabledDates,
  weekends: props.weekends,
  dateFormat: props.dateFormat
});

// Вычисляем сетку дней
const daysGrid = computed(() => getDaysGrid());

// Устанавливаем начальное значение selectedDate из modelValue
if (props.modelValue) {
  selectedDate.value = props.modelValue;
}

// Методы
const handleDaySelect = (day: CalendarDay) => {
  selectDate(day.date);
  emit('update:modelValue', day.date);
  emit('select', day.date);
 emit('day-click', day);
};

// Обработка изменения месяца для эмита события
const navigateMonthWrapper = (direction: -1 | 1) => {
  const prevMonth = currentMonth.value;
  const prevYear = currentYear.value;
  
  navigateMonth(direction);
  
  // Эмитим событие изменения месяца, если месяц или год изменились
 if (prevMonth !== currentMonth.value || prevYear !== currentYear.value) {
    emit('month-change', currentMonth.value, currentYear.value);
  }
};

// Provide конфигурации для дочерних компонентов
provide('calendarConfig', {
  locale: props.locale,
  firstDayOfWeek: props.firstDayOfWeek,
  minDate: props.minDate,
  maxDate: props.maxDate
});
</script>
```

### Стили
```vue
<style scoped>
.calendar-container {
  width: 100%;
  max-width: 100%;
  background-color: white;
 border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: Arial, sans-serif;
}

/* Адаптивный дизайн */
@media (max-width: 768px) {
  .calendar-container {
    max-width: 100%;
    font-size: 14px;
  }
}
</style>
```

## Опциональные функции

### Поддержка слотов
Компонент поддерживает несколько слотов для кастомизации:

```vue
<template>
  <div class="calendar-container">
    <!-- Слот для полной замены шапки -->
    <slot 
      name="header"
      :month="monthName"
      :year="currentYear"
      :canNavigatePrev="canNavigatePrev"
      :canNavigateNext="canNavigateNext"
      :navigatePrev="() => navigateMonth(-1)"
      :navigateNext="() => navigateMonth(1)"
    >
      <CalendarHeader
        :month="currentMonth"
        :year="currentYear"
        :monthName="monthName"
        :canNavigatePrev="canNavigatePrev"
        :canNavigateNext="canNavigateNext"
        @prev-month="navigateMonth(-1)"
        @next-month="navigateMonth(1)"
      />
    </slot>
    
    <!-- Слот для кастомизации сетки -->
    <slot 
      name="grid"
      :days="daysGrid"
      :weekdays="weekdays"
      :selectedDate="selectedDate"
    >
      <CalendarGrid
        :days="daysGrid"
        :weekdays="weekdays"
        :selectedDate="selectedDate"
        @day-select="handleDaySelect"
      >
        <!-- Слот для кастомизации отдельного дня -->
        <template #day="slotProps">
          <slot name="day" v-bind="slotProps" />
        </template>
      </CalendarGrid>
    </slot>
    
    <!-- Слот для футера -->
    <slot 
      name="footer"
      :selectedDate="selectedDate"
      :currentMonth="currentMonth"
      :currentYear="currentYear"
    />
  </div>
</template>
```

### Поддержка тем
Компонент может поддерживать светлую и темную темы:

```vue
<template>
  <div class="calendar-container" :class="{ 'dark-theme': isDarkTheme }">
    <!-- Содержимое компонента -->
  </div>
</template>

<script setup lang="ts">
// ...
const isDarkTheme = computed(() => props.theme === 'dark');
</script>

<style scoped>
.calendar-container {
  /* Светлая тема по умолчанию */
  background-color: white;
  border: 1px solid #ddd;
  color: #333;
}

.calendar-container.dark-theme {
  background-color: #333;
  border: 1px solid #555;
  color: #f5f5f5;
}
</style>
```

### Provide/Inject для настроек
Компонент предоставляет настройки для глубокой передачи в дочерние компоненты:

```typescript
// В Calendar.vue
provide('calendarConfig', computed(() => ({
 locale: props.locale,
  firstDayOfWeek: props.firstDayOfWeek,
  minDate: props.minDate,
  maxDate: props.maxDate,
  dateFormat: props.dateFormat
})));

// В дочернем компоненте
const config = inject('calendarConfig');
```

## Использование компонента
```vue
<template>
  <!-- Простое использование с v-model -->
  <Calendar v-model="selectedDate" />
  
  <!-- С ограничениями дат -->
  <Calendar 
    v-model="selectedDate"
    :min-date="minDate"
    :max-date="maxDate"
    locale="ru-RU"
    @select="onDateSelect"
    @month-change="onMonthChange"
  />
  
  <!-- С кастомизацией через слоты -->
  <Calendar 
    v-model="selectedDate"
    :locale="locale"
  >
    <template #header="{ month, year, canNavigatePrev, canNavigateNext }">
      <div class="custom-header">
        <button @click="navigatePrev" :disabled="!canNavigatePrev">←</button>
        <h3>{{ month }} {{ year }}</h3>
        <button @click="navigateNext" :disabled="!canNavigateNext">→</button>
      </div>
    </template>
    
    <template #day="{ day, isSelected, isToday }">
      <div class="custom-day" :class="{ selected: isSelected, today: isToday }">
        {{ day.date.getDate() }}
        <span v-if="hasEvent(day)" class="event-marker">•</span>
      </div>
    </template>
  </Calendar>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Calendar from './components/Calendar.vue';

const selectedDate = ref(new Date());
const minDate = ref(new Date(2023, 0, 1));
const maxDate = ref(new Date(2025, 11, 31));
const locale = ref('en-US');

const onDateSelect = (date: Date) => {
 console.log('Selected date:', date);
};

const onMonthChange = (month: number, year: number) => {
  console.log('Month changed to:', month, year);
};

const hasEvent = (day: CalendarDay) => {
 // Логика проверки наличия событий в этот день
  return false;
};
</script>
```

## Особенности реализации
1. Компонент использует composable useCalendar для управления состоянием
2. Реализует паттерн v-model для двусторонней привязки
3. Обеспечивает координацию между всеми дочерними компонентами
4. Поддерживает передачу конфигурации через provide/inject
5. Использует слоты для расширяемости
6. Эмитит события для взаимодействия с родительским компонентом
7. Поддерживает кастомизацию внешнего вида
8. Следует принципу единственной ответственности - оркестрация, а не отображение