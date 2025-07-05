<script lang="ts">
    import type { TeamDetail } from "../../types/team.type";
    import FavoriteTeamCard from "../../components/FavoriteTeamCard.svelte";

    interface Props {
        favoriteTeams: TeamDetail[];
        removeFromFavorites: (teamId: number) => void;
        viewTeamDetail: (teamId: number) => void;
    }

    let { favoriteTeams, removeFromFavorites, viewTeamDetail }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {#each favoriteTeams as team, index (team.id)}
        <FavoriteTeamCard {team} {index} {removeFromFavorites} {viewTeamDetail} />
    {/each}
</div>
