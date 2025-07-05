<script lang="ts">
    import { onMount } from "svelte";
    import { navigate } from "../../router";

    let particleContainer: HTMLElement;

    function navigateToHome(): void {
        navigate("home");
    }

    function goBack(): void {
        window.history.back();
    }

    function createParticle(x: number, y: number): void {
        if (!particleContainer) return;

        const particle: HTMLDivElement = document.createElement("div");
        particle.className = "fixed w-2 h-2 bg-blue-400 rounded-full pointer-events-none z-50";
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.animation = "float-particle 2s ease-out forwards";

        document.body.appendChild(particle);

        setTimeout((): void => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 2000);
    }

    function handleMouseMove(e: MouseEvent): void {
        if (Math.random() < 0.05) {
            // 5% chance to create a particle
            createParticle(e.clientX, e.clientY);
        }
    }

    onMount(() => {
        // Add mouse move listener
        document.addEventListener("mousemove", handleMouseMove);

        // Cleanup
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
        };
    });
</script>

<!-- 404 Error Section -->
<section
    class="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pt-24 pb-16"
>
    <!-- Floating Particles -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden" bind:this={particleContainer}>
        <div class="particle" style="top: 20%; left: 10%;"></div>
        <div class="particle" style="top: 60%; left: 15%;"></div>
        <div class="particle" style="top: 30%; left: 80%;"></div>
        <div class="particle" style="top: 70%; left: 75%;"></div>
        <div class="particle" style="top: 40%; left: 50%;"></div>
    </div>

    <div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <!-- Football Goal Animation -->
        <div class="mb-8 flex justify-center">
            <div class="relative">
                <div class="goal-shake">
                    <i class="fas fa-futbol bounce-ball text-6xl text-blue-400"></i>
                </div>
                <div
                    class="absolute -top-4 -right-4 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400"
                >
                    <i class="fas fa-exclamation text-sm font-bold text-gray-900"></i>
                </div>
            </div>
        </div>

        <!-- Error Number -->
        <h1 class="error-number mb-6 text-8xl font-bold md:text-9xl">404</h1>

        <!-- Error Message -->
        <h2
            class="mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-3xl font-bold text-transparent md:text-5xl"
        >
            Offside!
        </h2>

        <h3 class="gradient-text mb-8 text-xl font-semibold md:text-2xl">The page you're looking for is not in play</h3>

        <p class="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-300">
            It seems like the page you're trying to reach has been substituted out of the game. Don't worry though –
            we've got plenty of other great content to explore!
        </p>

        <!-- Action Buttons -->
        <div class="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
                onclick={navigateToHome}
                class="glow-button group flex transform items-center space-x-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700"
            >
                <i class="fas fa-home"></i>
                <span>Back to Home</span>
            </button>

            <button
                onclick={goBack}
                class="glow-button group flex transform items-center space-x-2 rounded-2xl border border-gray-600/30 bg-gray-700/50 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-gray-600/50"
            >
                <i class="fas fa-arrow-left"></i>
                <span>Go Back</span>
            </button>
        </div>
    </div>
</section>

<style>
    .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .error-number {
        background: linear-gradient(135deg, #ff6b6b 0%, #ffd93d 50%, #6bcf7f 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 50px rgba(255, 107, 107, 0.3);
    }

    .bounce-ball {
        animation: bounce 2s infinite;
    }

    @keyframes bounce {
        0%,
        20%,
        50%,
        80%,
        100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-30px);
        }
        60% {
            transform: translateY(-15px);
        }
    }

    .goal-shake {
        animation: goalShake 0.5s ease-in-out infinite alternate;
    }

    @keyframes goalShake {
        0% {
            transform: translateX(0px);
        }
        100% {
            transform: translateX(5px);
        }
    }

    .glow-button {
        position: relative;
        overflow: hidden;
    }

    .glow-button::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.5s;
    }

    .glow-button:hover::before {
        left: 100%;
    }

    .particle {
        position: absolute;
        width: 6px;
        height: 6px;
        background: rgba(59, 130, 246, 0.8);
        border-radius: 50%;
        animation: float-particle 3s ease-in-out infinite;
    }

    @keyframes float-particle {
        0%,
        100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0.8;
        }
        50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
        }
    }

    .particle:nth-child(2) {
        animation-delay: 0.5s;
        background: rgba(139, 92, 246, 0.8);
    }
    .particle:nth-child(3) {
        animation-delay: 1s;
        background: rgba(236, 72, 153, 0.8);
    }
    .particle:nth-child(4) {
        animation-delay: 1.5s;
        background: rgba(34, 197, 94, 0.8);
    }
    .particle:nth-child(5) {
        animation-delay: 2s;
        background: rgba(251, 191, 36, 0.8);
    }
</style>
