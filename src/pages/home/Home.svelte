<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import HeroSection from "./HeroSection.svelte";
    import ClubsGrid from "./ClubsGrid.svelte";
    import StatsSection from "./StatsSection.svelte";
    import ConfirmationModal from "../../components/ConfirmationModal.svelte";
    import { teamsStore, teamsService } from "../../stores/cache.store";
    import { navigate } from "../../router";
    import type { Team } from "../../types/team.type";

    // State management
    let loading = $state(false);
    let error = $state<string | null>(null);
    let filteredTeams = $state<Team[]>([]);
    let showClearCacheModal = $state(false);
    let clearingCache = $state(false);

    // Derived values
    const teams = $derived($teamsStore);

    // Effects
    $effect(() => {
        if (teams.length > 0 && filteredTeams.length === 0) {
            filteredTeams = teams;
        }
    });

    $effect(() => {
        if (error && !loading) {
            const timeoutId = setTimeout(() => {
                error = null;
            }, 5000);
            return () => clearTimeout(timeoutId);
        }
    });

    // Event handlers
    let teamsFilteredHandler: (event: Event) => void;

    onMount(async (): Promise<void> => {
        await loadTeams();
        window.scrollTo(0, 0);
        teamsFilteredHandler = handleTeamsFiltered;
        window.addEventListener("teamsFiltered", teamsFilteredHandler);
    });

    onDestroy(() => {
        if (teamsFilteredHandler) {
            window.removeEventListener("teamsFiltered", teamsFilteredHandler);
        }
    });

    function handleTeamsFiltered(event: Event): void {
        const customEvent = event as CustomEvent<{ filteredTeams: Team[] }>;
        if (customEvent.detail?.filteredTeams) {
            filteredTeams = customEvent.detail.filteredTeams;
        }
    }

    // Data operations
    async function loadTeams(forceRefresh: boolean = false): Promise<void> {
        if (loading) return;
        try {
            loading = true;
            error = null;
            await teamsService.getTeams(forceRefresh);
            if (forceRefresh) {
                console.info("Teams data refreshed successfully");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            error = `Failed to load teams: ${errorMessage}`;
            console.error("Error loading teams:", err);
        } finally {
            loading = false;
        }
    }

    async function refreshData(): Promise<void> {
        try {
            await loadTeams(true);
        } catch (err) {
            console.error("Refresh failed:", err);
        }
    }

    // Modal operations
    function openClearCacheModal(): void {
        showClearCacheModal = true;
    }

    function closeClearCacheModal(): void {
        showClearCacheModal = false;
    }

    async function confirmClearCache(): Promise<void> {
        try {
            clearingCache = true;
            await teamsService.clearCache();
            filteredTeams = [];
            error = null;
            closeClearCacheModal();
            console.info("Cache cleared successfully");
        } catch (err) {
            error = "Failed to clear cache";
            console.error("Error clearing cache:", err);
        } finally {
            clearingCache = false;
        }
    }

    // Navigation
    function viewTeamDetail(teamId: number): void {
        try {
            if (!teamId || teamId <= 0) {
                throw new Error("Invalid team ID");
            }
            navigate("detail", { id: teamId });
        } catch (err) {
            error = "Failed to navigate to team detail";
            console.error("Navigation error:", err);
        }
    }
</script>

<!-- Hero Section -->
<HeroSection {loading} {refreshData} {openClearCacheModal} />

<!-- Clear Cache Modal -->
{#if showClearCacheModal}
    <ConfirmationModal
        title="Clear Cache"
        message="Are you sure you want to clear all cached data? This action cannot be undone and will remove all stored team information."
        confirmText="Clear Cache"
        cancelText="Cancel"
        isLoading={clearingCache}
        loadingText="Clearing..."
        onConfirm={confirmClearCache}
        onCancel={closeClearCacheModal}
        variant="danger"
        icon="clear"
        additionalInfo="What will be cleared: All teams data, Filter preferences, and Cached API responses."
    />
{/if}

<!-- Clubs Grid Section -->
<ClubsGrid {loading} {error} {filteredTeams} {teams} {loadTeams} {viewTeamDetail} />

<!-- Statistics Section -->
<StatsSection {teams} />
