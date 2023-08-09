import { Token } from "@freshgum/typedi";
import { DiscordRPCTransportType } from '../types/discord-rpc-transport.type.ts';

export const DISCORD_RPC_TRANSPORT = new Token<DiscordRPCTransportType>(
    'The transport to use for connecting to Discord over IPC.'
);
