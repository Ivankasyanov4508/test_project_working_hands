# Поддержка v-model для двусторонней привязки даты

## Назначение
Реализация v-model позволяет использовать компонент календаря с синтаксисом двусторонней привязки данных, как встроенные элементы формы. Это упрощает интеграцию компонента в формы и улучшает пользовательский опыт.

## Основы v-model в Vue 3

### Принцип работы
```vue
<!-- Использование v-model -->
<Calendar v-model="selectedDate" />

<!-- Эквивалентно следующему -->
<Calendar 
  :modelValue="selectedDate" 
  @update:modelValue="selectedDate = $event" 
/>
```

## Реализация в компоненте Calendar

### Определение props
```typescript
interface CalendarProps {
  modelValue?: Date | null;      // Принимаемая дата
  // ... другие пропсы
}
```

### Определение событий
```typescript
type CalendarEmits = {
  'update:modelValue': [date: Date | null];  // Событие обновления значения
  // ... другие события
}
```

### Использование в компоненте
```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useCalendar } from './composables/useCalendar';

// Определяем пропсы и эмиты
const props = defineProps<CalendarProps>();
const emit = defineEmits<CalendarEmits>();

// Используем composable
const { selectedDate, selectDate: selectDateInternal } = useCalendar({
  // ... конфигурация
});

// Синхронизация внешнего modelValue с внутренним состоянием
watch(() => props.modelValue, (newVal) => {
  if (newVal !== selectedDate.value) {
    selectedDate.value = newVal;
  }
}, { immediate: true });

// Синхронизация внутреннего состояния с внешним modelValue
watch(selectedDate, (newVal) => {
  if (newVal !== props.modelValue) {
    emit('update:modelValue', newVal);
  }
});

// Обработчик выбора даты
const handleDaySelect = (day: CalendarDay) => {
  selectDateInternal(day.date);
  emit('update:modelValue', day.date);
  emit('select', day.date);
};
</script>
```

## Поддержка нескольких v-model (опционально)

### Для диапазона дат
```vue
<!-- Использование нескольких v-model -->
<Calendar 
  v-model:start-date="startDate" 
  v-model:end-date="endDate" 
/>
```

### Реализация
```typescript
interface CalendarProps {
  startDate?: Date | null;
  endDate?: Date | null;
  // ... другие пропсы
}

type CalendarEmits = {
  'update:startDate': [date: Date | null];
  'update:endDate': [date: Date | null];
  // ... другие события
}
```

## Интеграция с формами

### Использование с Composition API
```vue
<template>
  <form @submit="handleSubmit">
    <Calendar v-model="form.date" />
    <button type="submit">Отправить</button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import Calendar from './Calendar.vue';

const form = reactive({
  date: new Date()
});

const handleSubmit = (e: Event) => {
 e.preventDefault();
  console.log('Выбранная дата:', form.date);
};
</script>
```

### Использование с Options API
```vue
<template>
  <Calendar v-model="selectedDate" />
</template>

<script>
import Calendar from './Calendar.vue';

export default {
  components: {
    Calendar
  },
  data() {
    return {
      selectedDate: null
    };
  }
};
</script>
```

## Валидация с v-model

### Совместимость с VeeValidate
```vue
<template>
  <Field 
    v-slot="{ field, errorMessage }" 
    name="date" 
    rules="required|date_between:2023-01-01,2025-12-31"
  >
    <Calendar 
      v-bind="field" 
      :modelValue="field.value" 
      @update:modelValue="field.onInput" 
    />
    <span v-if="errorMessage" class="error">{{ errorMessage }}</span>
  </Field>
</template>
```

## Асинхронное обновление

### С задержкой
```vue
<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<CalendarProps>();
const emit = defineEmits<CalendarEmits>();
const internalValue = ref<Date | null>(props.modelValue);

// Синхронизация с задержкой
watch(internalValue, (newVal) => {
  setTimeout(() => {
    emit('update:modelValue', newVal);
  }, 300);
}, { deep: true });
</script>
```

## Обработка особых случаев

### Начальное значение
```vue
<script setup lang="ts">
const props = withDefaults(defineProps<CalendarProps>(), {
  modelValue: () => null  // Значение по умолчанию
});

// Или установка значения по умолчанию в зависимости от других условий
if (!props.modelValue) {
  selectedDate.value = new Date(); // Установить текущую дату по умолчанию
}
</script>
```

### Отмена изменений
```vue
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<CalendarProps>();
const emit = defineEmits<CalendarEmits>();
const lastConfirmedValue = ref<Date | null>(props.modelValue);

// Метод для отмены изменений
const cancelChanges = () => {
  selectedDate.value = lastConfirmedValue.value;
  emit('update:modelValue', lastConfirmedValue.value);
};

// Подтверждение изменений
const confirmChanges = () => {
  lastConfirmedValue.value = selectedDate.value;
};
</script>
```

## Тестирование v-model

### Юнит-тесты
```typescript
// test/Calendar.spec.ts
import { mount } from '@vue/test-utils';
import Calendar from '../src/components/Calendar.vue';

describe('Calendar v-model', () => {
  it('should update modelValue when date is selected', async () => {
    const wrapper = mount(Calendar);
    const initialDate = new Date(2023, 0, 15);
    
    // Устанавливаем начальное значение
    await wrapper.setProps({ modelValue: initialDate });
    
    // Симулируем выбор новой даты
    // (в реальном тесте нужно будет смоделировать клик по дню)
    const newDate = new Date(2023, 0, 20);
    
    // Проверяем, что событие update:modelValue было вызвано
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  it('should reflect modelValue changes', async () => {
    const wrapper = mount(Calendar);
    const date = new Date(2023, 0, 10);
    
    await wrapper.setProps({ modelValue: date });
    
    // Проверяем, что внутреннее состояние обновилось
    expect(wrapper.vm.selectedDate).toEqual(date);
  });
});
```

## Совместимость с TypeScript

### Определение типа для v-model
```typescript
// types.ts
import type { PropType } from 'vue';

export const calendarProps = {
  modelValue: {
    type: Date as PropType<Date | null>,
    default: null
 }
} as const;

export type CalendarProps = typeof calendarProps;
```

## Архитектурные преимущества v-model

### Простота интеграции
- Компонент интегрируется в формы так же, как и встроенные элементы
- Уменьшается количество кода в родительском компоненте

### Совместимость
- Работает с библиотеками форм (VeeValidate, FormKit и др.)
- Совместим с Composition и Options API

### Понятность
- Поведение интуитивно понятно для разработчиков
- Следует установленным паттернам Vue.js