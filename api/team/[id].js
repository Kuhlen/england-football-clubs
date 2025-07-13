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

    const { id } = req.query;

    if (!id) {
        res.status(400).json({ error: "Team ID is required" });
        return;
    }

    try {
        const response = await fetch(`${process.env.VITE_FOOTBALL_API_URL}/${id}`, {
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
        console.error("Error fetching team detail:", error);
        res.status(500).json({
            error: "Failed to fetch team detail",
            message: error.message,
        });
    }
}
