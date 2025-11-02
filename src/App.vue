<script setup lang="ts">
import { ref } from "vue";
import Calendar from "./components/Calendar/index.vue";

const initialDateEnUS = ref<string>("2029-11-15");
const initialDateRuRU = ref<string>("2025-02-15");
const onDateSelect = (date: Date) => {
  console.log("Selected date:", date);
};
</script>

<template>
  <div id="app">
    <div class="box">
      <h2>Календарь по умолчанию (en-US):</h2>
      <Calendar :initial-date="initialDateEnUS" @select="onDateSelect" />
    </div>
    <div class="box">
      <h2>Календарь с русской локалью:</h2>
      <Calendar
        locale="ru-RU"
        :initial-date="initialDateRuRU"
        @select="onDateSelect"
      />
    </div>
    <div class="box">
      <h2>Календарь с немецкой локалью:</h2>
      <Calendar locale="de-DE" @select="onDateSelect" />
    </div>
  </div>
</template>

<style scoped>
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.calendar-controls {
  margin-bottom: 20px;
}

.calendar-controls button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.calendar-controls button:hover {
  background-color: #0056b3;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
