# Composable useCalendar.ts - Документация реализации

## Назначение
Composable useCalendar.ts инкапсулирует всю бизнес-логику работы с датами для компонента календаря. Он предоставляет реактивное состояние и методы для управления календарем, позволяя компонентам сосредоточиться на отображении.

## Импорты
```typescript
import { ref, computed, ComputedRef } from 'vue';
import { CalendarDay, CalendarConfig, UseCalendarReturn } from '../types';
```

## Состояние
```typescript
// Реактивные ссылки на текущее состояние
const currentMonth = ref<number>(new Date().getMonth());    // Текущий месяц (0-11)
const currentYear = ref<number>(new Date().getFullYear());  // Текущий год
const selectedDate = ref<Date | null>(null);                // Выбранная дата
const config = ref<CalendarConfig>({                        // Конфигурация календаря
  minDate: null,
  maxDate: null,
  locale: 'en-US',
  firstDayOfWeek: 0,
  disabledDates: [],
  weekends: [0, 6], // воскресенье и суббота
 dateFormat: 'YYYY-MM-DD'
});
```

## Вычисляемые свойства

### daysInMonth
Массив объектов дней для текущего месяца с полными метаданными:
```typescript
const daysInMonth: ComputedRef<CalendarDay[]> = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  const days: CalendarDay[] = [];
  
  // Получаем первый день месяца и последний день месяца
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  // Определяем первый день недели в календаре (включая дни из предыдущего месяца)
 const startDay = new Date(firstDayOfMonth);
  const daysFromPrevMonth = (startDay.getDay() - config.value.firstDayOfWeek + 7) % 7;
  startDay.setDate(startDay.getDate() - daysFromPrevMonth);
  
  // Определяем последний день в календаре (включая дни из следующего месяца)
  const endDay = new Date(lastDayOfMonth);
  const daysToNextMonth = 6 - ((endDay.getDay() - config.value.firstDayOfWeek + 7) % 7);
  endDay.setDate(endDay.getDate() + daysToNextMonth);
  
  // Проходим от startDay до endDay и создаем объекты CalendarDay
  const current = new Date(startDay);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  while (current <= endDay) {
    const dateCopy = new Date(current);
    const isCurrentMonth = current.getMonth() === currentMonth.value;
    const isToday = dateCopy.toDateString() === today.toDateString();
    const isSelected = selectedDate.value && 
                      dateCopy.toDateString() === selectedDate.value.toDateString();
    const isDisabled = isDateDisabled(dateCopy);
    
    days.push({
      date: dateCopy,
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return days;
});
```

### monthName
Название текущего месяца с учетом локали:
```typescript
const monthName: ComputedRef<string> = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  return date.toLocaleDateString(config.value.locale, { month: 'long', year: 'numeric' });
});
```

### weekdays
Названия дней недели:
```typescript
const weekdays: ComputedRef<string[]> = computed(() => {
  const weekdays = [];
  const date = new Date();
  // Устанавливаем день на первый понедельник после сегодняшнего дня
  date.setDate(date.getDate() - date.getDay() + config.value.firstDayOfWeek);
  
  for (let i = 0; i < 7; i++) {
    weekdays.push(date.toLocaleDateString(config.value.locale, { weekday: 'short' }));
    date.setDate(date.getDate() + 1);
  }
  
  return weekdays;
});
```

### canNavigatePrev / canNavigateNext
Возможность навигации с учетом ограничений:
```typescript
const canNavigatePrev: ComputedRef<boolean> = computed(() => {
  if (!config.value.minDate) return true;
  
  const prevMonth = currentMonth.value === 0 ? 11 : currentMonth.value - 1;
  const prevYear = currentMonth.value === 0 ? currentYear.value - 1 : currentYear.value;
  
  return prevYear > config.value.minDate.getFullYear() ||
         (prevYear === config.value.minDate.getFullYear() && prevMonth >= config.value.minDate.getMonth());
});

const canNavigateNext: ComputedRef<boolean> = computed(() => {
  if (!config.value.maxDate) return true;
  
  const nextMonth = currentMonth.value === 11 ? 0 : currentMonth.value + 1;
  const nextYear = currentMonth.value === 11 ? currentYear.value + 1 : currentYear.value;
  
  return nextYear < config.value.maxDate.getFullYear() ||
         (nextYear === config.value.maxDate.getFullYear() && nextMonth <= config.value.maxDate.getMonth());
});
```

## Методы

### navigateMonth
Переход между месяцами:
```typescript
const navigateMonth = (direction: -1 | 1) => {
  if (direction === -1) {
    if (currentMonth.value === 0) {
      currentMonth.value = 11;
      currentYear.value--;
    } else {
      currentMonth.value--;
    }
  } else {
    if (currentMonth.value === 11) {
      currentMonth.value = 0;
      currentYear.value++;
    } else {
      currentMonth.value++;
    }
  }
};
```

### selectDate
Выбор даты:
```typescript
const selectDate = (date: Date) => {
  if (!isDateDisabled(date)) {
    selectedDate.value = date;
  }
};
```

### getDaysGrid
Генерация массива дней с учетом недель (двумерный массив):
```typescript
const getDaysGrid = (): CalendarDay[][] => {
  const grid: CalendarDay[][] = [];
  const days = daysInMonth.value;
  
  for (let i = 0; i < days.length; i += 7) {
    grid.push(days.slice(i, i + 7));
  }
  
  return grid;
};
```

### isToday
Проверка, является ли дата сегодняшней:
```typescript
const isToday = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return checkDate.getTime() === today.getTime();
};
```

### isDisabled
Проверка ограничений (minDate/maxDate):
```typescript
const isDateDisabled = (date: Date): boolean => {
  // Проверяем minDate
  if (config.value.minDate && date < config.value.minDate) {
    return true;
  }
  
  // Проверяем maxDate
  if (config.value.maxDate && date > config.value.maxDate) {
    return true;
  }
  
  // Проверяем disabledDates
  if (config.value.disabledDates) {
    const dateString = date.toDateString();
    for (const disabledDate of config.value.disabledDates) {
      if (disabledDate.toDateString() === dateString) {
        return true;
      }
    }
  }
  
  return false;
};
```

## Вспомогательные функции

### initializeCalendar
Инициализация календаря с определенной датой:
```typescript
const initializeCalendar = (initialDate: Date) => {
  currentMonth.value = initialDate.getMonth();
  currentYear.value = initialDate.getFullYear();
  selectedDate.value = initialDate;
};
```

## Возвращаемое значение
Composable возвращает объект с состоянием и методами:
```typescript
const useCalendar = (initialConfig?: CalendarConfig): UseCalendarReturn => {
  // Устанавливаем начальную конфигурацию, если она предоставлена
  if (initialConfig) {
    config.value = { ...config.value, ...initialConfig };
  }
  
  return {
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
  };
};
```

## Использование в компонентах
```typescript
// В компоненте
import { useCalendar } from '@/composables/useCalendar';

const { 
  currentMonth, 
  currentYear, 
  selectedDate, 
  daysInMonth, 
  navigateMonth,
  selectDate
} = useCalendar({
  minDate: new Date(2023, 0, 1),
  maxDate: new Date(2025, 11, 31),
  locale: 'ru-RU'
});
```

## Преимущества реализации
1. Вся логика работы с датами изолирована от UI
2. Легко тестировать отдельно от компонентов
3. Повторное использование в разных компонентах
4. Простота замены реализации без изменения компонентов
5. Четкое разделение ответственности