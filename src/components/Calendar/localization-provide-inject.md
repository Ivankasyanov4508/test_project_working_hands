# Локализация и настройки через Provide/Inject

## Назначение
Реализация передачи конфигурации (локализация, форматирование) через provide/inject позволяет избежать prop drilling и обеспечивает гибкую настройку компонентов на разных уровнях вложенности.

## Структура конфигурации

### CalendarConfig
```typescript
interface CalendarConfig {
  locale: string;                // Локаль для локализации (по умолчанию 'en-US')
  firstDayOfWeek: number;        // Первый день недели (0-воскресенье, 1-понедельник)
  dateFormat: string;            // Формат даты
  weekdaysShort: string[];       // Сокращенные названия дней недели
  weekdaysLong: string[];        // Полные названия дней недели
  monthsShort: string[];         // Сокращенные названия месяцев
  monthsLong: string[];          // Полные названия месяцев
 todayLabel: string;            // Текст для обозначения "сегодня"
  clearLabel: string;            // Текст для кнопки "очистить"
  weekNumberLabel: string;       // Текст для обозначения номера недели
}
```

## Реализация в главном компоненте

### Provide конфигурации
```vue
<script setup lang="ts">
import { computed, provide } from 'vue';
import { useCalendar } from './composables/useCalendar';

// Определяем пропсы
const props = defineProps<CalendarProps>();

// Создаем computed для конфигурации
const config = computed(() => ({
  locale: props.locale || 'en-US',
  firstDayOfWeek: props.firstDayOfWeek || 0,
  dateFormat: props.dateFormat || 'YYYY-MM-DD',
  // Генерируем названия дней и месяцев на основе локали
  weekdaysShort: getWeekdaysShort(props.locale || 'en-US', props.firstDayOfWeek || 0),
  weekdaysLong: getWeekdaysLong(props.locale || 'en-US', props.firstDayOfWeek || 0),
  monthsShort: getMonthsShort(props.locale || 'en-US'),
  monthsLong: getMonthsLong(props.locale || 'en-US'),
  todayLabel: props.todayLabel || 'Today',
  clearLabel: props.clearLabel || 'Clear',
 weekNumberLabel: props.weekNumberLabel || 'Week'
}));

// Provide конфигурации для дочерних компонентов
provide('calendarConfig', config);

// Вспомогательные функции для генерации локализованных строк
function getWeekdaysShort(locale: string, firstDayOfWeek: number): string[] {
  const weekdays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(2023, 0, 2 + i); // 2 - понедельник, 3 - вторник, и т.д.
    weekdays.push(date.toLocaleDateString(locale, { weekday: 'short' }));
  }
  
  // Переставляем массив, чтобы первый день недели был первым
  return [...weekdays.slice(firstDayOfWeek), ...weekdays.slice(0, firstDayOfWeek)];
}

function getWeekdaysLong(locale: string, firstDayOfWeek: number): string[] {
 const weekdays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(2023, 0, 2 + i);
    weekdays.push(date.toLocaleDateString(locale, { weekday: 'long' }));
  }
  
  return [...weekdays.slice(firstDayOfWeek), ...weekdays.slice(0, firstDayOfWeek)];
}

function getMonthsShort(locale: string): string[] {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2023, i, 1);
    months.push(date.toLocaleDateString(locale, { month: 'short' }));
  }
  return months;
}

function getMonthsLong(locale: string): string[] {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2023, i, 1);
    months.push(date.toLocaleDateString(locale, { month: 'long' }));
  }
  return months;
}
</script>
```

## Использование в дочерних компонентах

### CalendarHeader.vue
```vue
<script setup lang="ts">
import { inject, computed } from 'vue';

// Инжектим конфигурацию
const config = inject('calendarConfig');

// Используем локализованные названия месяцев
const monthName = computed(() => {
  // Получаем название месяца из конфигурации
  return config.value.monthsLong[props.month];
});

// Используем локализованные названия дней недели
const weekdays = computed(() => {
  return config.value.weekdaysShort;
});
</script>
```

### CalendarGrid.vue
```vue
<script setup lang="ts">
import { inject } from 'vue';

// Инжектим конфигурацию
const config = inject('calendarConfig');

// Используем конфигурацию для отображения дней недели
const weekdays = computed(() => {
 return config.value.weekdaysShort;
});
</script>
```

### CalendarDay.vue
```vue
<script setup lang="ts">
import { inject } from 'vue';

// Инжектим конфигурацию
const config = inject('calendarConfig');

// Используем конфигурацию для форматирования даты в aria-label
const formatDate = (date: Date) => {
  return date.toLocaleDateString(config.value.locale, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};
</script>
```

## Поддержка динамического изменения локали

### Пересчет конфигурации при изменении локали
```vue
<script setup lang="ts">
import { computed, provide, watch } from 'vue';

const props = defineProps<CalendarProps>();

// Создаем реактивную конфигурацию
const config = computed(() => ({
  locale: props.locale || 'en-US',
  firstDayOfWeek: props.firstDayOfWeek || 0,
  // ... остальные параметры
}));

// Обновляем конфигурацию при изменении пропсов
watch(() => props.locale, () => {
  // provide автоматически обновит значение для всех подписчиков
}, { immediate: true });

provide('calendarConfig', config);
</script>
```

## Поддержка пользовательской конфигурации

### Через слоты
```vue
<template>
  <div class="calendar-container">
    <slot 
      name="header"
      :month="monthName"
      :year="currentYear"
      :config="config"
    >
      <CalendarHeader :config="config" />
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';

const props = defineProps<CalendarProps>();

// Расширяем конфигурацию пользовательскими значениями
const config = computed(() => ({
  locale: props.locale || 'en-US',
  firstDayOfWeek: props.firstDayOfWeek || 0,
  // Пользовательские надписи
  todayLabel: props.todayLabel || 'Today',
  clearLabel: props.clearLabel || 'Clear',
  // ... остальные параметры
}));

provide('calendarConfig', config);
</script>
```

## Альтернативные подходы

### Глобальный контекст локализации
```typescript
// composables/useLocalization.ts
import { inject, computed } from 'vue';

export const useLocalization = () => {
  const config = inject('calendarConfig');
  
  const t = (key: string, fallback: string) => {
    // Возвращаем локализованное значение по ключу
    return config.value[key] || fallback;
  };
  
 const formatWeekday = (dayIndex: number, format: 'short' | 'long' = 'short') => {
    const weekdays = format === 'short' 
      ? config.value.weekdaysShort 
      : config.value.weekdaysLong;
    return weekdays[dayIndex];
  };
  
  const formatMonth = (monthIndex: number, format: 'short' | 'long' = 'long') => {
    const months = format === 'short' 
      ? config.value.monthsShort 
      : config.value.monthsLong;
    return months[monthIndex];
  };
  
  return {
    t,
    formatWeekday,
    formatMonth,
    locale: computed(() => config.value.locale)
  };
};
```

### Использование в компонентах
```vue
<script setup lang="ts">
import { useLocalization } from './composables/useLocalization';

const { formatWeekday, formatMonth, locale } = useLocalization();

// Используем хелперы для форматирования
const weekdayName = formatWeekday(1, 'short'); // Вторник в сокращенном виде
const monthName = formatMonth(props.month, 'long'); // Полное название месяца
</script>
```

## Поддержка тем

### Темизация через provide/inject
```vue
// Calendar.vue
const theme = computed(() => ({
  primaryColor: props.primaryColor || '#007bff',
  secondaryColor: props.secondaryColor || '#6c757d',
  todayColor: props.todayColor || '#e3f2fd',
  selectedColor: props.selectedColor || '#007bff',
  disabledColor: props.disabledColor || '#f8f9fa',
  // ... остальные цвета
}));

provide('calendarTheme', theme);

// В дочерних компонентах
const theme = inject('calendarTheme');
```

## Преимущества подхода

### Отсутствие Prop Drilling
- Конфигурация доступна на любом уровне вложенности
- Не нужно передавать пропсы через промежуточные компоненты

### Гибкость настройки
- Возможность переопределения конфигурации на разных уровнях
- Поддержка темизации и локализации

### Производительность
- Один раз вычисленная конфигурация доступна всем компонентам
- Избегаем передачи одних и тех же данных через несколько уровней

## Потенциальные проблемы и решения

### Проблема: Невозможность переопределения конфигурации на промежуточных уровнях
**Решение:** Использовать scoped provide/inject с разными ключами

```vue
<!-- Промежуточный компонент, изменяющий конфигурацию -->
<script setup lang="ts">
import { computed, provide } from 'vue';

const parentConfig = inject('calendarConfig');
const modifiedConfig = computed(() => ({
  ...parentConfig.value,
  firstDayOfWeek: 1 // Всегда начинать с понедельника
}));

provide('calendarConfig', modifiedConfig);
</script>
```

### Проблема: Сложность тестирования
**Решение:** Создание тест-хелперов для инъекции моков

```typescript
// test-helpers.ts
export const createCalendarConfigMock = (overrides = {}) => ({
 locale: 'en-US',
  firstDayOfWeek: 0,
  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  monthsLong: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  todayLabel: 'Today',
  clearLabel: 'Clear',
  ...overrides
});

// В тестах
beforeEach(() => {
 provide('calendarConfig', createCalendarConfigMock());
});
```

## Совместимость с TypeScript

### Типизированная реализация
```typescript
// types.ts
export interface CalendarConfig {
  locale: string;
  firstDayOfWeek: number;
  // ... остальные свойства
}

// В компонентах
const config = inject<ComputedRef<CalendarConfig>>('calendarConfig');

if (!config) {
  throw new Error('CalendarConfig is required but not provided');
}