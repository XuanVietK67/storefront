<template>
  <Transition
    enter-active-class="transition-all duration-[200ms] ease-out"
    enter-from-class="opacity-0 scale-90 -translate-y-1"
    enter-to-class="opacity-100 scale-100 translate-y-0"
    leave-active-class="transition-all duration-[180ms] ease-in"
    leave-from-class="opacity-100 scale-100 translate-y-0"
    leave-to-class="opacity-0 scale-90 -translate-y-1"
  >
    <div
      v-if="visible"
      class="fixed top-[62px] left-1/2 -translate-x-1/2 font-syne font-bold text-[12px] tracking-wide text-app px-4 py-[7px] rounded-[30px] z-[9999] whitespace-nowrap pointer-events-none"
      style="background: linear-gradient(135deg, #f7d44c, #e8a800); box-shadow: 0 4px 24px rgba(245,200,66,0.5), 0 2px 8px rgba(0,0,0,0.4);"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { message, visible } = useToast()
</script>
