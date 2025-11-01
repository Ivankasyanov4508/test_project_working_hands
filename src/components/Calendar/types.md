# TypeScript интерфейсы для компонента календаря

## Основные интерфейсы

### CalendarDay
Интерфейс для объекта дня, содержащего все необходимые метаданные:

```typescript
interface CalendarDay {
  date: Date;                    // Дата дня
  isCurrentMonth: boolean;       // Принадлежит ли день текущему месяцу
  isToday: boolean;              // Является ли день сегодняшним
  isSelected: boolean;           // Выбран ли день
  isDisabled: boolean;           // Отключен ли день (вне диапазона min/max)
  isWeekend?: boolean;           // Является ли день выходным
}
```

### CalendarConfig
Интерфейс для настроек календаря:

```typescript
interface CalendarConfig {
  minDate?: Date | null;         // Минимальная разрешенная дата
  maxDate?: Date | null;         // Максимальная разрешенная дата
  locale?: string;               // Локаль для локализации (по умолчанию 'en-US')
  firstDayOfWeek?: number;       // Первый день недели (0-воскресенье, 1-понедельник)
  disabledDates?: Date[];        // Массив дат, которые должны быть отключены
  weekends?: number[];           // Массив номеров дней недели, которые являются выходными
  dateFormat?: string;           // Формат даты для отображения
}
```

### DateRange
Интерфейс для диапазона дат:

```typescript
interface DateRange {
  start: Date | null;
  end: Date | null;
}
```

## События компонента

### CalendarEmits
Типы событий, которые эмитит компонент календаря:

```typescript
type CalendarEmits = {
  'update:modelValue': [date: Date | null];  // Для v-model
  select: [date: Date];                      // При выборе даты
  'month-change': [month: number, year: number]; // При изменении месяца
  'day-click': [day: CalendarDay];           // При клике на день
}
```

## Вспомогательные типы

### DayOfWeek
Тип для обозначения дня недели (0-воскресенье, 6-суббота):

```typescript
type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
```

### Month
Тип для обозначения месяца (0-январь, 11-декабрь):

```typescript
type Month = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
```

## Интерфейсы для Composable

### UseCalendarReturn
Тип возвращаемого значения из composable useCalendar:

```typescript
interface UseCalendarReturn {
  currentMonth: Ref<number>;     // Текущий месяц (0-1)
  currentYear: Ref<number>;      // Текущий год
  selectedDate: Ref<Date | null>; // Выбранная дата
  daysInMonth: ComputedRef<CalendarDay[]>; // Массив дней текущего месяца
  monthName: ComputedRef<string>; // Название текущего месяца
 weekdays: ComputedRef<string[]>; // Названия дней недели
  canNavigatePrev: ComputedRef<boolean>; // Можно ли перейти к предыдущему месяцу
  canNavigateNext: ComputedRef<boolean>; // Можно ли перейти к следующему месяцу
  navigateMonth: (direction: -1 | 1) => void; // Функция навигации по месяцам
  selectDate: (date: Date) => void; // Функция выбора даты
  getDaysGrid: () => CalendarDay[][]; // Функция получения сетки дней
}
```

## Интерфейсы для компонентов

### CalendarProps
Свойства главного компонента календаря:

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
}
```

### CalendarHeaderProps
Свойства компонента заголовка календаря:

```typescript
interface CalendarHeaderProps {
  month: number;                 // Текущий месяц (0-11)
  year: number;                  // Текущий год
  monthName: string;             // Название месяца
  canNavigatePrev: boolean;      // Можно ли перейти к предыдущему месяцу
  canNavigateNext: boolean;      // Можно ли перейти к следующему месяцу
}
```

### CalendarGridProps
Свойства компонента сетки календаря:

```typescript
interface CalendarGridProps {
  days: CalendarDay[][];         // Двумерный массив дней (недели с днями)
  weekdays: string[];            // Названия дней недели
  selectedDate: Date | null;     // Выбранная дата
}
```

### CalendarDayProps
Свойства компонента дня календаря:

```typescript
interface CalendarDayProps {
  day: CalendarDay;              // Объект дня с метаданными
}
```

Эти интерфейсы обеспечивают типобезопасность и ясную структуру для всего компонента календаря, следуя принципам разработки на Vue 3 с TypeScript.