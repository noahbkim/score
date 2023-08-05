<script setup lang="ts">
import { reactive } from 'vue';

import SheetComponent from '@/components/Sheet.vue';

import { Context } from '@/models/context';
import { Sheet, Signature } from '@/models/sheet';

const context = reactive(new Context(30, 30));
const sheet = reactive(new Sheet(new Signature(4, 2)));
</script>

<template>
  <div>
    <sheet-component :context="context" :sheet="sheet" />
  </div>
</template>

<style scoped></style>
