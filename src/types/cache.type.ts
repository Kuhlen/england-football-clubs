import type { TeamDetail } from "./team.type";

export interface CacheData<T> {
    data: T;
    timestamp: number;
    expiry: number;
}

export interface CachedTeamDetail {
    data: TeamDetail;
    cachedAt: number;
    lastFetched: number;
}

export interface FavoritesCache {
    teams: Record<number, CachedTeamDetail>;
    favoriteIds: number[];
    lastUpdated: number;
}
