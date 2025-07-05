import { writable } from "svelte/store";
import type { Team, TeamsResponse } from "../types/team.type";
import type { CacheData } from "../types/cache.type";

/**
 * Cache duration in milliseconds (30 minutes)
 * Data will be considered stale after this period
 * @const {number}
 */
const CACHE_DURATION = 30 * 60 * 1000;

/**
 * Cache key for storing football teams data in localStorage
 * @const {string}
 */
const CACHE_KEY = "footballTeamsCache";

/**
 * Svelte store that holds the current teams data
 * Can be subscribed to by components to get reactive updates
 * @type {Writable<Team[]>}
 */
export const teamsStore = writable<Team[]>([]);

/**
 * Generic cache utility for localStorage operations
 * Provides methods to store, retrieve, and manage cached data with expiration
 */
export const cache = {
    /**
     * Stores data in localStorage with expiration timestamp
     *
     * @template T - The type of data being cached
     * @param {string} key - The cache key to store the data under
     * @param {T} data - The data to be cached
     * @returns {void}
     *
     * @example
     * cache.set('myData', { id: 1, name: 'Example' });
     */
    set<T>(key: string, data: T): void {
        // Create cache object with data and expiration metadata
        const cacheData: CacheData<T> = {
            data: data,
            timestamp: Date.now(),
            expiry: Date.now() + CACHE_DURATION,
        };

        try {
            // Store in localStorage as JSON string
            localStorage.setItem(key, JSON.stringify(cacheData));
        } catch (error) {
            // Handle localStorage quota exceeded or other storage errors
            console.warn("Failed to save to localStorage:", error);
        }
    },

    /**
     * Retrieves data from localStorage if it exists and hasn't expired
     *
     * @template T - The expected type of the cached data
     * @param {string} key - The cache key to retrieve data from
     * @returns {T | null} The cached data if valid, null if expired or not found
     *
     * @example
     * const cachedData = cache.get<MyDataType>('myData');
     * if (cachedData) {
     *     // Use cached data
     * }
     */
    get<T>(key: string): T | null {
        try {
            // Get raw cached string from localStorage
            const cached = localStorage.getItem(key);
            if (!cached) return null;

            // Parse the cached data
            const cacheData: CacheData<T> = JSON.parse(cached);

            // Check if cache has expired
            if (Date.now() > cacheData.expiry) {
                // Remove expired cache entry
                localStorage.removeItem(key);
                return null;
            }

            // Return valid cached data
            return cacheData.data;
        } catch (error) {
            // Handle JSON parsing errors or localStorage access issues
            console.warn("Failed to read from localStorage:", error);
            return null;
        }
    },

    /**
     * Removes a specific cache entry from localStorage
     *
     * @param {string} key - The cache key to remove
     * @returns {void}
     *
     * @example
     * cache.remove('myData');
     */
    remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            // Handle localStorage access errors
            console.warn("Failed to remove from localStorage:", error);
        }
    },

    /**
     * Checks if a cache entry exists and is still valid
     *
     * @param {string} key - The cache key to check
     * @returns {boolean} true if cache entry exists and is valid, false otherwise
     *
     * @example
     * if (cache.isValid('myData')) {
     *     // Use cached data without fetching
     * } else {
     *     // Fetch fresh data
     * }
     */
    isValid(key: string): boolean {
        const cached = this.get(key);
        return cached !== null;
    },
};

/**
 * Service for managing football teams data
 * Handles API calls, caching, and store updates with environment-specific configurations
 */
export const teamsService = {
    /**
     * Fetches teams data from API or cache with environment-aware endpoint selection
     * Implements cache-first strategy with fallback to API and graceful error handling
     *
     * @param {boolean} forceRefresh - If true, bypasses cache and fetches fresh data
     * @returns {Promise<Team[]>} Promise that resolves to array of teams
     *
     * @throws {Error} When API request fails and no cached data is available
     *
     * Environment handling:
     * - Vercel production: Uses serverless API route "/api/teams"
     * - Other environments: Uses CORS proxy with external Football Data API
     *
     * @example
     * // Get teams (uses cache if available)
     * const teams = await teamsService.getTeams();
     *
     * @example
     * // Force fresh data fetch
     * const teams = await teamsService.getTeams(true);
     */
    async getTeams(forceRefresh: boolean = false): Promise<Team[]> {
        if (!forceRefresh) {
            const cachedTeams = cache.get<Team[]>(CACHE_KEY);
            if (cachedTeams) {
                teamsStore.set(cachedTeams);
                return cachedTeams;
            }
        }

        try {
            const hostname = window.location.hostname;
            const isVercelProduction = hostname.includes("vercel.app");

            let API_URL: string;
            let headers: HeadersInit = {};

            if (isVercelProduction) {
                API_URL = "/api/teams";
            } else {
                const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
                const FOOTBALL_API = "https://api.football-data.org/v2/teams/";
                API_URL = CORS_PROXY + FOOTBALL_API;
                headers = {
                    "X-Auth-Token": import.meta.env.VITE_FOOTBALL_API_TOKEN,
                    "X-Requested-With": "XMLHttpRequest",
                };
            }

            const response = await fetch(API_URL, { headers });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
            }

            const data: TeamsResponse = await response.json();
            const teams = data.teams || [];

            cache.set<Team[]>(CACHE_KEY, teams);
            teamsStore.set(teams);

            return teams;
        } catch (error) {
            console.error("Error fetching teams:", error);

            const cachedTeams = cache.get<Team[]>(CACHE_KEY);
            if (cachedTeams) {
                teamsStore.set(cachedTeams);
                return cachedTeams;
            }

            throw error;
        }
    },

    /**
     * Clears all cached teams data and resets the store
     * Useful for debugging, testing, or when cache becomes corrupted
     *
     * @returns {void}
     *
     * @example
     * // Clear all teams data and reset UI
     * teamsService.clearCache();
     */
    clearCache(): void {
        cache.remove(CACHE_KEY);
        teamsStore.set([]);
    },
};
