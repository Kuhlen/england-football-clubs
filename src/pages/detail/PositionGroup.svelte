<script lang="ts">
    import type { Player } from "../../types/team.type";
    import PlayerCard from "../../components/PlayerCard.svelte";

    interface Props {
        title: string;
        players: Player[];
        count: number;
        colorClass: string;
    }

    let { title, players, count, colorClass }: Props = $props();
</script>

<div>
    <h3 class="mb-6 text-2xl font-bold {colorClass}">
        {title} ({count})
    </h3>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each players as player (player.id)}
            <PlayerCard {player} />
        {/each}
    </div>
</div>
