import { Service } from "@freshgum/typedi";
import { Presence } from "discord-rpc";
import { ListenBrainzTrackMetadata } from "./api-responses/NowPlaying.ts";

@Service([ ])
export class DiscordRPCPresenceService {
    createPresenceFromTrackMetadata (track: ListenBrainzTrackMetadata) {
        const { release_name: albumName, track_name: trackName, artist_name: artistName } = track;
        const presence: Presence = {
            /** Set the state to the album name. */
            state: albumName,
            details: `Listening to ${trackName} - ${artistName}`
        };

        return presence;
    }
}
