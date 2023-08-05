<script setup lang="ts">
import { reactive } from 'vue';

import { Sheet, Signature } from '@/models/sheet.ts';
import { Context } from '@/models/context';
import SectionComponent from './Section.vue';

const props = defineProps({
  sheet: {
    type: Sheet,
    required: true
  },
  context: {
    type: Context,
    required: true
  }
});

function addSection() {
  props.sheet.push();
}
</script>

<template>
  <div>
    <h1>Title</h1>
    <div class="sections">
      <section-component
        v-for="section in props.sheet.sections"
        :section="section"
        :context="props.context"
      />
    </div>
    <div class="tools">
      <button @click="addSection()">Add section</button>
    </div>
  </div>
</template>

<style scoped></style>
