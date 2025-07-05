<script lang="ts">
    import Filter from "../../components/Filter.svelte";

    interface Props {
        loading: boolean;
        refreshData: () => Promise<void>;
        openClearCacheModal: () => void;
    }

    let { loading, refreshData, openClearCacheModal }: Props = $props();
</script>

<section class="bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pt-24 pb-16">
    <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <h1
            class="mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
        >
            England's Best
        </h1>
        <h2 class="gradient-text mb-6 text-3xl font-bold md:text-5xl">Football Clubs</h2>
        <p class="mx-auto mb-12 max-w-3xl text-xl text-gray-300">
            Discover legendary clubs from England. Explore their history, achievements, and current squad information.
        </p>

        <!-- Action Buttons -->
        <div class="mb-8 flex justify-center gap-4">
            <button
                onclick={refreshData}
                disabled={loading}
                class="rounded-xl border border-blue-500/30 bg-blue-600/20 px-4 py-2 font-medium text-blue-400 transition-colors hover:bg-blue-600/30 disabled:opacity-50"
            >
                {loading ? "Loading..." : "Refresh Data"}
            </button>
            <button
                onclick={openClearCacheModal}
                class="rounded-xl border border-red-500/30 bg-red-600/20 px-4 py-2 font-medium text-red-400 transition-colors hover:bg-red-600/30"
            >
                Clear Cache
            </button>
        </div>

        <!-- Filter Component -->
        <Filter />
    </div>
</section>
