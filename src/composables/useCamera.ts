import { ref } from 'vue'

const cameraOpen = ref(false)

function openCamera() {
  cameraOpen.value = true
}

export function useCamera() {
  return { cameraOpen, openCamera }
}
