<template>
    <router-link
        v-if="props.item.haschildren === false"
        :to="props.item.url"
        :active-class="props.activeClass"
    >
        <font-awesome-icon :icon="props.item.icon" class="w-8 -ml-2.5" />
        <span class="flex-auto">{{ props.item.text }}</span>
        <span
            v-if="props.item.badge"
            :class="[(props.item.badge.style !== '') ? props.item.badge.style : 'bg-white bg-opacity-10']"
            class="flex items-center justify-center text-[11px] px-1.5 rounded-sm h-[20px] leading-[20px] shadow-sm"
        >
            {{ props.item.badge.text }}
        </span>
    </router-link>
    <button
        v-else
        type="button"
        :class="[(props.item.open) ? props.activeClass : '']"
    >
        <font-awesome-icon :icon="props.item.icon" class="w-8 -ml-2.5" />
        <span class="flex-auto">{{ props.item.text }}</span>
        <font-awesome-icon
            v-if="props.item.haschildren === true"
            icon="fa-solid fa-angle-right"
            :class="props.item.open ? 'rotate-90 transform' : ''"
            class="text-white duration-200"
        />
    </button>
</template>

<script setup>
const props = defineProps(['item', 'activeClass'])
</script>
