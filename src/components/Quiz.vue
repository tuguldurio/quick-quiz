<template>
  <div class="flex flex-col pt-12 sm:pt-12 px-6">
    
    <div class="overflow-hidden h-2 mb-2 text-xs flex rounded bg-green-200">
      <div :style="{width: `${(state.ghostRound)*10}%`}" class="transition-all ease-out duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-400"></div>
    </div>


    <p class="text-2xl font-KoHo">
      <transition name="fade" mode="out-in">
        <span :key="state.round" class="text-green-500 text-4xl font-semibold">{{state.round+1}}</span> 
      </transition>
      <span>/10</span>
    </p>

    <transition name="slide" mode="out-in">
      <div :key="state.round" class="flex flex-col my-8 flex-grow">
        <p class="text-4xl font-normal font-KoHo">{{currentQuestion}}</p>
      </div>
    </transition>

    <div class="w-full mb-8">
      <transition name="slide" mode="out-in">
        <div :key="state.round">
          <p class="font-light pb-4">{{decode(currentQuiz.category)}} ∙ {{decode(currentQuiz.difficulty)}}</p>
          <div class="flex flex-col space-y-4">
            <div v-for="answer in answers" :key="answer" @click="checkAnswer(answer.item)"
              class="w-full transition rounded-md p-4 select-none shadow"
              :class="answer.class"
            >
              {{answer.item}}
            </div>
          </div>
        </div>
      </transition>
    </div>
    
  </div>
</template>

<script setup>
import { reactive, defineProps, defineEmit, watch, computed, onBeforeMount } from 'vue'

const props = defineProps({
  quizzes: Array
})
const emit = defineEmit()

const state = reactive({
  round: null,
  ghostRound: null,
  chosenAnswer: null,
  onAnimationWait: false,
  corrects: 0,
  answers: [],
})

onBeforeMount(() => {
  state.round = 0
  state.ghostRound = 0
})

const currentQuiz = computed(() => {
  return props.quizzes[state.round]
})

const currentQuestion = computed(() => {
  return atob(props.quizzes[state.round].question)
})

watch(() => state.round, (round, _) => {
  console.log(atob(currentQuiz.value.correct_answer))
  let tempAnswers = [
    atob(currentQuiz.value.correct_answer), 
    ...(currentQuiz.value.incorrect_answers.map(answer => atob(answer)))
  ]
  shuffle(tempAnswers)
  state.answers = tempAnswers
})

const chosenIsCorrect = computed(() => {
  if (state.chosenAnswer == atob(currentQuiz.value.correct_answer)) {
    return true
  }
  return false
})

function checkAnswer(answer) {
  if (!state.onAnimationWait) {
    state.chosenAnswer = answer
    if (state.chosenAnswer === atob(currentQuiz.value.correct_answer)) {
      state.corrects += 1
    }

    state.onAnimationWait = true
    state.ghostRound += 1
    setTimeout(() => nextRound(), 1000)
  }
}

function nextRound() {
  if (state.round+1 < 10) {
    state.chosenAnswer = null
    state.round += 1
    setTimeout(() => {  state.onAnimationWait = false}, 400)
  }
  else {
    setTimeout(() => {
      emit('submit', { corrects: state.corrects })
    }, 500)
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function decode(input) {
  return atob(input)
}

const answers = computed(() => {
  return state.answers.map(item => {
    let classNames = []
    const greenBg = 'text-white font-semibold bg-green-400'
    const grayTpntBg = 'bg-gray-100'

    // if user choose any answer
    if (state.chosenAnswer!=null)
      if (item==state.chosenAnswer) {
        if (chosenIsCorrect.value)
          classNames = [greenBg]
        else
          classNames = ['text-white font-semibold bg-red-500 border-red-500']
      }
      else {
        // show correct answer when user answered wrong
        if (item==atob(currentQuiz.value.correct_answer))
          classNames = [greenBg]
        else
          classNames = [grayTpntBg]
      }
    else {
      classNames = [grayTpntBg, 'text-gray-800 hover:text-green-900 hover:bg-green-100 cursor-pointer']
    }

    return { item, class: classNames }
  })
})
</script>

<style scoped lang="postcss">
.slide-enter-active {
  @apply transition ease-out duration-200;
}

.slide-enter-from {
  @apply transform translate-x-full opacity-0;
}

.slide-leave-active {
  @apply transition ease-out duration-200;
}

.slide-leave-to {
  @apply transform -translate-x-full opacity-0;
}


.fade-enter-active {
  @apply transition ease-out duration-200;
}
.fade-enter-from {
  @apply opacity-80; 
}
.fade-enter-to {
  @apply opacity-100
}
.fade-leave-active {
  @apply transition ease-out duration-200;
}
.fade-leave-from {
  @apply opacity-100;
}
.fade-leave-to {
  @apply opacity-80;
}
</style>
