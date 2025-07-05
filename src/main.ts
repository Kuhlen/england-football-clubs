import { mount } from "svelte";
import { initializeRouter } from "./router";
import "./app.css";
import App from "./App.svelte";

/**
 * Initialize the router before mounting the application
 * This ensures that the router is ready to handle the initial route
 * and sets up the proper state based on the current URL
 */
initializeRouter();

/**
 * Mount the main App component to the DOM
 * Uses Svelte 5's new mount API to create and attach the app
 *
 * @type {ComponentInstance} The mounted Svelte application instance
 *
 * The mount function:
 * - Creates a new instance of the App component
 * - Attaches it to the DOM element with id "app"
 * - Returns the component instance for potential manipulation
 */
const app = mount(App, {
    target: document.getElementById("app")!,
});

/**
 * Hot Module Replacement (HMR) setup for development
 * This enables live reloading and state preservation during development
 * Only active when running in development mode with Vite
 *
 * When a module is updated:
 * - The new module is accepted and loaded
 * - Component state is preserved where possible
 * - The page doesn't need a full refresh
 */
if (import.meta.hot) {
    import.meta.hot.accept();
}

/**
 * Export the app instance as the default export
 * This allows other modules to access the app instance if needed
 * for debugging, testing, or advanced manipulation
 *
 * @example
 * // In another module or console
 * import app from './main.ts';
 * console.log(app); // Access the mounted app instance
 */
export default app;
