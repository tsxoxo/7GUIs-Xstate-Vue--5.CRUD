<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { crudMachine } from './crudMachine'
import { createBrowserInspector } from '@statelyai/inspect'
import { computed, ref, watch } from 'vue'

const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(crudMachine, {
  inspect
})

const selectedID = ref(0)
const filter = ref('')
const surname = ref('')
const name = ref('')

watch(selectedID, newID => {
  surname.value = snapshot.value.context.people[newID].surname
  name.value = snapshot.value.context.people[newID].name
})

const filteredNames = computed(
  () => {
    return snapshot.value.context.people.filter((person) => person.surname.toLowerCase().startsWith(filter.value.toLowerCase()))
  }
)
</script>

<template>
  <div class="frame center-children">
    <main>
      <div id="filter-prefix">
        <label>
          Filter prefix:
          <input v-model="filter" type="text" name="filter" />
        </label>
      </div>
      <div id="names-list">
        <select v-model="selectedID" id="people" name="people" size="10">
          <option v-for="(person, index) in filteredNames" :value="index"> {{ person.surname }}, {{
            person.name }} </option>
        </select>
      </div>
      <div id="names-edit-fields">
        <label>
          Surname:
          <input v-model="surname" type="text" name="surname" />
        </label>
        <label>
          Name:
          <input v-model="name" type="text" name="name" />
        </label>
      </div>

      <div id="buttons">
        <button @click="send({ type: 'CREATE', person: { surname, name } })">
          Create
        </button>
        <button @click="send({ type: 'UPDATE', id: selectedID, person: { surname, name } })">
          Update
        </button>
        <button @click="send({ type: 'DELETE' })">
          Delete
        </button>
      </div>
    </main>
  </div>
</template>

<style scoped>
main {
  padding: 32px;
  display: grid;
  height: 360px;
  grid-template-rows: min-content 1fr min-content;
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "fp ."
    "nl nef"
    "b b"
}

select {
  width: 100%;
}

* {
  font-size: 18px;

  padding: 3px;
}

#filter-prefix {
  grid-area: fp;
}

#names-list {
  grid-area: nl;
}

#names-edit-fields {
  grid-area: nef;
}

#buttons {
  grid-area: b;
  display: flex;
  gap: 32px;
}
</style>