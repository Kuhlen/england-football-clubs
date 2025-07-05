export interface Coach {
    id: number;
    firstName: string;
    lastName: string;
    name: string;
    dateOfBirth: string;
    nationality: string;
}

export interface Team {
    id: number;
    name: string;
    shortName: string;
    crestUrl: string;
    area: {
        name: string;
    };
    founded: number;
    venue: string;
    tla?: string;
}

export interface TeamsResponse {
    teams: Team[];
}

export interface Player {
    id: number;
    name: string;
    position: string | null;
    dateOfBirth: string;
    countryOfBirth: string | null;
    nationality: string;
    shirtNumber?: number | null;
    role: "PLAYER" | "COACH";
}

export interface TeamDetail {
    id: number;
    name: string;
    shortName: string;
    tla: string;
    crestUrl: string;
    address: string;
    phone?: string;
    website: string;
    email?: string;
    founded: number;
    clubColors: string;
    venue: string;
    squad: Player[];
    area: {
        id: number;
        name: string;
    };
    activeCompetitions: {
        id: number;
        name: string;
        code: string;
        plan: string;
        area: {
            id: number;
            name: string;
        };
    }[];
    lastUpdated: string;
}
