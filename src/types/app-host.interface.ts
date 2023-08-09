export interface AppHost {
    start(): Promise<void> | void;
    dispose(): Promise<void> | void;
}
