<script lang="ts">
    import { currentRoute } from "./router";
    import Nav from "./components/Nav.svelte";
    import NotFound from "./pages/not-found/NotFound.svelte";
    import Home from "./pages/home/Home.svelte";
    import Detail from "./pages/detail/Detail.svelte";
    import Favorite from "./pages/favorite/Favorite.svelte";
    import Footer from "./components/Footer.svelte";
</script>

<div class="min-h-screen">
    <Nav />
    <main>
        {#if $currentRoute === "favorite"}
            <Favorite />
        {:else if $currentRoute === "detail"}
            <Detail />
        {:else if $currentRoute === "home"}
            <Home />
        {:else}
            <NotFound />
        {/if}
    </main>
    <Footer />
</div>
