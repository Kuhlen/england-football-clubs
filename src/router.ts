import { writable } from "svelte/store";
import type { RouteParams, RouteState } from "./types/router.type";

/**
 * Store that holds the currently active route name
 * @type {Writable<string>}
 * @default "home"
 */
export const currentRoute = writable<string>("home");

/**
 * Store that holds parameters for the active route
 * @type {Writable<RouteParams>}
 * @default {}
 */
export const routeParams = writable<RouteParams>({});

/**
 * Navigates to a specific route with optional parameters
 * This function updates the currentRoute and routeParams stores,
 * and adds a new entry to the browser history
 *
 * @param {string} route - The target route name (e.g., "home", "about", "profile")
 * @param {RouteParams} params - Parameters to pass to the route (optional)
 * @returns {void}
 *
 * @example
 * // Simple navigation
 * navigate("about");
 *
 * @example
 * // Navigation with parameters
 * navigate("profile", { userId: "123", tab: "settings" });
 */
export function navigate(route: string, params: RouteParams = {}): void {
    // Update stores with new route and parameters
    currentRoute.set(route);
    routeParams.set(params);

    // Add new entry to browser history
    // This allows users to use browser back/forward buttons
    window.history.pushState({ route, params }, "", `/${route}`);
}

/**
 * Event listener to handle browser navigation (back/forward buttons)
 * Automatically updates currentRoute and routeParams stores
 * based on the state stored in browser history
 */
window.addEventListener("popstate", (event: PopStateEvent) => {
    if (event.state) {
        // If there's a stored state in history, use route and params from state
        const state = event.state as RouteState;
        currentRoute.set(state.route);
        routeParams.set(state.params || {});
    } else {
        // If no state exists, parse route from URL path
        // Remove first slash and use "home" as default
        const path = window.location.pathname.slice(1) || "home";
        currentRoute.set(path);
        routeParams.set({});
    }
});

/**
 * Initializes the router when the application first loads
 * This function will:
 * 1. Read the path from the current browser URL
 * 2. Set currentRoute based on the path
 * 3. Set routeParams as an empty object
 *
 * @returns {void}
 *
 * @example
 * // Called in App.svelte or main component
 * onMount(() => {
 *     initializeRouter();
 * });
 */
export function initializeRouter(): void {
    // Get path from URL, remove first slash, default to "home"
    const path = window.location.pathname.slice(1) || "home";

    // Set initial state for stores
    currentRoute.set(path);
    routeParams.set({});
}
