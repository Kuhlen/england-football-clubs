<script lang="ts">
    import { teamsStore } from "../stores/cache.store";
    import type { Team } from "../types/team.type";

    /**
     * Reactive state for search input
     * Updates automatically when user types in the search field
     * @type {string}
     */
    let searchQuery = $state("");

    /**
     * Derived reactive value that filters teams based on search criteria
     * Recalculates automatically when searchQuery or teamsStore changes
     *
     * Filtering logic:
     * - Search: Matches team name or short name (case-insensitive)
     *
     * @type {Team[]} Array of teams that match the current filters
     */
    let filteredTeams = $derived.by(() => {
        // Get current teams from store
        const teams = $teamsStore;

        // Return empty array if no teams loaded
        if (!teams || teams.length === 0) return [];

        // Filter teams based on search criteria
        return teams.filter((team: Team) => {
            // Check if team name or short name matches search query
            const matchesSearch =
                team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                team.shortName.toLowerCase().includes(searchQuery.toLowerCase());

            // Team must match both search criteria
            return matchesSearch;
        });
    });

    /**
     * Side effect that dispatches a custom event whenever filtered teams change
     * Allows parent components or other parts of the app to listen for filter changes
     *
     * Event Details:
     * - Event name: "teamsFiltered"
     * - Event detail: { filteredTeams: Team[] }
     */
    $effect(() => {
        // Create custom event with filtered teams data
        const event = new CustomEvent("teamsFiltered", {
            detail: { filteredTeams },
        });

        // Dispatch event to window for global listening
        window.dispatchEvent(event);
    });
</script>

<!-- Search Input -->
<div class="mx-auto max-w-2xl">
    <div class="relative mb-8">
        <input
            type="text"
            bind:value={searchQuery}
            name="search"
            placeholder="Search clubs by name..."
            class="search-glow w-full rounded-2xl border border-gray-700/50 bg-gray-800/60 px-6 py-4 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-500 focus:outline-none"
        />
        <div class="absolute top-1/2 right-4 -translate-y-1/2 transform">
            <i class="fas fa-search h-6 w-6 text-gray-400"></i>
        </div>
    </div>
</div>
