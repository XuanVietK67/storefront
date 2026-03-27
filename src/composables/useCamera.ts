import { ref } from 'vue'

const cameraOpen = ref(false)

export function useCamera() {
  return { cameraOpen }
}
