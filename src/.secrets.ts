import { ContainerInstance } from "@freshgum/typedi";
import { LISTENBRAINZ_TOKEN } from "./constants/listenbrainz-token.const.ts";
import { DISCORD_RPC_APPLICATION_ID } from "./constants/discord-rpc-application-id.const.ts";

export function addSecretsToContainer (container: ContainerInstance) {
    throw new Error("Please update the values in secrets.ts.");
    container.setValue(LISTENBRAINZ_TOKEN, 'XXXXXX-XXXXXX-XXXXXX-XXXXXX-XXXXXX');
    container.setValue(DISCORD_RPC_APPLICATION_ID, 'XXXXXXXXXXXXXXXXXX');
}
