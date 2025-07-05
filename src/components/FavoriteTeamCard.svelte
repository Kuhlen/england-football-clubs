<script lang="ts">
    import type { TeamDetail } from "../types/team.type";

    interface Props {
        team: TeamDetail;
        index: number;
        removeFromFavorites: (teamId: number) => void;
        viewTeamDetail: (teamId: number) => void;
    }

    let { team, index, removeFromFavorites, viewTeamDetail }: Props = $props();

    /**
     * Determines the appropriate competition/league name for a team
     */
    function getCompetitionName(team: TeamDetail): string {
        if (team.activeCompetitions && team.activeCompetitions.length > 0) {
            return team.activeCompetitions[0].name;
        }

        switch (team.area.name) {
            case "England":
                return "Premier League";
            case "Spain":
                return "La Liga";
            case "Germany":
                return "Bundesliga";
            case "Italy":
                return "Serie A";
            case "France":
                return "Ligue 1";
            default:
                return "League";
        }
    }

    /**
     * Returns color-coded button styling based on index
     */
    function getButtonColor(index: number): string {
        const colors = [
            "bg-red-600/20 border-red-500/30 text-red-300 hover:bg-red-600/30 focus:bg-red-600/30",
            "bg-purple-600/20 border-purple-500/30 text-purple-300 hover:bg-purple-600/30 focus:bg-purple-600/30",
            "bg-blue-600/20 border-blue-500/30 text-blue-300 hover:bg-blue-600/30 focus:bg-blue-600/30",
            "bg-green-600/20 border-green-500/30 text-green-300 hover:bg-green-600/30 focus:bg-green-600/30",
            "bg-yellow-600/20 border-yellow-500/30 text-yellow-300 hover:bg-yellow-600/30 focus:bg-yellow-600/30",
            "bg-pink-600/20 border-pink-500/30 text-pink-300 hover:bg-pink-600/30 focus:bg-pink-600/30",
            "bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 focus:bg-indigo-600/30",
            "bg-orange-600/20 border-orange-500/30 text-orange-300 hover:bg-orange-600/30 focus:bg-orange-600/30",
        ];
        return colors[index % colors.length];
    }
</script>

<div
    class="club-card card-hover rounded-2xl border border-gray-700/30 bg-gradient-to-br from-gray-800/80 to-gray-900/80 p-6 backdrop-blur-sm"
    data-team-id={team.id}
>
    <div class="mb-4 flex items-center justify-between">
        <div class="club-logo flex h-16 w-16 items-center justify-center rounded-2xl">
            {#if team.crestUrl}
                <img src={team.crestUrl} alt={team.name} class="h-full w-full rounded-2xl object-cover" />
            {:else}
                <span class="text-2xl font-bold text-white">{team.tla}</span>
            {/if}
        </div>
        <div class="flex items-center space-x-2">
            <span class="league-badge rounded-full px-3 py-1 text-xs font-semibold text-white">
                {getCompetitionName(team)}
            </span>
            <button
                onclick={() => removeFromFavorites(team.id)}
                class="favorite-btn favorited text-xl text-red-500 transition-colors hover:text-red-400"
                aria-label="Remove from favorites"
                title="Remove from favorites"
            >
                <i class="fas fa-heart"></i>
            </button>
        </div>
    </div>

    <h3 class="mb-2 text-xl font-bold">{team.name}</h3>
    <p class="mb-4 text-sm text-gray-400">
        {team.shortName} • {team.area.name}
    </p>

    <div class="space-y-2 text-sm">
        <div class="flex justify-between">
            <span class="text-gray-400">Founded</span>
            <span class="text-white">{team.founded}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-400">Stadium</span>
            <span class="text-white">{team.venue}</span>
        </div>
        <div class="flex justify-between">
            <span class="text-gray-400">Squad</span>
            <span class="text-white">{team.squad.length} players</span>
        </div>
    </div>

    <button
        onclick={() => viewTeamDetail(team.id)}
        class="mt-4 w-full py-2 {getButtonColor(
            index,
        )} transform rounded-xl font-medium transition-colors hover:scale-105"
    >
        View Details
    </button>
</div>

<style>
    .favorite-btn {
        transition: all 0.3s ease;
    }

    .favorite-btn.favorited {
        color: #ef4444;
        transform: scale(1.2);
    }

    .favorite-btn:hover {
        transform: scale(1.3);
    }
</style>
