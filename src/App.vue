<template>
  <div class="container mx-auto h-full sm:justify-centerN">
    <template v-if="state.quizState==0">
      <p class="pt-32 sm:pt-48 mb-14 text-6xl sm:text-7xl text-green-500 font-semibold text-center font-KoHo italic">Quick Quiz</p>

      <div class="w-10/12 sm:w-80 mx-auto">      
        <Dropdown :items="categories" />
        <Dropdown :items="difficulties" />

        <button @click="play" :disabled="state.buttonLoading" class="w-full px-6 py-4" :class="[!state.buttonLoading ? 'btn' : 'btn-loading']">
          <span v-if="!state.buttonLoading">Play</span>
          <span v-else>Loading...</span>
        </button>
      </div>
    </template>
    <template v-else-if="state.quizState==1">
      <Quiz :quizzes="state.quizzes" @submit="gotoResult" />
    </template>
    <template v-else-if="state.quizState==2">
      <Result :result="state.result" @gotoHome="gotoHome" @playAgain="playAgain" />
    </template>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'

import { useSettings } from './composables/settings'

import Dropdown from './components/Dropdown.vue'
import Quiz from './components/Quiz.vue'
import Result from './components/Result.vue'

const state = reactive({
  quizState: 0,
  buttonLoading: false,
  quizzes: [],
  result: {}
})

const { 
  categories, selectedCategory,
  difficulties, selectedDifficulty
} = useSettings()

async function play() {
  state.buttonLoading = true
  try {
    let category = ''
    if (selectedCategory.value.id != 'any')
      category = '&category='+selectedCategory.value.id

    let difficulty = ''
    if (selectedDifficulty.value.id != 'any')
      difficulty = '&difficulty='+selectedDifficulty.value.id

    const response = await axios.get('https://opentdb.com/api.php?amount=10&encode=base64'+category+difficulty)
    state.quizzes = response.data.results

    state.quizState = 1
    state.buttonLoading = false
  }
  catch (error) {
    console.log(error)
  }
}

function gotoResult(obj) {
  state.quizState = 2
  state.result = obj
}

function gotoHome() {
  state.quizState = 0
}

function playAgain() {
  state.quizState = 1
}
</script>

<style lang="postcss">
@import url('https://fonts.googleapis.com/css2?family=KoHo:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

.btn {
  @apply block font-medium leading-6 text-center text-white uppercase transition bg-green-500 rounded shadow hover:shadow-lg hover:bg-green-600 focus:outline-none;
}

.btn-loading {
  @apply block font-medium leading-6 text-center text-white uppercase transition bg-green-200 rounded shadow hover:shadow-lg focus:outline-none;
}
</style>
