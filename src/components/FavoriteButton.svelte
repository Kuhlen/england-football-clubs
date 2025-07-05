<script lang="ts">
    interface Props {
        isFavorited: boolean;
        toggleFavorite: () => void;
    }

    let { isFavorited, toggleFavorite }: Props = $props();
    let loveBtn = $state<HTMLButtonElement | null>(null);

    /**
     * Creates animated floating hearts effect when item is favorited
     */
    function createFloatingHearts(): void {
        if (!loveBtn) return;

        const heartsContainer = document.createElement("div");
        heartsContainer.className = "fixed inset-0 pointer-events-none z-50";
        document.body.appendChild(heartsContainer);

        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const heart = document.createElement("div");
                heart.innerHTML = '<i class="fas fa-heart text-red-500"></i>';
                heart.className = "absolute text-2xl opacity-0";

                if (!loveBtn) return;
                const btnRect = loveBtn.getBoundingClientRect();
                heart.style.left = btnRect.left + Math.random() * btnRect.width + "px";
                heart.style.top = btnRect.top + btnRect.height / 2 + "px";

                heartsContainer.appendChild(heart);

                const animation = heart.animate(
                    [
                        {
                            opacity: "0",
                            transform: "translateY(0px) scale(0.5)",
                        },
                        {
                            opacity: "1",
                            transform: "translateY(-20px) scale(1)",
                        },
                        {
                            opacity: "0",
                            transform: "translateY(-60px) scale(0.8)",
                        },
                    ],
                    {
                        duration: 1500,
                        easing: "ease-out",
                    },
                );

                animation.addEventListener("finish", () => {
                    heart.remove();
                    if (heartsContainer.children.length === 0) {
                        heartsContainer.remove();
                    }
                });
            }, i * 100);
        }
    }

    function handleToggle(): void {
        const wasFavorited = isFavorited;
        toggleFavorite();

        // Only create hearts if we just favorited (not unfavorited)
        if (!wasFavorited) {
            createFloatingHearts();
        }
    }
</script>

<button
    bind:this={loveBtn}
    onclick={handleToggle}
    class="love-btn mx-auto flex items-center space-x-3 rounded-full border border-gray-700/30 bg-gray-800/60 px-6 py-3 backdrop-blur-sm hover:border-red-500/50"
    class:favorited={isFavorited}
>
    <i
        class="fas fa-heart text-xl transition-colors duration-300"
        class:text-gray-400={!isFavorited}
        class:text-white={isFavorited}
    ></i>
    <span class="font-medium text-white">
        {isFavorited ? "Added to Favorites" : "Add to Favorites"}
    </span>
</button>

<style>
    .love-btn {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
    }

    .love-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
    }

    .love-btn.favorited {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        animation: heartbeat 1.5s ease-in-out infinite;
    }

    .love-btn.favorited i {
        color: white !important;
    }

    @keyframes heartbeat {
        0% {
            transform: scale(1);
        }
        14% {
            transform: scale(1.05);
        }
        28% {
            transform: scale(1);
        }
        42% {
            transform: scale(1.02);
        }
        70% {
            transform: scale(1);
        }
    }
</style>
