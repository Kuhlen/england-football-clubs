<script lang="ts">
    import { onMount } from "svelte";
    import { routeParams } from "../../router";
    import type { TeamDetail } from "../../types/team.type";

    // Import components
    import LoadingState from "../../components/LoadingState.svelte";
    import ErrorState from "../../components/ErrorState.svelte";
    import NotFoundState from "../../components/NotFoundState.svelte";
    import TeamHero from "./TeamHero.svelte";
    import TeamInfo from "./TeamInfo.svelte";
    import SquadSection from "./SquadSection.svelte";

    // State management
    let team = $state<TeamDetail | null>(null);
    let loading = $state<boolean>(false);
    let error = $state<string | null>(null);
    let isFavorited = $state<boolean>(false);

    // Derived values
    const teamId = $derived($routeParams.id);

    // Effects
    $effect(() => {
        if (teamId) {
            fetchTeamDetail(teamId);
            checkIfFavorited();
        }
    });

    onMount(async () => {
        initializeAnimations();
        window.scrollTo(0, 0);
    });

    /**
     * Fetches detailed team information from the API
     */
    async function fetchTeamDetail(id: string | number): Promise<void> {
        try {
            loading = true;
            error = null;

            const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

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
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            team = await response.json();
        } catch (err) {
            error = err instanceof Error ? err.message : "Unknown error occurred";
            console.error("Error fetching team detail:", err);
        } finally {
            loading = false;
        }
    }

    /**
     * Checks if the current team is in user's favorites
     */
    function checkIfFavorited(): void {
        try {
            const favorites = JSON.parse(localStorage.getItem("favoriteTeams") || "[]");
            isFavorited = favorites.includes(Number(teamId));
        } catch (err) {
            console.warn("Error checking favorites:", err);
        }
    }

    /**
     * Toggles the favorite status of the current team
     */
    function toggleFavorite(): void {
        try {
            const favorites = JSON.parse(localStorage.getItem("favoriteTeams") || "[]");
            const teamIdNum = Number(teamId);

            if (isFavorited) {
                const updatedFavorites = favorites.filter((id: number) => id !== teamIdNum);
                localStorage.setItem("favoriteTeams", JSON.stringify(updatedFavorites));
                isFavorited = false;
            } else {
                favorites.push(teamIdNum);
                localStorage.setItem("favoriteTeams", JSON.stringify(favorites));
                isFavorited = true;
            }
        } catch (err) {
            console.error("Error updating favorites:", err);
        }
    }

    /**
     * Initializes scroll-based animations for cards
     */
    function initializeAnimations(): void {
        const observerOptions: IntersectionObserverInit = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };

        const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry: IntersectionObserverEntry) => {
                if (entry.isIntersecting) {
                    const target = entry.target as HTMLElement;
                    target.style.opacity = "1";
                    target.style.transform = "translateY(0)";
                }
            });
        }, observerOptions);

        const cards = document.querySelectorAll(".card-hover, .player-card");
        cards.forEach((card: Element) => {
            const cardElement = card as HTMLElement;
            cardElement.style.opacity = "0";
            cardElement.style.transform = "translateY(20px)";
            cardElement.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            observer.observe(cardElement);
        });
    }

    // Handler functions to pass to child components
    function handleRetry(): void {
        fetchTeamDetail(teamId);
    }
</script>

<!-- Loading State -->
{#if loading}
    <LoadingState message="Loading team details..." />

    <!-- Error State -->
{:else if error}
    <ErrorState {error} onRetry={handleRetry} title="Error Loading Team" />

    <!-- Main Content -->
{:else if team}
    <!-- Team Hero Section -->
    <TeamHero {team} {isFavorited} {toggleFavorite} />

    <!-- Team Information Section -->
    <TeamInfo {team} />

    <!-- Squad Section -->
    <SquadSection {team} />

    <!-- Not Found State -->
{:else}
    <NotFoundState icon="🔍" title="Team Not Found" message="The requested team could not be found." />
{/if}
