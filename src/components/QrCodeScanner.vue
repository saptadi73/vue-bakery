<template>
  <div class="scanner-container flex flex-col items-center py-8 px-4 max-w-2xl mx-auto">
    <h2 class="text-3xl font-bold text-white mb-6">QR Code Scanner</h2>

    <!-- Kamera -->
    <div
      v-if="isCameraOpen"
      class="camera-wrapper relative w-full max-w-lg h-80 overflow-hidden rounded-lg shadow-lg"
    >
      <video
        ref="videoElement"
        autoplay
        playsinline
        class="camera-feed w-full h-full object-cover bg-black"
      ></video>
      <canvas ref="canvasElement" class="hidden"></canvas>

      <!-- Overlay untuk area scan -->
      <div class="scan-overlay absolute top-0 left-0 w-full h-full pointer-events-none">
        <div
          class="scan-frame absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-48 border-4 border-green-400 rounded-lg shadow-2xl"
        ></div>
        <div
          class="scan-line absolute left-1/4 w-1/2 h-1 bg-red-500"
          :style="{ top: linePosition + 'px' }"
        ></div>
      </div>
    </div>

    <!-- Kontrol Kamera -->
    <div class="controls flex gap-4 mt-8">
      <button
        @click="toggleCamera"
        class="btn bg-green-500 hover:bg-green-400 text-white py-2 px-6 rounded-lg transition-all duration-200"
      >
        {{ isCameraOpen ? 'Stop Scanner' : 'Start Scanner' }}
      </button>
      <button
        v-if="isCameraOpen"
        @click="switchCamera"
        class="btn bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-lg transition-all duration-200"
      >
        Switch Camera
      </button>
    </div>

    <!-- Hasil Scan -->
    <div
      v-if="result"
      class="result-box mt-8 py-4 px-8 bg-blue-50 border-2 border-blue-200 rounded-lg text-center"
    >
      <p class="text-lg text-blue-700">Scanned Result:</p>
      <p class="result-text mt-4 font-semibold text-blue-600">{{ result }}</p>
    </div>

    <!-- Debug Info -->
    <div v-if="debugInfo" class="debug-info mt-6 text-red-600 text-sm">
      <p>{{ debugInfo }}</p>
    </div>

    <!-- Modal Card for Profile -->
  </div>
</template>

<script>
import { ref, onUnmounted } from 'vue'
import jsQR from 'jsqr'

export default {
  setup() {
    const videoElement = ref(null)
    const canvasElement = ref(null)
    const isCameraOpen = ref(false)
    const result = ref('')
    const debugInfo = ref('')
    const linePosition = ref(0)
    const stream = ref(null)
    const animationFrame = ref(null)
    const facingMode = ref('environment') // 'environment' (belakang) atau 'user' (depan)

    // Dapatkan akses ke kamera
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: facingMode.value,
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        }

        stream.value = await navigator.mediaDevices.getUserMedia(constraints)

        if (videoElement.value) {
          videoElement.value.srcObject = stream.value
          await videoElement.value.play()
          scanQRCode() // Mulai proses scanning
          animateScanLine() // Animasi garis scan
        }
      } catch (err) {
        handleCameraError(err)
      }
    }

    // Proses scanning QR code
    const scanQRCode = () => {
      if (!videoElement.value || !canvasElement.value || !isCameraOpen.value) return

      const video = videoElement.value
      const canvas = canvasElement.value
      const context = canvas.getContext('2d')

      // Set the willReadFrequently attribute for better performance on frequent readbacks
      context.willReadFrequently = true

      // Reduce canvas size to improve performance (you can adjust the size)
      const scaleFactor = 0.5 // Scale the canvas down to half the size

      const scaledWidth = video.videoWidth * scaleFactor
      const scaledHeight = video.videoHeight * scaleFactor

      canvas.width = scaledWidth
      canvas.height = scaledHeight

      context.clearRect(0, 0, canvas.width, canvas.height)

      // Draw the current video frame to the smaller canvas
      context.drawImage(video, 0, 0, scaledWidth, scaledHeight)

      // Get image data only once per frame
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // Process the image data with jsQR
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      })

      if (code) {
        // If QR code is detected, display the result
        result.value = code.data
        debugInfo.value = `QR Code detected!`
      }

      // Continue scanning only if camera is still open
      if (isCameraOpen.value) {
        animationFrame.value = requestAnimationFrame(scanQRCode)
      }
    }

    // Animasi garis scan
    const animateScanLine = () => {
      if (!isCameraOpen.value) return

      const video = videoElement.value
      if (!video) return

      // Reset posisi jika melewati batas
      if (linePosition.value > video.videoHeight) {
        linePosition.value = 0
      } else {
        linePosition.value += 2
      }

      requestAnimationFrame(animateScanLine)
    }

    // Tangani error kamera
    const handleCameraError = (error) => {
      console.error('Camera error:', error)
      debugInfo.value = `Error: ${error.name || error.message}`

      switch (error.name) {
        case 'NotAllowedError':
          debugInfo.value = 'Error: Camera access denied. Please allow camera permission.'
          break
        case 'NotFoundError':
          debugInfo.value = 'Error: No camera device found.'
          break
        case 'NotReadableError':
          debugInfo.value = 'Error: Camera is already in use.'
          break
        case 'OverconstrainedError':
          debugInfo.value = 'Error: Camera constraints could not be satisfied.'
          break
        default:
          debugInfo.value = `Error: ${error.message}`
      }
    }

    // Bersihkan stream kamera
    const stopCamera = () => {
      if (stream.value) {
        stream.value.getTracks().forEach((track) => track.stop())
        stream.value = null
      }
      if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value)
      }
    }

    // Toggle kamera
    const toggleCamera = () => {
      if (isCameraOpen.value) {
        stopCamera()
        result.value = ''
        debugInfo.value = ''
      } else {
        startCamera()
      }
      isCameraOpen.value = !isCameraOpen.value
    }

    // Ganti kamera (depan/belakang)
    const switchCamera = () => {
      facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
      stopCamera()
      startCamera()
    }

    // Pastikan kamera dimatikan saat komponen di-unmount
    onUnmounted(() => {
      stopCamera()
    })

    return {
      videoElement,
      canvasElement,
      isCameraOpen,
      result,
      debugInfo,
      linePosition,
      toggleCamera,
      switchCamera,
    }
  },
}
</script>
