<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { counterMachine } from './counterMachine';
import { createBrowserInspector } from '@statelyai/inspect';

const { inspect } = createBrowserInspector({
  // Comment out the line below to start the inspector
  autoStart: false
});

const { snapshot, send } = useMachine(counterMachine, {
  inspect
})
</script>

<template>
  <div class="frame center-children">
    <main>
      <p>{{ snapshot.context.count }}</p>
      <button @click="send({ type: 'increase' })">
      </button>
    </main>
  </div>
</template>

<style scoped>
.frame {
  display: flex;
width: 236px;
height: 474px;
padding: 16px 20px 64px 20px;
flex-direction: column;
align-items: center;
flex-shrink: 0;
  border-radius: 8px 8px 32px 32px;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.00) 96.31%, rgba(230, 233, 218, 0.20) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0.00) 94.83%, rgba(72, 75, 56, 0.10) 100%), #AAB397;
  box-shadow: -5px 2px 4.6px 0px rgba(80, 83, 64, 0.50), 5px 2px 4.6px 0px rgba(80, 83, 64, 0.50), 0px 16px 4.6px -6px rgba(80, 83, 64, 0.50);
}

main {
  display: flex;
padding: 32px 0px 0px;
flex-direction: column;
align-items: center;
gap: 40px;
flex: 1 0 0;
align-self: stretch;

  border-radius: 8px 8px 32px 32px;
  background: #484B38;
  box-shadow: 0px -6px 2px 0px hsla(72, 25%, 88%, 0.85) inset, 6px 4px 4px 0px rgba(20, 19, 11, 0.25) inset, -6px 4px 4px 0px rgba(20, 19, 11, 0.25) inset;
}

p {
  display: flex;
  width: 140px;
  height: 140px;

  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  background: #E6E9DA;
  box-shadow: 1px 4px 4px 0px rgba(51, 57, 40, 0.70), 1px 13px 1px 0px rgba(48, 55, 36, 0.25) inset, 0px 0px 0px 10px #7A8663 inset, 1px -27px 1px -11px rgba(244, 246, 237, 0.90) inset;
  color: #0B0B09;
  font-family: "Averia Libre", Tahoma, Verdana, Geneva, sans-serif;;
  font-size: 66px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}

button {
  border: 0;
  padding: 0;
  width: 140px;
  height: 140px;
  border-radius: 9999px;
  background: #2F3025;
  box-shadow: 0px 10px 1px 2px rgba(20, 19, 11, 0.85), 0px -8px 4px -3px rgba(25, 25, 15, 0.50) inset, 0px 1px 4px -1px rgba(230, 233, 218, 0.40) inset;
}

button:active {
  transform: translateY(10px) ;
  box-shadow: 0px 1px 1px 2px rgba(20, 19, 11, 0.85), 0px -7px 4px -3px rgba(25, 25, 15, 0.50) inset, 0px 3px 4px -1px rgba(230, 233, 218, 0.30) inset;
}
</style>
