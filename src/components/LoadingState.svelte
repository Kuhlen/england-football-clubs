<script lang="ts">
    interface Props {
        message?: string;
        size?: "sm" | "md" | "lg";
    }

    let { message = "Loading...", size = "md" }: Props = $props();

    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-16 w-16",
        lg: "h-24 w-24",
    };
</script>

<div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
        <div class="mx-auto mb-4 {sizeClasses[size]} animate-spin rounded-full border-b-2 border-red-500"></div>
        <p class="text-gray-400">{message}</p>
    </div>
</div>
