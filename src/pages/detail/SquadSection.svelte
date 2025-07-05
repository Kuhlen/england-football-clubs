<script lang="ts">
    import type { TeamDetail } from "../../types/team.type";
    import PositionGroup from "./PositionGroup.svelte";

    interface Props {
        team: TeamDetail;
    }

    let { team }: Props = $props();

    // Derived values for player filtering
    const players = $derived(team.squad.filter((player) => player.role === "PLAYER" && player.position) || []);

    const goalkeepers = $derived(players.filter((player) => player.position === "Goalkeeper"));

    const defenders = $derived(
        players.filter(
            (player) =>
                player.position === "Defence" ||
                player.position === "Left-Back" ||
                player.position === "Right-Back" ||
                player.position === "Centre-Back",
        ),
    );

    const midfielders = $derived(
        players.filter(
            (player) =>
                player.position === "Midfield" ||
                player.position === "Central Midfield" ||
                player.position === "Defensive Midfield" ||
                player.position === "Attacking Midfield",
        ),
    );

    const forwards = $derived(
        players.filter(
            (player) =>
                player.position === "Offence" ||
                player.position === "Centre-Forward" ||
                player.position === "Left Winger" ||
                player.position === "Right Winger",
        ),
    );
</script>

<div class="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
    <h2 class="gradient-text mb-8 text-center text-3xl font-bold">
        Current Squad ({players.length} players)
    </h2>

    <div class="space-y-12">
        <!-- Goalkeepers -->
        {#if goalkeepers.length > 0}
            <PositionGroup
                title="Goalkeepers"
                players={goalkeepers}
                count={goalkeepers.length}
                colorClass="text-yellow-400"
            />
        {/if}

        <!-- Defenders -->
        {#if defenders.length > 0}
            <PositionGroup title="Defenders" players={defenders} count={defenders.length} colorClass="text-blue-400" />
        {/if}

        <!-- Midfielders -->
        {#if midfielders.length > 0}
            <PositionGroup
                title="Midfielders"
                players={midfielders}
                count={midfielders.length}
                colorClass="text-green-400"
            />
        {/if}

        <!-- Forwards -->
        {#if forwards.length > 0}
            <PositionGroup title="Forwards" players={forwards} count={forwards.length} colorClass="text-red-400" />
        {/if}
    </div>
</div>
