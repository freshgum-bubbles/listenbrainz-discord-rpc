import { Token } from "@freshgum/typedi";

export const DISCORD_RPC_APPLICATION_SCOPES = new Token<string[]>(
    'The scopes to use for the Discord RPC application.'
);
