<script lang="ts">
    import type { Player } from "../types/team.type";

    interface Props {
        player: Player;
    }

    let { player }: Props = $props();

    /**
     * Calculates a person's age from their date of birth
     */
    function calculateAge(dateOfBirth: string): number {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    /**
     * Returns appropriate gradient colors for player position badges
     */
    function getPositionColor(position: string | null): string {
        if (!position) return "from-gray-500 to-gray-600";
        if (position === "Goalkeeper") return "from-yellow-500 to-yellow-600";
        if (["Defence", "Left-Back", "Right-Back", "Centre-Back"].includes(position)) {
            return "from-blue-500 to-blue-600";
        }
        if (["Midfield", "Central Midfield", "Defensive Midfield", "Attacking Midfield"].includes(position)) {
            return "from-green-500 to-green-600";
        }
        return "from-red-500 to-red-600"; // Forwards and attacking positions
    }
</script>

<div
    class="player-card rounded-xl border border-gray-700/30 bg-gray-800/60 p-6 backdrop-blur-sm transition-all duration-300"
>
    <div class="mb-4 flex items-center justify-between">
        <div
            class="h-14 w-14 bg-gradient-to-r {getPositionColor(
                player.position,
            )} flex items-center justify-center rounded-full text-xl font-bold"
        >
            {player.shirtNumber || "?"}
        </div>
        <div class="text-right">
            {#if player.dateOfBirth}
                <div class="text-sm text-gray-400">
                    Age {calculateAge(player.dateOfBirth)}
                </div>
            {/if}
            <div class="text-sm text-gray-400">
                {player.nationality}
            </div>
        </div>
    </div>
    <h4 class="mb-1 text-lg font-semibold">
        {player.name}
    </h4>
    <p class="text-sm text-gray-400">
        {player.position}
    </p>
</div>

<style>
    .player-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    }
</style>
