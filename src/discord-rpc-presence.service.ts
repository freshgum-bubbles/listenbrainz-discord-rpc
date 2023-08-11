import { Optional, Service } from '@freshgum/typedi';
import { Presence } from 'discord-rpc';
import { ListenBrainzTrackMetadata } from './api-responses/NowPlaying.ts';
import { DiscordRPCPresenceButton } from './types/discord-rpc-presence-button.type.ts';
import { LISTENBRAINZ_USERNAME } from './constants/listenbrainz-username.const.ts';

@Service([
    [LISTENBRAINZ_USERNAME, Optional()]
])
export class DiscordRPCPresenceService {
    constructor (private listenBrainzUsername: string | null) { }

	public createPresenceFromTrackMetadata(track: ListenBrainzTrackMetadata) {
		const {
			release_name: albumName,
			track_name: trackName,
			artist_name: artistName,
		} = track;
		const {
			submission_client: clientName,
			submission_client_version: clientVersion,
		} = track.additional_info;

		/**
		 * Gracefully degrade to just saying we don't know who the artist is
		 * when the track wasn't recognised my MusicBrainz.
		 */
		const state = albumName ? `${artistName} - ${albumName}` : 'Unknown Artist - Unknown Album';

		const presence: Presence = {
			details: `Listening to ${trackName}`,
			/** Set the state to the album name. */
			state,
			smallImageKey: 'now-playing-icon',
			smallImageText: `Submitted via ${clientName}, version ${clientVersion}`,
		};

		presence.buttons = this.createButtons(track, presence);
		return presence;
	}

	public createButtons(
		track: ListenBrainzTrackMetadata,
		presence: Omit<Presence, 'buttons'>
	): DiscordRPCPresenceButton[] {
		return [
            this.createViewMyListenBrainzButton(),
			this.createViewTrackOnMusicBrainzButton(track),
			// this.createViewAlbumOnMusicBrainzButton(track)
		].filter(item => item !== null) as DiscordRPCPresenceButton[];
	}

    private createViewMyListenBrainzButton(): DiscordRPCPresenceButton | null {
        if (!this.listenBrainzUsername) {
            return null;
        }

        return {
            label: 'View my ListenBrainz',
            url: `https://listenbrainz.org/user/${this.listenBrainzUsername}`
        }
    }

	private createViewTrackOnMusicBrainzButton(
		track: ListenBrainzTrackMetadata
	): DiscordRPCPresenceButton | null {
		const url = this.createMusicBrainzRecordingURLForTrack(track);

		if (!url) {
			return null;
		}

		return {
			label: 'View Track on MusicBrainz',
			url,
		};
	}

	private createMusicBrainzRecordingURLForTrack(
		track: ListenBrainzTrackMetadata
	): string | null {
		const { track_mbid: trackMbID } = track.additional_info;

		if (!trackMbID) {
			return null;
		}

		return `https://musicbrainz.org/recording/${trackMbID}`;
	}

	private createViewAlbumOnMusicBrainzButton(
		track: ListenBrainzTrackMetadata
	): DiscordRPCPresenceButton | null {
		const url = this.createMusicBrainzReleaseURLForTrack(track);

		if (!url) {
			return null;
		}

		return {
			label: 'View Album on MusicBrainz',
			url,
		};
	}

	private createMusicBrainzReleaseURLForTrack(
		track: ListenBrainzTrackMetadata
	): string | null {
		const { release_mbid: releaseMbID } = track.additional_info;

		if (!releaseMbID) {
			return null;
		}

		return `https://musicbrainz.org/release/${releaseMbID}`;
	}
}
