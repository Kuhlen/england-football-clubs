<script lang="ts">
    import type { TeamDetail } from "../../types/team.type";

    interface Props {
        favoriteTeams: TeamDetail[];
        openClearAllModal: () => void;
    }

    let { favoriteTeams, openClearAllModal }: Props = $props();
</script>

<section class="bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pt-24 pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="mb-12 text-center">
            <div class="mb-6 flex justify-center">
                <div
                    class="star-shine flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-red-500 to-pink-500"
                >
                    <i class="fas fa-heart text-3xl text-white"></i>
                </div>
            </div>
            <h1
                class="mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
            >
                My Favorites
            </h1>
            <p class="mx-auto mb-8 max-w-3xl text-xl text-gray-300">
                Your personally curated collection of the England's greatest football clubs. Keep track of your beloved
                teams all in one place.
            </p>
        </div>

        <!-- Clear All Favorites Button -->
        {#if favoriteTeams.length > 0}
            <div class="mb-8 flex flex-wrap justify-center gap-4">
                <button
                    onclick={openClearAllModal}
                    class="transform rounded-2xl bg-gray-700 px-8 py-3 font-medium text-gray-300 transition-all duration-300 hover:scale-105 hover:bg-red-600 hover:text-white"
                >
                    <i class="fas fa-trash mr-2"></i>Clear All
                </button>
            </div>
        {/if}
    </div>
</section>

<style>
    .star-shine {
        position: relative;
        overflow: hidden;
    }

    .star-shine::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    .star-shine:hover::before {
        left: 100%;
    }
</style>
