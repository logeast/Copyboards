<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const p = ref(null)

let id = 0
const newTodo = ref('')
const todos = ref([
    { id: id++, text: 'Learn HTML', done: true },
    { id: id++, text: 'Learn CSS', done: true },
    { id: id++, text: 'Learn JavaScript', done: false }
])

const filteredTodos = computed(() => {
    return hideCompleted.value ? todos.value.filter((t) => !t.done) : todos.value
})

const hideCompleted = ref(false)

function addTodo() {
    newTodo.value && todos.value.unshift({ id: id++, text: newTodo.value, done: false })
    newTodo.value = ''
}

function removeTodo(todo: any) {
    todos.value = todos.value.filter((val) => val !== todo)
}

onMounted(() => {
    p.value.textContent = 'mounted!'
})

</script>

<template>
    <div>
        <p ref="p"></p>
        <form @submit.prevent="addTodo">
            <input type="text" v-model="newTodo">
            <button>Add Todo</button>
        </form>
        <ul>
            <li v-for="todo in filteredTodos" :key="todo.id">
                <input type="checkbox" v-model="todo.done">
                <span :class="{ 'line-through': todo.done }">{{ todo.text }}</span>
                <button @click="removeTodo(todo)">x</button>
            </li>
        </ul>
        <button @click="hideCompleted = !hideCompleted">
            {{ hideCompleted ? 'Show all' : 'Hide completed' }}
        </button>
    </div>
</template>
