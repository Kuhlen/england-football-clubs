<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import DOMPurify from "dompurify";

    interface Props {
        title: string;
        message: string;
        confirmText: string;
        cancelText?: string;
        isLoading?: boolean;
        loadingText?: string;
        onConfirm: () => void | Promise<void>;
        onCancel: () => void;
        variant?: "danger" | "warning" | "info";
        icon?: "trash" | "warning" | "clear" | "info";
        showPreview?: boolean;
        previewItems?: Array<{
            id: string | number;
            name: string;
            imageUrl?: string;
            acronym?: string;
        }>;
        maxPreviewItems?: number;
        additionalInfo?: string;
    }

    let {
        title,
        message,
        confirmText,
        cancelText = "Cancel",
        isLoading = false,
        loadingText = "Processing...",
        onConfirm,
        onCancel,
        variant = "danger",
        icon = "warning",
        showPreview = false,
        previewItems = [],
        maxPreviewItems = 8,
        additionalInfo,
    }: Props = $props();

    // Variant styling
    const variantStyles = {
        danger: {
            iconBg: "bg-red-500/20",
            iconColor: "text-red-400",
            confirmButton: "border-red-500/30 bg-red-600/20 text-red-400 hover:bg-red-600/30",
        },
        warning: {
            iconBg: "bg-orange-500/20",
            iconColor: "text-orange-400",
            confirmButton: "border-orange-500/30 bg-orange-600/20 text-orange-400 hover:bg-orange-600/30",
        },
        info: {
            iconBg: "bg-blue-500/20",
            iconColor: "text-blue-400",
            confirmButton: "border-blue-500/30 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30",
        },
    };

    // Icon paths
    const iconPaths = {
        trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
        warning:
            "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z",
        clear: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
        info: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    };

    function handleEscapeKey(event: KeyboardEvent): void {
        if (event.key === "Escape") {
            onCancel();
        }
    }

    function handleBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            onCancel();
        }
    }

    function handleKeydown(event: KeyboardEvent): void {
        if (event.key === "Enter" || event.key === " ") {
            onCancel();
        }
    }

    async function handleConfirm(): Promise<void> {
        await onConfirm();
    }

    onMount(() => {
        document.addEventListener("keydown", handleEscapeKey);
        document.body.style.overflow = "hidden";
    });

    onDestroy(() => {
        document.removeEventListener("keydown", handleEscapeKey);
        document.body.style.overflow = "";
    });

    // Derived values
    const currentVariant = $derived(variantStyles[variant]);
    const visiblePreviewItems = $derived(previewItems.slice(0, maxPreviewItems));
    const remainingItemsCount = $derived(Math.max(0, previewItems.length - maxPreviewItems));
    const safeMessage = $derived(() => DOMPurify.sanitize(message, { ALLOWED_TAGS: ["strong", "em", "p"] }));
</script>

<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    role="button"
    tabindex="0"
    aria-label="Close modal"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
>
    <div
        class="relative mx-4 w-full max-w-lg transform rounded-2xl border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-900 p-6 shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        onclick={(event) => event.stopPropagation()}
        tabindex="0"
        onkeydown={(e) => {
            if (e.key === "Escape") {
                onCancel();
            }
        }}
    >
        <!-- Modal Header -->
        <div class="mb-4 flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">{title}</h3>
            <button
                onclick={onCancel}
                class="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-700/50 hover:text-white"
                aria-label="Close modal"
            >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <!-- Modal Content -->
        <div class="mb-6">
            <!-- Icon -->
            <div class="mb-4 flex justify-center">
                <div class="rounded-full {currentVariant.iconBg} p-3">
                    <svg
                        class="h-8 w-8 {currentVariant.iconColor}"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPaths[icon]} />
                    </svg>
                </div>
            </div>

            <!-- Message -->
            <div class="mb-4 text-center text-gray-300">
                {@html safeMessage()}
            </div>

            <!-- Preview Items (if enabled) -->
            {#if showPreview && previewItems.length > 0}
                <div class="max-h-48 overflow-y-auto rounded-lg bg-gray-800/50 p-4">
                    <p class="mb-3 text-sm text-gray-400">
                        <strong>Items that will be affected:</strong>
                    </p>
                    <div class="space-y-2">
                        {#each visiblePreviewItems as item (item.id)}
                            <div class="flex items-center gap-3 text-sm">
                                <div class="h-6 w-6 flex-shrink-0 overflow-hidden rounded">
                                    {#if item.imageUrl}
                                        <img src={item.imageUrl} alt={item.name} class="h-full w-full object-cover" />
                                    {:else if item.acronym}
                                        <div
                                            class="flex h-full w-full items-center justify-center bg-gray-600 text-xs font-bold text-white"
                                        >
                                            {item.acronym}
                                        </div>
                                    {:else}
                                        <div class="flex h-full w-full items-center justify-center bg-gray-600">
                                            <svg class="h-3 w-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2L3 7v11a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V7l-7-5z" />
                                            </svg>
                                        </div>
                                    {/if}
                                </div>
                                <span class="text-gray-300">{item.name}</span>
                            </div>
                        {/each}
                        {#if remainingItemsCount > 0}
                            <p class="mt-2 text-xs text-gray-500">
                                ... and {remainingItemsCount} more items
                            </p>
                        {/if}
                    </div>
                </div>
            {/if}

            <!-- Additional Info -->
            {#if additionalInfo}
                <div class="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
                    <div class="flex items-center gap-2">
                        <svg
                            class="h-5 w-5 flex-shrink-0 text-orange-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p class="text-sm text-orange-300">
                            {additionalInfo}
                        </p>
                    </div>
                </div>
            {/if}
        </div>

        <!-- Modal Actions -->
        <div class="flex gap-3">
            <button
                onclick={onCancel}
                disabled={isLoading}
                class="flex-1 rounded-xl border border-gray-600 bg-gray-700/50 py-3 font-medium text-gray-300 transition-colors hover:bg-gray-600/50 disabled:opacity-50"
            >
                {cancelText}
            </button>
            <button
                onclick={handleConfirm}
                disabled={isLoading}
                class="flex flex-1 items-center justify-center gap-2 rounded-xl border {currentVariant.confirmButton} py-3 font-medium transition-colors disabled:opacity-50"
            >
                {#if isLoading}
                    <svg class="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    {loadingText}
                {:else}
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={iconPaths[icon]} />
                    </svg>
                    {confirmText}
                {/if}
            </button>
        </div>
    </div>
</div>
