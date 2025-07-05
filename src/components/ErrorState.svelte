<script lang="ts">
    interface Props {
        error: string;
        title?: string;
        icon?: string;
        onRetry?: () => void;
        retryText?: string;
    }

    let { error, title = "Error", icon = "⚠️", onRetry, retryText = "Try Again" }: Props = $props();
</script>

<div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
        <div class="mb-4 text-6xl text-red-500">{icon}</div>
        <h2 class="mb-4 text-2xl font-bold text-white">{title}</h2>
        <p class="mb-6 text-gray-400">{error}</p>

        {#if onRetry}
            <button
                onclick={onRetry}
                class="rounded-xl border border-red-500/30 bg-red-600/20 px-6 py-3 font-medium text-red-400 transition-colors hover:bg-red-600/30"
            >
                {retryText}
            </button>
        {/if}
    </div>
</div>
