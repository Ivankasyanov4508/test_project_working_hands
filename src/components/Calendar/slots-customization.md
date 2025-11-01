# Слоты для кастомизации элементов календаря

## Назначение
Слоты позволяют пользователям компонента календаря заменять или дополнять отдельные части компонента, обеспечивая гибкость визуализации без изменения основной реализации компонента.

## Типы слотов

### 1. Слоты в главном компоненте Calendar.vue

#### Слот `header`
Позволяет полностью заменить шапку календаря:

```vue
<template>
  <Calendar v-model="selectedDate">
    <template #header="{ month, year, canNavigatePrev, canNavigateNext, navigatePrev, navigateNext }">
      <div class="custom-header">
        <button @click="navigatePrev" :disabled="!canNavigatePrev">←</button>
        <h3>{{ month }} {{ year }}</h3>
        <button @click="navigateNext" :disabled="!canNavigateNext">→</button>
        <select @change="changeMonth">
          <option 
            v-for="(monthName, index) in monthNames" 
            :key="index" 
            :value="index"
            :selected="index === currentMonth"
          >
            {{ monthName }}
          </option>
        </select>
      </div>
    </template>
  </Calendar>
</template>
```

#### Слот `grid`
Позволяет заменить всю сетку календаря:

```vue
<template>
  <Calendar v-model="selectedDate">
    <template #grid="{ days, weekdays, selectedDate }">
      <div class="custom-grid">
        <div class="custom-weekdays">
          <div 
            v-for="weekday in weekdays" 
            :key="weekday"
            class="custom-weekday"
          >
            {{ weekday }}
          </div>
        </div>
        <div 
          v-for="(week, weekIndex) in days" 
          :key="weekIndex"
          class="custom-week"
        >
          <div 
            v-for="day in week" 
            :key="day.date.getTime()"
            class="custom-day-wrapper"
            :class="{ selected: day.isSelected }"
          >
            <div class="custom-day" @click="selectDay(day)">
              {{ day.date.getDate() }}
              <span v-if="hasEvent(day)" class="event-indicator">•</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </Calendar>
</template>
```

#### Слот `day`
Позволяет кастомизировать отдельные дни:

```vue
<template>
  <Calendar v-model="selectedDate">
    <template #day="{ day, isSelected, isToday }">
      <div class="custom-day" :class="{ selected: isSelected, today: isToday }">
        <span class="day-number">{{ day.date.getDate() }}</span>
        <div v-if="hasEvent(day)" class="event-marker">●</div>
        <div v-if="isWeekend(day)" class="weekend-marker">!</div>
      </div>
    </template>
  </Calendar>
</template>
```

#### Слот `footer`
Позволяет добавить футер к календарю:

```vue
<template>
  <Calendar v-model="selectedDate">
    <template #footer="{ selectedDate, currentMonth, currentYear }">
      <div class="calendar-footer">
        <button @click="selectToday">Сегодня</button>
        <button @click="clearSelection">Очистить</button>
        <div class="selected-info">
          Выбрано: {{ selectedDate ? formatDate(selectedDate) : 'Нет даты' }}
        </div>
      </div>
    </template>
  </Calendar>
</template>
```

### 2. Слоты в компоненте CalendarHeader.vue

#### Слот `navigation`
Позволяет заменить кнопки навигации:

```vue
<template>
  <CalendarHeader>
    <template #navigation="{ canNavigatePrev, canNavigateNext, navigatePrev, navigateNext }">
      <div class="custom-navigation">
        <button @click="navigatePrev" :disabled="!canNavigatePrev">Пред.</button>
        <button @click="navigateNext" :disabled="!canNavigateNext">След.</button>
      </div>
    </template>
  </CalendarHeader>
</template>
```

#### Слот `month-year`
Позволяет кастомизировать отображение месяца и года:

```vue
<template>
  <CalendarHeader>
    <template #month-year="{ month, year }">
      <div class="custom-month-year">
        <span class="month">{{ month }}</span>
        <span class="year">{{ year }}</span>
      </div>
    </template>
  </CalendarHeader>
</template>
```

### 3. Слоты в компоненте CalendarGrid.vue

#### Слот `weekday-header`
Позволяет кастомизировать заголовки дней недели:

```vue
<template>
  <CalendarGrid :days="days" :weekdays="weekdays">
    <template #weekday-header="{ weekday, index }">
      <div class="custom-weekday-header" :class="{ weekend: isWeekend(index) }">
        {{ weekday.substring(0, 2) }} <!-- Отображаем только первые 2 буквы -->
      </div>
    </template>
  </CalendarGrid>
</template>
```

#### Слот `week`
Позволяет кастомизировать отдельные недели:

```vue
<template>
  <CalendarGrid :days="days" :weekdays="weekdays">
    <template #week="{ week, weekIndex }">
      <div class="custom-week" :data-week-index="weekIndex">
        <CalendarDay
          v-for="day in week"
          :key="day.date.getTime()"
          :day="day"
        />
      </div>
    </template>
  </CalendarGrid>
</template>
```

### 4. Слоты в компоненте CalendarDay.vue

#### Слот `default` (scoped)
Позволяет полностью заменить содержимое дня:

```vue
<template>
  <CalendarDay :day="day">
    <template #default="{ day, isSelected, isToday, isCurrentMonth, isDisabled }">
      <div 
        class="fully-custom-day"
        :class="{ 
          selected: isSelected, 
          today: isToday, 
          'other-month': !isCurrentMonth,
          disabled: isDisabled
        }"
      >
        <span class="day-number">{{ day.date.getDate() }}</span>
        <div v-if="hasEvents(day)" class="events-badge">
          {{ getEventCount(day) }}
        </div>
      </div>
    </template>
  </CalendarDay>
</template>
```

#### Слот `day-content`
Позволяет добавить дополнительный контент внутрь дня:

```vue
<template>
  <CalendarDay :day="day">
    <template #day-content="{ day }">
      <div class="day-content">
        <span class="day-number">{{ day.date.getDate() }}</span>
        <div v-if="hasNote(day)" class="day-note">{{ getNote(day) }}</div>
      </div>
    </template>
  </CalendarDay>
</template>
```

## Паттерны использования слотов

### 1. Календарь с событиями
```vue
<template>
  <Calendar v-model="selectedDate">
    <template #day="{ day, isSelected, isToday }">
      <div class="event-day" :class="{ selected: isSelected, today: isToday }">
        <span class="day-number">{{ day.date.getDate() }}</span>
        <div 
          v-for="event in getEventsForDay(day.date)" 
          :key="event.id"
          class="event-indicator"
          :style="{ backgroundColor: event.color }"
        />
      </div>
    </template>
  </Calendar>
</template>
```

### 2. Календарь с диапазоном дат
```vue
<template>
  <Calendar v-model="selectedDate">
    <template #day="{ day, isSelected, isToday }">
      <div 
        class="range-day" 
        :class="{
          selected: isSelected,
          today: isToday,
          'in-range': isInRange(day.date),
          'range-start': isRangeStart(day.date),
          'range-end': isRangeEnd(day.date)
        }"
      >
        {{ day.date.getDate() }}
      </div>
    </template>
  </Calendar>
</template>
```

### 3. Тематический календарь
```vue
<template>
  <Calendar v-model="selectedDate" class="themed-calendar">
    <template #header="{ month, year, canNavigatePrev, canNavigateNext, navigatePrev, navigateNext }">
      <div class="themed-header">
        <button @click="navigatePrev" :disabled="!canNavigatePrev">◀</button>
        <h2>{{ month }} {{ year }}</h2>
        <button @click="navigateNext" :disabled="!canNavigateNext">▶</button>
      </div>
    </template>
    
    <template #day="{ day, isSelected, isToday }">
      <div class="themed-day" :class="{ selected: isSelected, today: isToday }">
        <div class="day-content">
          <span class="day-number">{{ day.date.getDate() }}</span>
          <div v-if="isWeekend(day)" class="weekend-badge">ВЫХ</div>
        </div>
      </div>
    </template>
  </Calendar>
</template>
```

## Передача данных через слоты

### В Calendar.vue
```typescript
// Данные, передаваемые в слот header
interface HeaderSlotProps {
  month: number;
  year: number;
  monthName: string;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
  navigatePrev: () => void;
  navigateNext: () => void;
}

// Данные, передаваемые в слот grid
interface GridSlotProps {
  days: CalendarDay[][];
  weekdays: string[];
  selectedDate: Date | null;
}

// Данные, передаваемые в слот day
interface DaySlotProps {
  day: CalendarDay;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}
```

### В CalendarGrid.vue
```typescript
// Данные, передаваемые в слот weekday-header
interface WeekdayHeaderSlotProps {
  weekday: string;
  index: number;
}

// Данные, передаваемые в слот week
interface WeekSlotProps {
  week: CalendarDay[];
  weekIndex: number;
}
```

### В CalendarDay.vue
```typescript
// Данные, передаваемые в слот по умолчанию
interface DaySlotProps {
  day: CalendarDay;
  isSelected: boolean;
  isToday: boolean;
  isCurrentMonth: boolean;
  isDisabled: boolean;
}
```

## Резервный контент (fallback content)

### Обеспечение доступности
```vue
<template>
  <CalendarDay :day="day">
    <template #default="{ day, isSelected, isToday }">
      <!-- Кастомный контент -->
      <div 
        class="custom-day" 
        :class="{ selected: isSelected, today: isToday }"
        :aria-label="formatDate(day.date)"
        :aria-selected="isSelected"
        role="gridcell"
      >
        {{ day.date.getDate() }}
      </div>
    </template>
  </CalendarDay>
</template>
```

## Совместимость с TypeScript

### Определение типов для слотов
```typescript
// В Calendar.vue
interface CalendarSlots {
  header: (props: HeaderSlotProps) => any;
  grid: (props: GridSlotProps) => any;
  day: (props: DaySlotProps) => any;
  footer: (props: FooterSlotProps) => any;
}

// Использование с defineSlots (Vue 3.3+)
const slots = defineSlots<CalendarSlots>();
```

## Архитектурные преимущества

### Гибкость
- Пользователи могут кастомизировать любую часть компонента
- Возможность создания различных вариантов календаря на основе одного компонента

### Расширяемость
- Новые функции могут быть добавлены через слоты без изменения основной логики
- Поддержка плагинов и расширений

### Поддерживаемость
- Основная логика остается неизменной
- Кастомизация изолирована в пользовательском коде

## Лучшие практики

### 1. Четкое документирование слотов
Всегда документируйте, какие данные передаются в каждый слот:

```vue
<!-- Слот для кастомизации отдельного дня -->
<!-- Передаваемые данные: -->
<!-- day: CalendarDay - объект дня с метаданными -->
<!-- isSelected: boolean - выбран ли день -->
<!-- isToday: boolean - сегодняшний ли день -->
<template #day="{ day, isSelected, isToday }">
  <!-- пользовательский контент -->
</template>
```

### 2. Логические имена слотов
Используйте понятные имена слотов, отражающие их назначение:

- `header` - для шапки
- `day` - для отдельного дня
- `navigation` - для элементов навигации
- `footer` - для футера

### 3. Совместимость с доступностью
При кастомизации через слоты сохраняйте элементы доступности:

```vue
<template #day="{ day, isSelected }">
  <div
    role="gridcell"
    :aria-label="formatDate(day.date)"
    :aria-selected="isSelected"
    :tabindex="day.isDisabled ? -1 : 0"
  >
    {{ day.date.getDate() }}
  </div>
</template>
```

## Потенциальные проблемы и решения

### Проблема: Снижение производительности при сложной кастомизации
**Решение:** Использовать `v-memo` для оптимизации рендеринга сложных кастомных элементов

### Проблема: Сложность тестирования кастомизированных компонентов
**Решение:** Предоставление тест-хелперов и примеров для тестирования кастомных слотов