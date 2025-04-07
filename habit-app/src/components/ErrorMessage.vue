<script setup>
defineProps({
  message: String,
});
</script>

<template>
  <div v-if="message" class="text-red-500 text-center my-2">{{ message }}</div>
</template>

<style scoped></style>
