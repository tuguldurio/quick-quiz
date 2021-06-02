<template>
  <div class="pt-20 flex flex-col items-center">
    
    <div class="w-44 h-44 stamp uppercase text-9xl font-bold border-8 border-double rounded-full flex items-center justify-center"
      :class="{
        'text-green-500 border-green-500 transform rotate-6': grade=='A',
        'text-green-400 border-green-400 transform -rotate-12': grade=='B',
        'text-yellow-300 border-yellow-300 transform -rotate-12': grade=='C',
        'text-yellow-500 border-yellow-500 transform rotate-12': grade=='D',
        'text-red-500  border-red-500 transform -rotate-12': grade=='F',
      }"
    >
      {{grade}}
    </div>

    <div class="mt-4 mb-8 text-center">
      <div class="text-4xl font-KoHo">
        <span>Your score: </span>
        <span class="text-6xl" 
          :class="{
            'text-green-500': grade=='A',
            'text-green-400': grade=='B',
            'text-yellow-300': grade=='C',
            'text-yellow-500': grade=='D',
            'text-red-500': grade=='F',
          }"
        >{{ props.result.corrects }}</span>
        <span>/10</span>
      </div>
      <div class="mt-4 flex flex-col space-y-1">
        <p>{{ selectedCategory.name }}</p>
        <p>{{ selectedDifficulty.name }}</p>
      </div>
    </div>
    
    <div class="flex space-x-6">
      <button @click="gotoHome" class="btn px-4 py-2">Home</button>
      <button @click="playAgain" class="btn px-4 py-2">Play Again</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmit, computed } from 'vue'

import { useSettings } from '../composables/settings'

const props = defineProps({
  result: Object
})

const emit = defineEmit()

const { 
  selectedCategory,
  selectedDifficulty
} = useSettings()

const grade = computed(() => {
  if (props.result.corrects < 6) {
    return 'F'
  }
  else if (props.result.corrects < 7) {
    return 'D'
  }
  else if (props.result.corrects < 8) {
    return 'C'
  }
  else if (props.result.corrects < 9) {
    return 'B'
  }
  else {
    return 'A'
  }
})

function gotoHome() {
  emit('gotoHome')
}

function playAgain() {
  emit('playAgain')
}
</script>

<style scoped lang="postcss">
.stamp {
	font-family: 'Courier';
	-webkit-mask-image: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/8399/grunge.png');
  -webkit-mask-size: 944px 604px;
  mix-blend-mode: multiply;
}
</style>