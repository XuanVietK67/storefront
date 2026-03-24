import { ref } from 'vue'

const message = ref<string>('')
const visible = ref<boolean>(false)
let timer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
  function showToast(msg: string): void {
    message.value = msg
    visible.value = true
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => { visible.value = false }, 2200)
  }

  return { message, visible, showToast }
}
