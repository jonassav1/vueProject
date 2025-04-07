<script setup>
import DateNavigation from '../components/DateNavigation.vue';
import HabitList from '../components/HabitList.vue';
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const currentDate = computed(() => route.params.date);
const dayName = computed(() => {
  const date = new Date(currentDate.value);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
});
</script>

<template>
  <main>
    <div class="navigations"><DateNavigation /></div>
    <div>
      <h1>Habits to complete on {{ dayName }}</h1>
      <HabitList />
    </div>
  </main>
</template>

<style scoped>
h1 {
  display: flex;
  justify-content: center;
  margin: 1rem;
  font-size: large;
}
.navigations {
  margin-top: 1rem;
}
</style>
