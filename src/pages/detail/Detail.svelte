<script lang="ts">
    import { onMount } from "svelte";
    import { routeParams } from "../../router";
    import { teamsStore, teamsService } from "../../stores/cache.store";
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
    let isNotFound = $state<boolean>(false);
    let isFavorited = $state<boolean>(false);
    let validatingTeamId = $state<boolean>(false);

    // Derived values
    const teamId = $derived($routeParams.id);
    const teams = $derived($teamsStore);

    // Effects
    $effect(() => {
        if (teamId) {
            validateAndFetchTeam();
            checkIfFavorited();
        }
    });

    onMount(async () => {
        initializeAnimations();
        window.scrollTo(0, 0);
    });

    /**
     * Validates if team ID exists in the teams list and fetches detail if valid
     */
    async function validateAndFetchTeam(): Promise<void> {
        try {
            validatingTeamId = true;
            error = null;
            isNotFound = false;

            // First, ensure we have teams data loaded
            await ensureTeamsLoaded();

            // Validate if team ID exists in the teams list
            const isValidTeamId = await validateTeamId(Number(teamId));

            if (!isValidTeamId) {
                isNotFound = true;
                return;
            }

            // If valid, fetch detailed team information
            await fetchTeamDetail(teamId);
        } catch (err) {
            console.error("Error in validateAndFetchTeam:", err);
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";

            if (errorMessage.toLowerCase().includes("404") || errorMessage.toLowerCase().includes("not found")) {
                isNotFound = true;
            } else {
                error = errorMessage;
            }
        } finally {
            validatingTeamId = false;
        }
    }

    /**
     * Ensures teams data is loaded from cache or API
     */
    async function ensureTeamsLoaded(): Promise<void> {
        // If teams store is empty, try to load from cache or API
        if (teams.length === 0) {
            try {
                await teamsService.getTeams();
            } catch (err) {
                console.warn("Failed to load teams for validation:", err);
                // Continue anyway, let the API call handle the validation
            }
        }
    }

    /**
     * Validates if a team ID exists in the current teams list
     * @param {number} id - Team ID to validate
     * @returns {Promise<boolean>} True if team ID is valid, false otherwise
     */
    async function validateTeamId(id: number): Promise<boolean> {
        // If we have teams loaded, check against the list
        if (teams.length > 0) {
            const teamExists = teams.some((team) => team.id === id);
            if (!teamExists) {
                console.warn(`Team ID ${id} not found in teams list`);
                return false;
            }
            return true;
        }

        // If no teams loaded, we can't validate locally
        // Let the API call determine if it's valid
        console.warn("No teams loaded for validation, will rely on API response");
        return true;
    }

    /**
     * Fetches detailed team information from the API
     */
    async function fetchTeamDetail(id: string | number): Promise<void> {
        try {
            loading = true;

            const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

            let API_URL: string;
            let headers: HeadersInit = {};
            const token: string | undefined = import.meta.env.VITE_FOOTBALL_API_TOKEN;

            if (isLocalhost) {
                const CORS_PROXY: string = import.meta.env.VITE_CORS_PROXY_URL;
                const FOOTBALL_API: string = `${import.meta.env.VITE_FOOTBALL_API_URL}/${id}`;
                API_URL = CORS_PROXY + FOOTBALL_API;
                headers = {
                    "X-Auth-Token": token || "",
                    "X-Requested-With": "XMLHttpRequest",
                };
            } else {
                API_URL = `/api/team/${id}`;
            }

            const response = await fetch(API_URL, { headers });

            if (!response.ok) {
                // Handle different HTTP status codes
                if (response.status === 404) {
                    throw new Error("Team not found");
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }

            team = await response.json();
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
        validateAndFetchTeam();
    }
</script>

<!-- Loading State (for validation or fetching) -->
{#if validatingTeamId || loading}
    <LoadingState message={validatingTeamId ? "Validating team..." : "Loading team details..."} />

    <!-- Not Found State (404 errors or invalid team ID) -->
{:else if isNotFound}
    <NotFoundState
        icon="🔍"
        title="Team Not Found"
        message="The requested team with ID {teamId} could not be found. Please check the team ID and try again."
    />

    <!-- Error State (other errors) -->
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

    <!-- Fallback Not Found State -->
{:else}
    <NotFoundState icon="🔍" title="Team Not Found" message="The requested team could not be found." />
{/if}
