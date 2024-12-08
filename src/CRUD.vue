<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { crudMachine } from './crudMachine'
import { createBrowserInspector } from '@statelyai/inspect'
import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'
import type { Person } from './types'

const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(crudMachine, {
  inspect
})

const selectedPerson: Ref<"deselected" | Person> = ref("deselected")

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
    (surname.value.trim() !== "" && name.value.trim() !== "") ? true : false
)
const haveNamesChanged = () => (((selectedPerson.value as Person).surname !== surname.value || (selectedPerson.value as Person).name !== name.value) ? true : false)

watch(() => snapshot.value.context.people, () =>
  selectedPerson.value = "deselected"
)
watch(selectedPerson, newValue => {
  if (selectedPerson.value === "deselected") {
    surname.value = ""
    name.value = ""
    return
  }

  surname.value = (newValue as Person)!.surname
  name.value = (newValue as Person).name
})
</script>

<template>
  <main>
    <div id="inputs-and-display">
      <div id="filter">
        <label>
          Filter prefix
          <input v-model="filter" type="text" name="filter" />
        </label>
      </div>
      <select v-model="selectedPerson" id="display" name="people" size="9">
        <!-- <option disabled value=""deselected"">Please select one</option> -->
        <option v-for="(person) in filteredNames" :value="person"> {{ person.surname }}, {{
          person.name }} </option>
      </select>
      <div id="surname-and-name">
        <label>
          Surname
          <input v-model.trim="surname" type="text" name="surname" />
        </label>
        <label>
          Name
          <input v-model.trim="name" type="text" name="name" />
        </label>
      </div>
    </div>

    <div id="buttons">
      <div id="create-and-update">
        <button id="button-create" :disabled="!isValidPersonNaming" @click="send({ type: 'CREATE', surname, name })">
          Create
        </button>
        <button id="button-update"
          :disabled="!isValidPersonNaming || selectedPerson === 'deselected' || !haveNamesChanged()"
          @click="send({ type: 'UPDATE', id: (selectedPerson as Person).id, surname, name })">
          Update
        </button>
      </div>
      <button id="button-delete" :disabled="selectedPerson === 'deselected'"
        @click="send({ type: 'DELETE', id: (selectedPerson as Person).id })">
        Del
      </button>
    </div>
  </main>
</template>

<!-- TODO
* add fonts
* add shadows
* check states: disabled -- focused, etc.  
-->