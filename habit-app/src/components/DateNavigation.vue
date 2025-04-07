<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const currentDate = computed(() => route.params.date);

function setDate(date) {
  return date.toISOString().split('T')[0];
}

function beforeToday() {
  const todays = new Date().toISOString().split('T')[0];
  return currentDate.value < todays;
}

function goToPreviousDay() {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() - 1);
  router.push({ name: 'day', params: { date: setDate(newDate) } });
}

function goToNextDay() {
  const newDate = new Date(currentDate.value);
  newDate.setDate(newDate.getDate() + 1);
  if (setDate(newDate) === '2025-03-30') {
    newDate.setDate(newDate.getDate() + 1);
  }
  router.push({ name: 'day', params: { date: setDate(newDate) } });
}
</script>

<template>
  <div class="pt-2">
    <div class="flex flex-row sm:flex-row items-center justify-center gap-2 sm:gap-4">
      <button
        @click="goToPreviousDay"
        class="bg-indigo-200 px-3 py-1 rounded-full shadow hover:bg-indigo-300 transition"
      >
        ⬅️ Previous day
      </button>

      <span class="text-gray-700 font-medium">{{ currentDate }}</span>

      <button
        v-if="beforeToday()"
        @click="goToNextDay"
        class="bg-indigo-200 px-3 py-1 rounded-full shadow hover:bg-indigo-300 transition"
      >
        Next day ➡️
      </button>
    </div>
  </div>
</template>

<style scoped></style>
