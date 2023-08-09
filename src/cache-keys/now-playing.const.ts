import { Token } from "@freshgum/typedi";
import { ListenBrainzTrackMetadata } from "../api-responses/NowPlaying";

export const CACHED_NOW_PLAYING = new Token<ListenBrainzTrackMetadata>(
    'The currently-cached track which the user is playing.'
);
