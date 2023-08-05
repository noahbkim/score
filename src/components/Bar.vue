<script setup lang="ts">
import { computed, reactive } from 'vue';

import { Bar } from '@/models/sheet';
import { Context } from '@/models/context';
import * as svg from '../../old/svg';

const props = defineProps({
  bar: {
    type: Bar,
    required: true
  },
  context: {
    type: Context,
    required: true
  }
});

const width = computed(() =>
  props.bar && props.context ? props.bar.signature.count * props.context.dx : 0
);
const height = computed(() =>
  props.bar && props.context ? (props.bar.lines - 1) * props.context.dy + 1 : 0
);
const pad = computed(() => (props.context ? props.context.pad : 0));

const placeholder = reactive({
  x: 0,
  y: 0,
  visible: false
});

function onMouseMove(event: MouseEvent): void {
  if (props.bar && props.context) {
    const x = Math.floor((event.offsetX - props.context.pad / 2) / props.context.dx + 0.5);
    const y = Math.floor((event.offsetY - props.context.pad / 2) / props.context.dy + 0.5);
    if (0 <= x && x < props.bar.signature.count && 0 <= y && y < props.bar.lines) {
      placeholder.x = x;
      placeholder.y = y;
      placeholder.visible = true;
    } else {
      placeholder.visible = false;
    }
  }
}

function onMouseOut(event: MouseEvent): void {
  // TODO: check if parent more efficiently
  let cursor = event.relatedTarget as HTMLElement;
  while (cursor && cursor != document.body) {
    if (cursor == event.target) {
      return;
    }
    cursor = cursor.parentElement;
  }
  placeholder.visible = false;
}
</script>

<template>
  <div class="bar">
    <svg
      v-if="props.bar && props.context"
      :width="width + pad"
      :height="height + pad"
      :viewBox="`-${pad / 2} -${pad / 2} ${width + pad} ${height + pad}`"
      :style="{ margin: `0 -${pad / 2}px` }"
      @mousemove.passive.self="onMouseMove"
      @mouseout.passive.self="onMouseOut"
    >
      <rect
        v-for="(_, i) in props.bar.lines"
        x="0"
        :y="i * props.context.dy"
        :width="width"
        height="1"
        :fill="i == 0 || i == props.bar.lines - 1 ? '#888' : '#555'"
      />
      <template v-for="(_, i) in props.bar.signature.beats">
        <rect
          :x="i * props.bar.signature.subdivisions * props.context.dx"
          y="0"
          :width="i == 0 ? 2 : 1"
          :height="height"
          fill="white"
        />
        <rect
          v-for="j in props.bar.signature.subdivisions - 1"
          :x="(i * props.bar.signature.subdivisions + j) * props.context.dx"
          y="0"
          width="1"
          :height="height"
          fill="#888"
        />
      </template>
      <circle
        v-show="placeholder.visible"
        :cx="placeholder.x * context.dx"
        :cy="placeholder.y * context.dy"
        :r="context.pad * 0.4"
        fill="rgba(0, 127, 255, 0.5)"
        class="placeholder"
      />
    </svg>
  </div>
</template>

<style scoped>
.bar {
  display: flex;
}

.placeholder {
  cursor: pointer;
}
</style>
