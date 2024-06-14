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

const selectedPerson = ref("deselected")
const filter = ref('')
const filteredNames = computed(
  () => {
    return snapshot.value.context.people.filter((person) => person.surname.toLowerCase().startsWith(filter.value.toLowerCase()))
  }
)
const surname = ref('')
const name = ref('')
const isValidPersonNaming = computed(
  () =>
    (surname.value.trim() !== "" && name.value.trim() !== "") ? true : false)
watch(() => snapshot.value.context.people, () =>
  selectedPerson.value = "deselected"
)
watch(selectedPerson, newValue => {
  if (selectedPerson.value === "deselected") {
    surname.value = ""
    name.value = ""
    return
  }

  surname.value = newValue.surname
  name.value = newValue.name
})
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
        <select v-model="selectedPerson" id="people" name="people" size="10">
          <!-- <option disabled value=""deselected"">Please select one</option> -->
          <option v-for="(person) in filteredNames" :value="person"> {{ person.surname }}, {{
            person.name }} </option>
        </select>
      </div>
      <div id="names-edit-fields">
        <label>
          Surname:
          <input v-model.trim="surname" type="text" name="surname" />
        </label>
        <label>
          Name:
          <input v-model.trim="name" type="text" name="name" />
        </label>
      </div>

      <div id="buttons">
        <button :disabled="!isValidPersonNaming" @click="send({ type: 'CREATE', surname, name })">
          Create
        </button>
        <button :disabled="!isValidPersonNaming || selectedPerson === ' deselected'"
          @click="send({ type: 'UPDATE', id: selectedPerson.id, surname, name })">
          Update
        </button>
        <button :disabled="selectedPerson === ' deselected'" @click="send({ type: 'DELETE', id: selectedPerson.id })">
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