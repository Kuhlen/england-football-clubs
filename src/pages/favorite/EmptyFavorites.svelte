<script lang="ts">
    interface Props {
        navigateToHome: () => void;
    }

    let { navigateToHome }: Props = $props();
</script>

<div class="text-center">
    <div class="empty-state pulse-animation mx-auto max-w-md rounded-3xl p-16">
        <div class="mb-6 text-6xl">💔</div>
        <h2 class="mb-4 text-2xl font-bold text-white">No Favorite Teams Yet</h2>
        <p class="mb-8 text-gray-400">Start exploring and add some teams to your favorites!</p>
        <button
            onclick={navigateToHome}
            class="transform rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 font-medium text-white transition-colors hover:scale-105 hover:from-blue-700 hover:to-purple-700"
        >
            Explore Teams
        </button>
    </div>
</div>

<style>
    .empty-state {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%);
        border: 2px dashed rgba(59, 130, 246, 0.3);
    }

    .pulse-animation {
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.5;
        }
    }
</style>
