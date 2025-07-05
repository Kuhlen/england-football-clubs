<script lang="ts">
    import type { Player } from "../types/team.type";

    interface Props {
        coach: Player; // Coach is actually a Player with role: "COACH"
    }

    let { coach }: Props = $props();

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

    // Derived values
    const initials = $derived(
        coach.name
            .split(" ")
            .map((n) => n[0])
            .join(""),
    );
</script>

<div class="rounded-2xl border border-gray-700/30 bg-gray-800/60 p-8 backdrop-blur-sm">
    <h3 class="gradient-text mb-6 text-2xl font-bold">Manager</h3>
    <div class="text-center">
        <div
            class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-600 text-2xl font-bold"
        >
            {initials}
        </div>
        <h4 class="mb-2 text-xl font-bold">{coach.name}</h4>
        <p class="mb-4 text-gray-400">Head Coach</p>
        <div class="space-y-2 text-sm">
            {#if coach.dateOfBirth}
                <div class="flex justify-between">
                    <span class="text-gray-400">Age</span>
                    <span class="text-white">{calculateAge(coach.dateOfBirth)}</span>
                </div>
            {/if}
            <div class="flex justify-between">
                <span class="text-gray-400">Nationality</span>
                <span class="text-white">{coach.nationality}</span>
            </div>
        </div>
    </div>
</div>
