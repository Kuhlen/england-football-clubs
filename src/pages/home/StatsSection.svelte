<script lang="ts">
    import type { Team } from "../../types/team.type";

    interface Props {
        teams: Team[];
    }

    let { teams }: Props = $props();
</script>

<section class="bg-gray-800/30 py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="gradient-text mb-16 text-center text-4xl font-bold">England Football Statistics</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-2">
            <div class="text-center">
                <div class="gradient-text mb-2 text-4xl font-bold md:text-6xl">
                    {teams.length}+
                </div>
                <div class="text-sm tracking-wide text-gray-400 uppercase">Top Clubs</div>
            </div>
            <div class="text-center">
                <div class="gradient-text mb-2 text-4xl font-bold md:text-6xl">
                    {[...new Set(teams.map((t: Team) => t.area.name))].length}
                </div>
                <div class="text-sm tracking-wide text-gray-400 uppercase">Country</div>
            </div>
        </div>
    </div>
</section>
