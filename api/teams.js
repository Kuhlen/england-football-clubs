export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    if (req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    try {
        const response = await fetch("https://api.football-data.org/v2/teams/", {
            headers: {
                "X-Auth-Token": process.env.VITE_FOOTBALL_API_TOKEN,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=86400");
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching teams:", error);
        res.status(500).json({
            error: "Failed to fetch teams data",
            message: error.message,
        });
    }
}
