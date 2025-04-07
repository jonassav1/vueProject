<script setup>
import { ref, watch, computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  todo: Object,
});
const isChecked = ref(false);
const route = useRoute();
const currentDate = computed(() => route.params.date);

watchEffect(() => {
  const allRecordsRaw = localStorage.getItem('habitRecords');
  const allRecords = allRecordsRaw ? JSON.parse(allRecordsRaw) : {};
  const date = currentDate.value;
  const habitId = props.todo.id;
  // If there's no record yet for the date and a habit, default to "not completed" (false) if yes get true or false value
  const isHabitMarkedDone = allRecords[date]?.[habitId] ?? false;
  isChecked.value = isHabitMarkedDone;
});

watch(isChecked, (newValue) => {
  const allRecords = JSON.parse(localStorage.getItem('habitRecords') || '{}');
  if (!allRecords[currentDate.value]) {
    allRecords[currentDate.value] = {};
  }
  allRecords[currentDate.value][props.todo.id] = newValue;
  localStorage.setItem('habitRecords', JSON.stringify(allRecords));
});
</script>

<template>
  <div class="inputAndCheckboxStyle">
    <ul>
      <li><input type="checkbox" id="checkbox" v-model="isChecked" /> {{ props.todo.item }}</li>
    </ul>
  </div>
</template>

<style scoped>
.inputAndCheckboxStyle {
  display: flex;
  flex-direction: row;
  gap: 8px;
  padding-bottom: 20px;
  font-size: 20px;
}
</style>
