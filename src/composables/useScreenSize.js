import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue'

export function useScreenSize() {

    const sidebarOpen = ref(true)
    const isMobile = ref(false)

    const handleResize = () => {

        if(window.innerWidth < 1024){
            sidebarOpen.value = false
            isMobile.value = true
        } else{
            sidebarOpen.value = true
            isMobile.value = false
        }
    }

    onBeforeMount(() => {
        handleResize()
    })

    onMounted(() => {
        window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize)
    })

    return { isMobile, sidebarOpen }

}

