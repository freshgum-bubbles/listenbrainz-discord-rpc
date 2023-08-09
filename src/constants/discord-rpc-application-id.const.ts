import { Token } from "@freshgum/typedi";

export const DISCORD_RPC_APPLICATION_ID = new Token<string>(
    'The ID of the Discord application to use for the Discord RPC API.'
);
