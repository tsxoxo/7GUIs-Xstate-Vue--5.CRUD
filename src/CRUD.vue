<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { crudMachine } from './crudMachine'
import { createBrowserInspector } from '@statelyai/inspect'

const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(crudMachine, {
  inspect
})
</script>

<template>
  <div class="frame center-children">
    <main>
      <select id="people" name="people" size="10">

        <option v-for="person in snapshot.context.people"> {{ person.surname }}, {{ person.name }} </option>
      </select>
      <p>{{ snapshot.context.people }}</p>
      <button @click="send({ type: 'increase' })">
      </button>
    </main>
  </div>
</template>

<style scoped></style>
