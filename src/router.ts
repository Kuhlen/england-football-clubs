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
 * Store that indicates if the current route is valid
 * @type {Writable<boolean>}
 * @default true
 */
export const isValidRoute = writable<boolean>(true);

/**
 * Valid routes configuration
 * Defines which routes are allowed and their parameter requirements
 */
const VALID_ROUTES = {
    home: { allowParams: false },
    favorite: { allowParams: false },
    detail: { allowParams: true, requiredParams: ["id"] },
} as const;

/**
 * Validates if a route and its parameters are valid
 * @param {string} route - The route name to validate
 * @param {RouteParams} params - The route parameters to validate
 * @returns {boolean} True if route is valid, false otherwise
 */
function validateRoute(route: string, params: RouteParams = {}): boolean {
    // Check if route exists in valid routes
    if (!(route in VALID_ROUTES)) {
        return false;
    }

    const routeConfig = VALID_ROUTES[route as keyof typeof VALID_ROUTES];

    // Check if route allows parameters
    if (!routeConfig.allowParams && Object.keys(params).length > 0) {
        return false;
    }

    // Check required parameters for routes that need them
    if (routeConfig.allowParams && routeConfig.requiredParams) {
        for (const requiredParam of routeConfig.requiredParams) {
            if (!params[requiredParam]) {
                return false;
            }
        }
    }

    // Special validation for detail route
    if (route === "detail" && params.id) {
        // Validate that ID is a valid number or string that can be converted to number
        const id = typeof params.id === "string" ? parseInt(params.id) : params.id;
        if (isNaN(id) || id <= 0) {
            return false;
        }
    }

    return true;
}

/**
 * Validates URL path structure
 * @param {string} path - The URL path to validate
 * @returns {boolean} True if path structure is valid
 */
function validateUrlPath(path: string): boolean {
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
        return true; // Empty path is valid (home)
    }

    const [firstSegment, ...rest] = segments;

    // Check if first segment is a valid route
    if (!(firstSegment in VALID_ROUTES)) {
        return false;
    }

    const routeConfig = VALID_ROUTES[firstSegment as keyof typeof VALID_ROUTES];

    // Routes that don't allow parameters should not have additional segments
    if (!routeConfig.allowParams && rest.length > 0) {
        return false;
    }

    // Detail route should have exactly one additional segment (the ID)
    if (firstSegment === "detail") {
        if (rest.length !== 1) {
            return false;
        }
        // Validate that the ID segment is a valid number
        const id = parseInt(rest[0]);
        if (isNaN(id) || id <= 0) {
            return false;
        }
    }

    return true;
}

/**
 * Navigates to a specific route with optional parameters
 * This function updates the currentRoute and routeParams stores,
 * and adds a new entry to the browser history
 *
 * @param {string} route - The target route name (e.g., "home", "about", "profile")
 * @param {RouteParams} params - Parameters to pass to the route (optional)
 * @returns {void}
 */
export function navigate(route: string, params: RouteParams = {}): void {
    // Validate route before navigation
    if (!validateRoute(route, params)) {
        console.error(`Invalid route: ${route} with params:`, params);
        // Navigate to not found instead
        currentRoute.set("not-found");
        routeParams.set({});
        isValidRoute.set(false);
        window.history.pushState({ route: "not-found", params: {} }, "", "/not-found");
        return;
    }

    // Update stores with new route and parameters
    currentRoute.set(route);
    routeParams.set(params);
    isValidRoute.set(true);

    // Build URL path based on route and params
    let urlPath = `/${route}`;

    // Handle dynamic routes with ID parameter
    if (route === "detail" && params.id) {
        urlPath = `/detail/${params.id}`;
    }

    // Add new entry to browser history
    window.history.pushState({ route, params }, "", urlPath);
}

/**
 * Parses URL path to extract route and parameters
 * @param {string} path - URL path to parse
 * @returns {{ route: string, params: RouteParams, isValid: boolean }}
 */
function parseRoute(path: string): { route: string; params: RouteParams; isValid: boolean } {
    // First validate the URL path structure
    if (!validateUrlPath(path)) {
        return { route: "not-found", params: {}, isValid: false };
    }

    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
        return { route: "home", params: {}, isValid: true };
    }

    const [firstSegment, ...rest] = segments;

    // Handle detail route
    if (firstSegment === "detail" && rest.length === 1) {
        const id = parseInt(rest[0]);
        return {
            route: "detail",
            params: { id },
            isValid: true,
        };
    }

    // Handle other static routes
    if (firstSegment in VALID_ROUTES) {
        return { route: firstSegment, params: {}, isValid: true };
    }

    // Invalid route
    return { route: "not-found", params: {}, isValid: false };
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
        const isValid = validateRoute(state.route, state.params || {});

        if (isValid) {
            currentRoute.set(state.route);
            routeParams.set(state.params || {});
            isValidRoute.set(true);
        } else {
            currentRoute.set("not-found");
            routeParams.set({});
            isValidRoute.set(false);
        }
    } else {
        // If no state exists, parse route from URL path
        const path = window.location.pathname.slice(1) || "";
        const { route, params, isValid } = parseRoute(path);

        currentRoute.set(route);
        routeParams.set(params);
        isValidRoute.set(isValid);
    }
});

/**
 * Initializes the router when the application first loads
 * This function will:
 * 1. Read the path from the current browser URL
 * 2. Set currentRoute based on the path
 * 3. Set routeParams with parsed parameters
 * 4. Validate the route
 *
 * @returns {void}
 */
export function initializeRouter(): void {
    // Get path from URL, remove first slash
    const path = window.location.pathname.slice(1) || "";

    // Parse route and params from path
    const { route, params, isValid } = parseRoute(path);

    // Set initial state for stores
    currentRoute.set(route);
    routeParams.set(params);
    isValidRoute.set(isValid);
}
