import { Presence } from "discord-rpc";

export type DiscordRPCPresenceButton = Exclude<Presence['buttons'], undefined>[0];
