import { Service } from '@freshgum/typedi';
import { AppHost } from './types/app-host.interface.ts';
import { TimerService } from './timer.service.ts';
import { Observable, Subject, Subscription, concatMap, from } from 'rxjs';
import { LISTENBRAINZ_POLL_INTERVAL } from './constants/listenbrainz-poll-interval.const.ts';
import { LogService } from './log.service.ts';
import { NowPlayingService } from './now-playing.service.ts';
import { CacheService } from './cache.service.ts';

@Service([
	LISTENBRAINZ_POLL_INTERVAL,
	TimerService,
	LogService,
	NowPlayingService,
	CacheService
])
export class EventLoopService implements AppHost {
	constructor(
		private pollInterval: number,
		private timer: TimerService,
		private logger: LogService,
		private nowPlaying: NowPlayingService,
		private cache: CacheService
	) {
		this.apiPollInterval$ = timer.createInterval(pollInterval);
	}

	/** The iterator currently in use to signal when to poll the ListenBrainz API. */
	private apiPollInterval$: Observable<number>;
	
	private apiPollIntervalSubscription: Subscription | null = null;

	private get isRunning() {
		return this.apiPollIntervalSubscription !== null;
	}

	public start() {
		if (this.isRunning) {
			return;
		}

		/**
		 * At this point, we know that the subscription doesn't exist.
		 * Therefore, we need to create it here.
		 */
		this.apiPollIntervalSubscription = this.apiPollInterval$
			.pipe(
				/**
				 * Process each event using the poll member, which returns a promise.
				 * This is mapped to an {@link Observable}.
				 */
				concatMap(() => from(this.pollListenBrainzNowPlaying()))
			)
			.subscribe({
				error: (error: unknown) => {
					this.logger.log('Error when polling ListenBrainz API!', error);
				},
				complete: () => {
					/** This is something the user needs to know about. */
					this.logger.log('The ListenBrainz API is no longer being polled.');
				},
				next: () => {
					// TODO: change to debug log
					this.logger.log('The ListenBrainz API has been polled.');
				},
			});
	}

	protected async pollListenBrainzNowPlaying() {
		/** Ensure we don't fuck up the observable above by throwing an error from network requests. */
		try {
			const nowPlaying = await this.nowPlaying.getNowPlayingFromListenBrainz();

			if (nowPlaying === null) {
				this.logger.log('Invalid response from ListenBrainz\' Now Playing API', nowPlaying);
				return null;
			}

			const { payload } = nowPlaying;

			/** TODO: not 100% sure what playing_now means */
			if (!payload.playing_now) {
				this.logger.log('ListenBrainz reported that nothing is currently playing.');
				return null;
			}

			/** Further sanity checks: make sure there's a track in the response. */
			const [firstTrack] = payload.listens;

			if (!firstTrack) {
				this.logger.log('ListenBrainz reported that a track is playing, but hasn\'t provided that track to us.');
				return null;
			}
			
			/** Notify the cache of the new response. */
			this.cache.notifyCurrentTrack(firstTrack.track_metadata);
		} catch (error) {
			this.logger.log('Error polling ListenBrainz\' Now Playing API', error);
			return null;
		}
	}

	public dispose() {
		if (!this.isRunning) {
			return;
		}

		/** Cancel the polling of the ListenBrainz API. */
        this.apiPollIntervalSubscription!.unsubscribe();
	}
}
