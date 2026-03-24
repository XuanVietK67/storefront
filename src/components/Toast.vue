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
      class="fixed top-[62px] left-1/2 -translate-x-1/2 font-dm font-semibold text-[13px] tracking-normal text-white px-4 py-[7px] rounded-[8px] z-[9999] whitespace-nowrap pointer-events-none"
      style="background: #1a1a1a; box-shadow: 0 4px 16px rgba(0,0,0,0.20), 0 2px 6px rgba(0,0,0,0.12);"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { message, visible } = useToast()
</script>
