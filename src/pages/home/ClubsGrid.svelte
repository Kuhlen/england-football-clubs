<script lang="ts">
    import type { Team } from "../../types/team.type";

    interface Props {
        loading: boolean;
        error: string | null;
        filteredTeams: Team[];
        teams: Team[];
        loadTeams: () => Promise<void>;
        viewTeamDetail: (teamId: number) => void;
    }

    let { loading, error, filteredTeams, teams, loadTeams, viewTeamDetail }: Props = $props();
</script>

<section class="py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="clubsGrid" class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <!-- Loading State -->
            {#if loading && teams.length === 0}
                <div class="col-span-1 text-center md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <p class="text-gray-400">Loading clubs...</p>
                </div>
                <!-- Error State -->
            {:else if error && teams.length === 0}
                <div class="col-span-1 text-red-500 md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <p>Error loading clubs: {error}</p>
                    <button
                        onclick={() => loadTeams()}
                        class="mt-4 rounded-xl border border-red-500/30 bg-red-600/20 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-600/30"
                    >
                        Retry
                    </button>
                </div>
                <!-- Clubs Display -->
            {:else if filteredTeams.length > 0}
                {#each filteredTeams as club (club.id)}
                    <div
                        class="club-card card-hover rounded-2xl border border-gray-700/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 backdrop-blur-sm"
                        data-league={club.area.name.toLowerCase()}
                    >
                        <div class="mb-4 flex items-center justify-between">
                            <div class="club-logo flex h-16 w-16 items-center justify-center rounded-2xl">
                                <img
                                    src={club.crestUrl}
                                    alt={club.name}
                                    class="h-full w-full rounded-2xl object-cover"
                                />
                            </div>
                            <span class="league-badge rounded-full px-3 py-1 text-xs font-semibold text-white">
                                {club.area.name}
                            </span>
                        </div>
                        <h3 class="mb-2 text-xl font-bold">{club.name}</h3>
                        <p class="mb-4 text-sm text-gray-400">
                            {club.shortName} • {club.area.name}
                        </p>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-400">Founded</span>
                                <span class="text-white">{club.founded}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Stadium</span>
                                <span class="text-white">{club.venue}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-400">Titles</span>
                                <span class="text-white">
                                    {club.tla ? club.tla : "N/A"}
                                </span>
                            </div>
                        </div>
                        <button
                            onclick={() => viewTeamDetail(club.id)}
                            class="mt-4 w-full rounded-xl border border-red-500/30 bg-red-600/20 py-2 font-medium text-red-400 transition-colors hover:bg-red-600/30"
                        >
                            View Details
                        </button>
                    </div>
                {/each}
                <!-- No Clubs Found State by Filters -->
            {:else if teams.length > 0}
                <div class="col-span-1 text-center md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <p class="text-gray-400">No clubs match your filters</p>
                </div>
                <!-- No Clubs Found State -->
            {:else}
                <div class="col-span-1 text-center md:col-span-2 lg:col-span-3 xl:col-span-4">
                    <p class="text-gray-400">No clubs found</p>
                </div>
            {/if}
        </div>

        <!-- Loading Indicator -->
        {#if loading && teams.length > 0}
            <div class="mt-8 text-center">
                <p class="text-blue-400">🔄 Refreshing data...</p>
            </div>
        {/if}
    </div>
</section>
