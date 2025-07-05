export interface RouteParams {
    [key: string]: string | number;
}

export interface RouteState {
    route: string;
    params: RouteParams;
}

export type RouteGuard = (route: string) => boolean;

export type RouteName = "home" | "detail" | "favorite";
