import { Service } from "@freshgum/typedi";
import { Renderer } from "../types/renderer.interface.ts";

@Service([ ])
export class DiscordRenderer implements Renderer {
    async forceRender() {
        /** No-op. */
    }

    start(): void | Promise<void> {
        throw new Error("Method not implemented.");
    }

    dispose(): void | Promise<void> {
        throw new Error("Method not implemented.");
    }
}