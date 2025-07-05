<script lang="ts">
    import type { TeamDetail } from "../../types/team.type";

    interface Props {
        favoriteTeams: TeamDetail[];
    }

    let { favoriteTeams }: Props = $props();

    // Derived statistics
    const totalTeams = $derived(favoriteTeams.length);
    const totalCountries = $derived([...new Set(favoriteTeams.map((t) => t.area.name))].length);
    const totalPlayers = $derived(favoriteTeams.reduce((total, team) => total + team.squad.length, 0));
    const combinedYears = $derived(
        favoriteTeams.reduce((total, team) => total + (new Date().getFullYear() - team.founded), 0),
    );
</script>

<div class="mt-12 text-center">
    <div class="inline-block rounded-2xl border border-gray-700/30 bg-gray-800/60 p-8 backdrop-blur-sm">
        <h3 class="gradient-text mb-6 text-2xl font-bold">Your Collection Stats</h3>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div class="text-center">
                <div class="mb-2 text-3xl font-bold text-purple-400">
                    {totalTeams}
                </div>
                <div class="text-sm tracking-wide text-gray-400 uppercase">Favorite Teams</div>
            </div>
            <div class="text-center">
                <div class="mb-2 text-3xl font-bold text-blue-400">
                    {totalCountries}
                </div>
                <div class="text-sm tracking-wide text-gray-400 uppercase">Countries</div>
            </div>
            <div class="text-center">
                <div class="mb-2 text-3xl font-bold text-green-400">
                    {totalPlayers}
                </div>
                <div class="text-sm tracking-wide text-gray-400 uppercase">Total Players</div>
            </div>
            <div class="text-center">
                <div class="mb-2 text-3xl font-bold text-red-400">
                    {combinedYears}
                </div>
                <div class="text-sm tracking-wide text-gray-400 uppercase">Combined Years</div>
            </div>
        </div>
    </div>
</div>
