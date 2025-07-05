<script lang="ts">
    import type { TeamDetail } from "../../types/team.type";
    import ManagerCard from "../../components/ManagerCard.svelte";

    interface Props {
        team: TeamDetail;
    }

    let { team }: Props = $props();

    // Derived values
    const coaches = $derived(team.squad.filter((player) => player.role === "COACH") || []);
    const mainCoach = $derived(coaches.find((coach) => coach.name.includes("Arteta")) || coaches[0]);
</script>

<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div class="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Club Information Card -->
        <div class="rounded-2xl border border-gray-700/30 bg-gray-800/60 p-8 backdrop-blur-sm">
            <h3 class="gradient-text mb-6 text-2xl font-bold">Club Information</h3>
            <div class="space-y-4">
                <div class="flex justify-between">
                    <span class="text-gray-400">Full Name</span>
                    <span class="text-white">{team.name}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Founded</span>
                    <span class="text-white">{team.founded}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Stadium</span>
                    <span class="text-white">{team.venue}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Country</span>
                    <span class="text-white">{team.area.name}</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-gray-400">Club Colors</span>
                    <span class="text-white">{team.clubColors}</span>
                </div>
                {#if team.website}
                    <div class="flex justify-between">
                        <span class="text-gray-400">Website</span>
                        <a href={team.website} target="_blank" class="text-blue-400 hover:text-blue-300">
                            Visit Website
                        </a>
                    </div>
                {/if}
            </div>
        </div>

        <!-- Manager Card -->
        {#if mainCoach}
            <ManagerCard coach={mainCoach} />
        {/if}
    </div>
</div>
