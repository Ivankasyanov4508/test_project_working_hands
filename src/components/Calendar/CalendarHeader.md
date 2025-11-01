# Компонент CalendarHeader.vue - Документация реализации

## Назначение
Компонент CalendarHeader.vue отвечает за отображение навигационной панели календаря, включая текущий месяц и год, а также кнопки переключения месяцев. Компонент также может содержать опциональные дропдауны для быстрого выбора месяца/года.

## Структура компонента

### Свойства (Props)
```typescript
interface CalendarHeaderProps {
  month: number;                 // Текущий месяц (0-11)
  year: number;                  // Текущий год
  monthName: string;             // Название месяца
  canNavigatePrev: boolean;      // Можно ли перейти к предыдущему месяцу
  canNavigateNext: boolean;      // Можно ли перейти к следующему месяцу
}
```

### События (Emits)
```typescript
type CalendarHeaderEmits = {
  'prev-month': [];              // При клике на кнопку "предыдущий месяц"
  'next-month': [];              // При клике на кнопку "следующий месяц"
  'month-change': [month: number]; // При изменении месяца через дропдаун
  'year-change': [year: number]; // При изменении года через дропдаун
}
```

## Реализация

### Template
```vue
<template>
  <div class="calendar-header">
    <!-- Кнопка "предыдущий месяц" -->
    <button 
      :disabled="!canNavigatePrev" 
      @click="onPrevMonth"
      class="nav-button prev"
      aria-label="Предыдущий месяц"
    >
      <
    </button>
    
    <!-- Контейнер для отображения месяца и года -->
    <div class="month-year-container">
      <!-- Опциональный дропдаун для выбора месяца -->
      <select 
        v-if="showMonthDropdown" 
        :value="month" 
        @change="onMonthChange"
        class="month-select"
      >
        <option 
          v-for="(monthName, index) in monthNames" 
          :key="index" 
          :value="index"
          :disabled="!isMonthSelectable(index)"
        >
          {{ monthName }}
        </option>
      </select>
      
      <!-- Отображение месяца и года (если дропдауны не используются) -->
      <span v-else class="month-year-display">
        {{ monthName }}
      </span>
      
      <!-- Опциональный дропдаун для выбора года -->
      <select 
        v-if="showYearDropdown" 
        :value="year" 
        @change="onYearChange"
        class="year-select"
      >
        <option 
          v-for="yearOption in yearRange" 
          :key="yearOption" 
          :value="yearOption"
          :disabled="!isYearSelectable(yearOption)"
        >
          {{ yearOption }}
        </option>
      </select>
      
      <!-- Отображение года (если дропдаун не используется) -->
      <span v-else class="year-display">
        {{ year }}
      </span>
    </div>
    
    <!-- Кнопка "следующий месяц" -->
    <button 
      :disabled="!canNavigateNext" 
      @click="onNextMonth"
      class="nav-button next"
      aria-label="Следующий месяц"
    >
      >
    </button>
  </div>
</template>
```

### Script
```vue
<script setup lang="ts">
import { computed } from 'vue';
import { CalendarHeaderProps } from './types';

// Определяем пропсы
const props = defineProps<CalendarHeaderProps>();

// Определяем эмиты
const emit = defineEmits<CalendarHeaderEmits>();

// Вычисляемые свойства
const monthNames = computed(() => {
  const names = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(2023, i, 1);
    names.push(date.toLocaleDateString(props.locale || 'en-US', { month: 'long' }));
  }
  return names;
});

// Диапазон лет для дропдауна (например, от 1900 до 2100)
const yearRange = computed(() => {
  const startYear = 1900;
  const endYear = 2100;
  const years = [];
  for (let y = startYear; y <= endYear; y++) {
    years.push(y);
  }
  return years;
});

// Параметры для опционального использования дропдаунов
const showMonthDropdown = computed(() => false); // По умолчанию false, можно настроить
const showYearDropdown = computed(() => false);  // По умолчанию false, можно настроить

// Методы
const onPrevMonth = () => {
  if (props.canNavigatePrev) {
    emit('prev-month');
  }
};

const onNextMonth = () => {
  if (props.canNavigateNext) {
    emit('next-month');
  }
};

const onMonthChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newMonth = parseInt(target.value);
  emit('month-change', newMonth);
};

const onYearChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  const newYear = parseInt(target.value);
  emit('year-change', newYear);
};

// Методы для проверки доступности месяцев и лет
const isMonthSelectable = (monthIndex: number) => {
  // Проверяем, доступен ли конкретный месяц в зависимости от min/max дат
  // Реализация зависит от переданных ограничений
  return true;
};

const isYearSelectable = (yearOption: number) => {
  // Проверяем, доступен ли конкретный год в зависимости от min/max дат
  // Реализация зависит от переданных ограничений
  return true;
};
</script>
```

### Стили
```vue
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

.month-select, .year-select {
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.month-year-display, .year-display {
  padding: 0.25rem 0.5rem;
  font-size: 1.1rem;
}
</style>
```

## Опциональные функции

### Поддержка слотов
Компонент может поддерживать слоты для кастомизации:

```vue
<template>
  <div class="calendar-header">
    <button 
      :disabled="!canNavigatePrev" 
      @click="onPrevMonth"
      class="nav-button prev"
    >
      <
    </button>
    
    <!-- Слот для кастомизации отображения месяца/года -->
    <slot 
      name="header-content" 
      :month="month" 
      :year="year" 
      :monthName="monthName"
    >
      <div class="month-year-container">
        <span class="month-year-display">{{ monthName }}</span>
        <span class="year-display">{{ year }}</span>
      </div>
    </slot>
    
    <button 
      :disabled="!canNavigateNext" 
      @click="onNextMonth"
      class="nav-button next"
    >
      >
    </button>
  </div>
</template>
```

### Поддержка тем
Компонент может поддерживать светлую и темную темы:

```vue
<style scoped>
.calendar-header {
  /* ... общие стили ... */
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
</style>
```

## Использование в родительском компоненте
```vue
<template>
  <CalendarHeader
    :month="currentMonth"
    :year="currentYear"
    :monthName="monthName"
    :canNavigatePrev="canNavigatePrev"
    :canNavigateNext="canNavigateNext"
    @prev-month="navigateMonth(-1)"
    @next-month="navigateMonth(1)"
  />
</template>
```

## Особенности реализации
1. Компонент получает все необходимые данные через props
2. Эмитит события при взаимодействии с элементами навигации
3. Поддерживает опциональные дропдауны для быстрого выбора месяца/года
4. Имеет доступные элементы интерфейса (aria-label)
5. Стилизован с использованием scoped CSS
6. Поддерживает кастомизацию через слоты