<script lang="ts">
    interface Props {
        icon?: string;
        title?: string;
        message?: string;
    }

    let { icon = "🔍", title = "Not Found", message = "The requested item could not be found." }: Props = $props();
</script>

<div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
        <div class="mb-4 text-6xl text-gray-500">{icon}</div>
        <h2 class="mb-4 text-2xl font-bold text-white">{title}</h2>
        <p class="text-gray-400">{message}</p>
    </div>
</div>
