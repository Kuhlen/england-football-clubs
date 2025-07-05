<script lang="ts">
    import type { TeamDetail } from "../../types/team.type";
    import FavoriteButton from "../../components/FavoriteButton.svelte";

    interface Props {
        team: TeamDetail;
        isFavorited: boolean;
        toggleFavorite: () => void;
    }

    let { team, isFavorited, toggleFavorite }: Props = $props();
</script>

<section class="bg-gradient-to-br from-gray-900 via-red-900/20 to-purple-900/20 pt-24 pb-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center gap-12 lg:flex-row">
            <div class="text-center lg:text-left">
                <div
                    class="club-logo glow-effect mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-3xl lg:mx-0"
                >
                    {#if team.crestUrl}
                        <img src={team.crestUrl} alt={team.name} class="h-full w-full rounded-3xl object-cover" />
                    {:else}
                        <span class="text-4xl font-bold text-white">{team.tla}</span>
                    {/if}
                </div>

                <h1
                    class="mb-4 bg-gradient-to-r from-white via-red-200 to-purple-200 bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
                >
                    {team.name}
                </h1>

                <p class="mb-4 text-2xl text-gray-300">{team.shortName}</p>

                <!-- Favorite Button -->
                <div class="mb-6">
                    <FavoriteButton {isFavorited} {toggleFavorite} />
                </div>

                <!-- League badges and club information -->
                <div class="mb-6 flex flex-wrap justify-center gap-4 lg:justify-start">
                    {#each team.activeCompetitions as competition (competition.id)}
                        <span class="league-badge rounded-full px-4 py-2 text-sm font-semibold text-white">
                            {competition.name}
                        </span>
                    {/each}
                    <span class="rounded-full bg-gray-700/50 px-4 py-2 text-sm text-gray-300">
                        {team.area.name}
                    </span>
                    <span class="rounded-full bg-red-600/30 px-4 py-2 text-sm text-red-300">
                        Founded {team.founded}
                    </span>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    .glow-effect {
        box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
    }
</style>
