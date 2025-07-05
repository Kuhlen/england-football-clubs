<script lang="ts">
    import { navigate, currentRoute } from "../router.js";

    /**
     * Reactive state to control mobile menu visibility
     * @type {boolean} true when mobile menu is open, false when closed
     */
    let isMenuOpen = $state<boolean>(false);

    /**
     * Navigates to the home page and closes mobile menu
     * Ensures mobile menu is always closed after navigation for better UX
     * @returns {void}
     */
    function goHome(): void {
        navigate("home");
        isMenuOpen = false;
    }

    /**
     * Navigates to the favorites page and closes mobile menu
     * Ensures mobile menu is always closed after navigation for better UX
     * @returns {void}
     */
    function goFavorites(): void {
        navigate("favorite");
        isMenuOpen = false;
    }

    /**
     * Toggles the mobile menu open/closed state
     * Used by the hamburger menu button on mobile devices
     * @returns {void}
     */
    function toggleMenu(): void {
        isMenuOpen = !isMenuOpen;
    }
</script>

<!-- Navigation Bar -->
<nav class="fixed z-50 w-full border-b border-gray-800/50 bg-gray-900/95 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between py-4">
            <div class="flex items-center space-x-4">
                <div
                    class="animate-float flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600"
                >
                    <i class="fas fa-futbol text-xl text-white"></i>
                </div>
                <div>
                    <h1 class="gradient-text text-2xl font-bold">Football Clubs</h1>
                    <p class="text-xs text-gray-400">England Directory</p>
                </div>
            </div>

            <!-- Desktop Navigation Links -->
            <div class="hidden space-x-8 md:flex">
                <button
                    type="button"
                    onclick={goHome}
                    class="{$currentRoute === 'home'
                        ? 'text-white'
                        : 'text-gray-300'} cursor-pointer border-none bg-transparent p-0 font-medium transition-colors hover:text-blue-400"
                    aria-current={$currentRoute === "home" ? "page" : undefined}>Home</button
                >
                <button
                    type="button"
                    onclick={goFavorites}
                    class="{$currentRoute === 'favorites'
                        ? 'text-white'
                        : 'text-gray-300'} cursor-pointer border-none bg-transparent p-0 font-medium transition-colors hover:text-blue-400"
                    aria-current={$currentRoute === "favorites" ? "page" : undefined}>Favorites</button
                >
            </div>

            <!-- Mobile Hamburger Menu Button -->
            <button
                class="rounded-lg p-2 transition-colors hover:bg-gray-800/50 md:hidden"
                aria-label="Toggle menu"
                onclick={toggleMenu}
            >
                <div class="flex h-6 w-6 flex-col justify-center gap-1">
                    <div
                        class="h-0.5 w-full bg-white transition-all duration-300 {isMenuOpen
                            ? 'translate-y-1.5 rotate-45'
                            : ''}"
                    ></div>
                    <div
                        class="h-0.5 w-full bg-white transition-all duration-300 {isMenuOpen ? 'opacity-0' : ''}"
                    ></div>
                    <div
                        class="h-0.5 w-full bg-white transition-all duration-300 {isMenuOpen
                            ? '-translate-y-1.5 -rotate-45'
                            : ''}"
                    ></div>
                </div>
            </button>
        </div>

        <!-- Mobile Navigation Links -->
        {#if isMenuOpen}
            <div class="mt-2 rounded-lg bg-gray-800/90 p-4 backdrop-blur-lg md:hidden">
                <button
                    type="button"
                    onclick={goHome}
                    class="block w-full py-2 text-left font-medium text-gray-300 transition-colors hover:text-blue-400"
                    aria-current={$currentRoute === "home" ? "page" : undefined}
                >
                    Home
                </button>
                <button
                    type="button"
                    onclick={goFavorites}
                    class="block w-full py-2 text-left font-medium text-gray-300 transition-colors hover:text-blue-400"
                    aria-current={$currentRoute === "favorites" ? "page" : undefined}
                >
                    Favorites
                </button>
            </div>
        {/if}
    </div>
</nav>
