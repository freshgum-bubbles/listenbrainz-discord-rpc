import { AppHost } from './app-host.interface.ts';

export interface Renderer extends AppHost {
    forceRender(): Promise<void>;
}
