<script setup>
import TodoItem from './TodoItem.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import Modal from './Modals/ModalView.vue';
import ModalEdit from './Modals/ModalViewEdit.vue';
import ModalDelete from './Modals/ModalViewDelete.vue';
import ModalStop from './Modals/ModalStop.vue';
import ErrorMessage from './ErrorMessage.vue';

const habitList = ref([]);
const newHabitName = ref('');
const showModal = ref(false);
const showModalEdit = ref(false);
const showModalDelete = ref(false);
const selectedHabitId = ref();
const showModalStop = ref(false);
const route = useRoute();
const currentDate = computed(() => route.params.date);
const errorMessage = ref('');

const visibleHabits = computed(() => {
  return habitList.value.filter((habit) => {
    return !habit.stoppedAt || currentDate.value < habit.stoppedAt;
  });
});

onMounted(() => {
  const saved = localStorage.getItem('habitList');
  if (saved) {
    try {
      habitList.value = JSON.parse(saved);
    } catch (e) {
      localStorage.removeItem('habitList');
      console.log(e);
    }
  }
});

function saveHabits() {
  localStorage.setItem('habitList', JSON.stringify(habitList.value));
}

function addHabit() {
  if (!newHabitName.value.trim()) {
    errorMessage.value = 'Enter name of the habit you wnat to add!';
    return;
  }
  habitList.value.push({
    id: Date.now(),
    item: newHabitName.value,
    stoppedAt: null,
  });
  saveHabits();
  newHabitName.value = '';
  showModal.value = false;
}

function deleteHabit() {
  if (selectedHabitId.value != null) {
    habitList.value = habitList.value.filter((habit) => habit.id !== selectedHabitId.value);
    saveHabits();
    showModalDelete.value = false;
  }
}

function editHabit() {
  if (selectedHabitId.value != null) {
    if (!newHabitName.value.trim()) {
      errorMessage.value = 'Enter new name of the habit!';
      return;
    }
    const habit = habitList.value.find((habit) => habit.id === selectedHabitId.value);
    if (habit) {
      habit.item = newHabitName.value;
    }
    saveHabits();
    newHabitName.value = '';
    selectedHabitId.value = null;
    showModalEdit.value = false;
  }
  selectedHabitId.value = null;
  return;
}

function stopHabit() {
  const habit = habitList.value.find((habit) => habit.id === selectedHabitId.value);
  if (habit) {
    habit.stoppedAt = currentDate.value;
    saveHabits();
  }
  selectedHabitId.value = null;
  showModalStop.value = false;
}
</script>

<template>
  <div class="habitListStyle">
    <div class="habitItemStyle">
      <TodoItem v-for="item in visibleHabits" :todo="item" :key="item.id"></TodoItem>
    </div>

    <div class="flex flex-col gap-2 justify-center mt-4">
      <button
        class="bg-orange-200 px-4 py-2 rounded-full shadow-sm hover:bg-orange-300 transition"
        @click="showModal = true"
      >
        ➕ Add Habit
      </button>

      <button
        class="bg-yellow-200 px-4 py-2 rounded-full shadow-sm hover:bg-yellow-300 transition"
        @click="showModalEdit = true"
      >
        ✏️ Edit
      </button>

      <button
        class="bg-red-200 px-4 py-2 rounded-full shadow-sm hover:bg-red-300 transition"
        @click="showModalDelete = true"
      >
        🗑️ Delete
      </button>

      <button
        class="bg-gray-200 px-4 py-2 rounded-full shadow-sm hover:bg-gray-300 transition"
        @click="showModalStop = true"
      >
        ⏹️ Stop
      </button>
    </div>

    <Modal v-if="showModal">
      <div class="smallerScreenSize">
        <h3>Add new Habit to the list!</h3>

        <ErrorMessage :message="errorMessage" />

        <input v-model="newHabitName" placeholder="Shower,read..." />

        <button class="buttonForAdd" @click="addHabit">Save</button>
        <button
          class="buttonForAdd"
          @click="
            showModal = false;
            errorMessage = '';
          "
        >
          Cancel
        </button>
      </div>
    </Modal>

    <ModalEdit v-if="showModalEdit" :habitList="habitList" :selectedHabitId="selectedHabitId">
      <div class="smallerScreenSize">
        <h3>Select habit you want to edit!</h3>

        <ul>
          <li v-for="habit in habitList.filter((habit) => !habit.stoppedAt)" :key="habit.id">
            <input type="radio" name="habitEdit" :value="habit.id" v-model="selectedHabitId" />
            {{ habit.item }}
          </li>
        </ul>

        <ErrorMessage :message="errorMessage" />

        <input v-model="newHabitName" placeholder="Shower,read..." />

        <button class="buttonForEdit" @click="editHabit">Edit</button>
        <button
          class="buttonForEdit"
          @click="
            showModalEdit = false;
            errorMessage = '';
          "
        >
          Cancel
        </button>
      </div>
    </ModalEdit>

    <ModalDelete v-if="showModalDelete" :habitList="habitList" :selectedHabitId="selectedHabitId">
      <h3>Select habit you want to delete</h3>

      <ul>
        <li v-for="habit in habitList" :key="habit.id">
          <input type="radio" name="habitEdit" :value="habit.id" v-model="selectedHabitId" />
          {{ habit.item }}
        </li>
      </ul>

      <button class="buttonForDelete" @click="deleteHabit">Delete</button>
      <button class="buttonForDelete" @click="showModalDelete = false">Cancel</button>
    </ModalDelete>

    <ModalStop v-if="showModalStop">
      <h3>Select habit you want to stop:</h3>

      <ul>
        <li v-for="habit in habitList.filter((habit) => !habit.stoppedAt)" :key="habit.id">
          <input type="radio" name="habitStop" :value="habit.id" v-model="selectedHabitId" />
          {{ habit.item }}
        </li>
      </ul>

      <button class="buttonForStop" @click="stopHabit">Stop</button>
      <button class="buttonForStop" @click="showModalStop = false">Cancel</button>
    </ModalStop>
  </div>
</template>

<style scoped>
.habitItemStyle {
  display: grid;
  margin-bottom: 1rem;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 460px) {
  .habitItemStyle {
    grid-template-columns: repeat(2, 1fr);
    justify-items: start;
  }
}
@media (max-width: 344px) {
  .smallerScreenSize {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
}
</style>
