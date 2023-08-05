<script setup lang="ts">
import { ref } from 'vue';

import BarComponent from './Bar.vue';

import { Section } from '@/models/sheet';
import { Context } from '@/models/context';

const props = defineProps({
  section: {
    type: Section,
    required: true
  },
  context: {
    type: Context,
    required: true
  }
});

const editingName = ref(false);
</script>

<template>
  <div class="section">
    <h2>
      <input
        v-if="editingName"
        type="text"
        v-model="props.section.name"
        @change="editingName = false"
        @focusout="editingName = false"
      />
      <span v-else @click="editingName = true">{{ props.section.name }}</span>
    </h2>
    <div class="bars" :style="{ padding: `${context.pad}px ${context.pad}px` }">
      <bar-component v-for="bar in section.bars" :bar="bar" :context="props.context" />
    </div>
    <div class="tools">
      <button @click="section.push()">Add bar</button>
    </div>
  </div>
</template>

<style scoped>
.bars {
  border: 1px solid white;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
