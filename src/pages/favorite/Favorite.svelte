<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { navigate } from "../../router";
    import type { TeamDetail } from "../../types/team.type.js";

    // Import components
    import ErrorState from "../../components/ErrorState.svelte";
    import FavoriteHero from "./FavoriteHero.svelte";
    import FavoritesGrid from "./FavoritesGrid.svelte";
    import EmptyFavorites from "./EmptyFavorites.svelte";
    import ConfirmationModal from "../../components/ConfirmationModal.svelte";
    import CollectionStats from "./CollectionStats.svelte";

    // State management
    let favoriteTeams = $state<TeamDetail[]>([]);
    let loading = $state<boolean>(false);
    let error = $state<string | null>(null);
    let showClearAllModal = $state(false);
    let clearingAllFavorites = $state(false);

    // Derived values for modal preview
    const modalPreviewItems = $derived(
        favoriteTeams.map((team) => ({
            id: team.id,
            name: team.name,
            imageUrl: team.crestUrl,
            acronym: team.tla,
        })),
    );

    onMount(async () => {
        await loadFavoriteTeams();
        window.scrollTo(0, 0);
        document.addEventListener("keydown", handleEscapeKey);
    });

    onDestroy(() => {
        document.removeEventListener("keydown", handleEscapeKey);
    });

    function handleEscapeKey(event: KeyboardEvent): void {
        if (event.key === "Escape" && showClearAllModal) {
            closeClearAllModal();
        }
    }

    /**
     * Loads detailed information for all favorite teams from API
     */
    async function loadFavoriteTeams(): Promise<void> {
        try {
            loading = true;
            error = null;

            const favoriteIds = JSON.parse(localStorage.getItem("favoriteTeams") || "[]");

            if (favoriteIds.length === 0) {
                favoriteTeams = [];
                return;
            }

            const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

            const teamPromises = favoriteIds.map(async (id: number) => {
                let API_URL: string;
                let headers: HeadersInit = {};

                if (isLocalhost) {
                    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
                    const FOOTBALL_API = `https://api.football-data.org/v2/teams/${id}`;
                    API_URL = CORS_PROXY + FOOTBALL_API;
                    headers = {
                        "X-Auth-Token": import.meta.env.VITE_FOOTBALL_API_TOKEN,
                        "X-Requested-With": "XMLHttpRequest",
                    };
                } else {
                    API_URL = `/api/team/${id}`;
                }

                const response = await fetch(API_URL, { headers });
                if (!response.ok) {
                    throw new Error(`Failed to fetch team ${id}: ${response.status}`);
                }
                return await response.json();
            });

            favoriteTeams = await Promise.all(teamPromises);
        } catch (err) {
            error = err instanceof Error ? err.message : "Error loading favorite teams";
            console.error("Error loading favorites:", err);
        } finally {
            loading = false;
        }
    }

    /**
     * Removes a team from favorites with animated removal effect
     */
    function removeFromFavorites(teamId: number): void {
        try {
            const favorites = JSON.parse(localStorage.getItem("favoriteTeams") || "[]");
            const updatedFavorites = favorites.filter((id: number) => id !== teamId);
            localStorage.setItem("favoriteTeams", JSON.stringify(updatedFavorites));

            const teamCard = document.querySelector(`[data-team-id="${teamId}"]`);
            if (teamCard) {
                teamCard.classList.add("remove-animation");

                const handleAnimationEnd = () => {
                    favoriteTeams = favoriteTeams.filter((team) => team.id !== teamId);
                    teamCard.removeEventListener("animationend", handleAnimationEnd);
                };

                teamCard.addEventListener("animationend", handleAnimationEnd);

                setTimeout(() => {
                    if (favoriteTeams.some((team) => team.id === teamId)) {
                        favoriteTeams = favoriteTeams.filter((team) => team.id !== teamId);
                    }
                }, 600);
            } else {
                favoriteTeams = favoriteTeams.filter((team) => team.id !== teamId);
            }
        } catch (err) {
            console.error("Error removing from favorites:", err);
            error = "Failed to remove team from favorites";
        }
    }

    function openClearAllModal(): void {
        if (favoriteTeams.length === 0) return;
        showClearAllModal = true;
    }

    function closeClearAllModal(): void {
        showClearAllModal = false;
    }

    async function confirmClearAllFavorites(): Promise<void> {
        try {
            clearingAllFavorites = true;
            await new Promise((resolve) => setTimeout(resolve, 500));
            localStorage.removeItem("favoriteTeams");
            favoriteTeams = [];
            error = null;
            closeClearAllModal();
            console.log("All favorites cleared successfully");
        } catch (err) {
            console.error("Error clearing all favorites:", err);
            error = "Failed to clear all favorites";
        } finally {
            clearingAllFavorites = false;
        }
    }

    function viewTeamDetail(teamId: number): void {
        navigate("detail", { id: teamId });
    }

    function handleRetry(): void {
        loadFavoriteTeams();
    }

    function navigateToHome(): void {
        navigate("home");
    }
</script>

<!-- Hero Section -->
<FavoriteHero {favoriteTeams} {openClearAllModal} />

<!-- Clear All Modal -->
{#if showClearAllModal}
    <ConfirmationModal
        title="Clear All Favorites"
        message="Are you sure you want to remove all <strong class='text-red-400'>{favoriteTeams.length}</strong> favorite teams? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Keep Favorites"
        isLoading={clearingAllFavorites}
        loadingText="Clearing..."
        onConfirm={confirmClearAllFavorites}
        onCancel={closeClearAllModal}
        variant="danger"
        icon="trash"
        showPreview={true}
        previewItems={modalPreviewItems}
        additionalInfo="You can always re-add teams to your favorites later by exploring the teams page."
    />
{/if}

<!-- Main Content -->
<section class="py-16">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Loading State -->
        {#if loading}
            <div class="col-span-1 text-center md:col-span-2 lg:col-span-3 xl:col-span-4">
                <p class="text-gray-400">Loading your favorite teams...</p>
            </div>

            <!-- Error State -->
        {:else if error}
            <ErrorState {error} onRetry={handleRetry} title="Error Loading Favorites" />

            <!-- Empty State -->
        {:else if favoriteTeams.length === 0}
            <EmptyFavorites {navigateToHome} />

            <!-- Favorites Grid & Stats -->
        {:else}
            <FavoritesGrid {favoriteTeams} {removeFromFavorites} {viewTeamDetail} />

            <CollectionStats {favoriteTeams} />
        {/if}
    </div>
</section>

<style>
    :global(.remove-animation) {
        animation: removeItem 0.5s ease-out forwards;
    }

    @keyframes removeItem {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        50% {
            opacity: 0.5;
            transform: scale(0.9);
        }
        100% {
            opacity: 0;
            transform: scale(0.8);
            height: 0;
            margin: 0;
            padding: 0;
        }
    }
</style>
