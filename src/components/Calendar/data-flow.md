# Система событий и поток данных (Props flow и Events flow)

## Общая архитектура потока данных

### Props flow (поток свойств сверху вниз)
```
Parent Component
  ↓ (modelValue, minDate, maxDate, locale, etc.)
Calendar.vue
  ↓ (month, year, canNavigate*, monthName)
  ├→ CalendarHeader.vue
 └→ CalendarGrid.vue
      ↓ (days[], selectedDate, weekdays)
      └→ CalendarDay.vue (day object)
```

### Events flow (поток событий снизу вверх)
```
CalendarDay.vue (@select)
  ↓
CalendarGrid.vue (@day-select)
  ↓
Calendar.vue (@update:modelValue, @select, @day-click)
 ↓
Parent Component
```

## Подробное описание потоков

### 1. Props Flow

#### Calendar.vue → CalendarHeader.vue
**Передаваемые свойства:**
- `month: number` - текущий месяц (0-11)
- `year: number` - текущий год
- `monthName: string` - локализованное название месяца
- `canNavigatePrev: boolean` - можно ли перейти к предыдущему месяцу
- `canNavigateNext: boolean` - можно ли перейти к следующему месяцу

**Назначение:** Предоставление данных для отображения заголовка и управления навигацией

#### Calendar.vue → CalendarGrid.vue
**Передаваемые свойства:**
- `days: CalendarDay[][]` - двумерный массив дней (недели с днями)
- `weekdays: string[]` - названия дней недели
- `selectedDate: Date | null` - выбранная дата
- `locale: string` - локаль для локализации

**Назначение:** Предоставление данных для отображения сетки календаря

#### CalendarGrid.vue → CalendarDay.vue
**Передаваемые свойства:**
- `day: CalendarDay` - объект дня с метаданными:
  - `date: Date` - дата дня
  - `isCurrentMonth: boolean` - принадлежит ли день текущему месяцу
  - `isToday: boolean` - является ли день сегодняшним
  - `isSelected: boolean` - выбран ли день
  - `isDisabled: boolean` - отключен ли день

**Назначение:** Предоставление данных для отображения отдельной ячейки дня

### 2. Events Flow

#### CalendarDay.vue → CalendarGrid.vue
**События:**
- `@select: [day: CalendarDay]` - при клике на день
- `@hover: [day: CalendarDay]` - при наведении на день

**Назначение:** Уведомление родительского компонента о взаимодействии с днем

#### CalendarGrid.vue → Calendar.vue
**События:**
- `@day-select: [day: CalendarDay]` - при выборе дня через дочерний компонент
- `@day-hover: [day: CalendarDay]` - при наведении на день

**Назначение:** Передача событий от дочерних компонентов дней к основному компоненту

#### Calendar.vue → Parent Component
**События:**
- `@update:modelValue: [date: Date | null]` - для v-model привязки
- `@select: [date: Date]` - при выборе даты
- `@month-change: [month: number, year: number]` - при изменении месяца
- `@day-click: [day: CalendarDay]` - при клике на день

**Назначение:** Уведомление родительского компонента о изменениях в календаре

## Управление состоянием

### Локальное состояние
- **Навигация (месяц/год)**: Управляемое внутренне в Calendar.vue через composable useCalendar
- **Выбранная дата**: Может быть как внутренним состоянием, так и управляться через v-model

### Внешнее состояние
- **modelValue**: Внешняя дата, устанавливаемая через v-model
- **Ограничения (minDate, maxDate)**: Внешние ограничения, передаваемые как пропсы

## Паттерн v-model

### Реализация
```vue
<!-- В родительском компоненте -->
<Calendar v-model="selectedDate" />

<!-- Эквивалентно -->
<Calendar 
  :modelValue="selectedDate" 
  @update:modelValue="selectedDate = $event" 
/>
```

### Внутренняя реализация в Calendar.vue
```typescript
interface CalendarProps {
  modelValue?: Date | null;
}

type CalendarEmits = {
 'update:modelValue': [date: Date | null];
}
```

## Обработка событий навигации

### Изменение месяца
```
CalendarHeader (кнопка навигации)
  ↓ (@prev-month, @next-month)
Calendar.vue (navigateMonth)
  ↓ (обновление currentMonth/currentYear)
  ↓ (перерасчет daysInMonth)
CalendarGrid (обновление отображения)
```

## Обработка выбора даты

### Выбор даты
```
CalendarDay (клик по дню)
  ↓ (@select)
CalendarGrid (переадресация)
  ↓ (@day-select)
Calendar.vue (selectDate, emit)
  ↓ (@update:modelValue, @select)
Parent Component (обработка события)
```

## Оптимизация производительности

### Правила передачи данных
1. **Иммутабельность**: Объекты дней передаются как неизменяемые
2. **Вычисляемые свойства**: Использование computed для оптимизации перерасчетов
3. **Глубокая оптимизация**: Использование v-memo (при необходимости) для оптимизации рендеринга

### Стратегии обновления
1. **Мелкие компоненты**: CalendarDay обновляется только при изменении его состояния
2. **Эффективное сравнение**: Использование ссылок на объекты для оптимизации сравнения

## Обработка ошибок и крайних случаев

### Ограничения дат
- Проверка minDate/maxDate происходит в composable
- Отключенные дни визуально и функционально недоступны

### Граничные значения
- Обработка перехода между годами
- Корректное отображение месяцев с разным количеством дней
- Поддержка разных локалей и первых дней недели

## Архитектурные преимущества

### Масштабируемость
- Легко добавить функционал (диапазоны дат, мультивыбор, события на датах)
- Компоненты слабо связаны, что упрощает расширение

### Тестируемость
- Каждый компонент и composable тестируется изолированно
- Четкие интерфейсы для тестирования потоков данных

### Поддерживаемость
- Четкое разделение ответственности упрощает отладку
- Легко находить и исправлять ошибки в конкретных компонентах

### Производительность
- Мелкие компоненты позволяют Vue эффективно обновлять только измененные части
- Вычисляемые свойства предотвращают ненужные перерасчеты