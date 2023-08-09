import { Service } from '@freshgum/typedi';
import { AppHost } from './types/app-host.interface.ts';
import { DiscordRPCClientService } from './discord-rpc-client.service.ts';
import { ListenBrainzClientService } from './listenbrainz-client.service.ts';
import { EventLoopService } from './event-loop.service.ts';
import { LogService } from './log.service.ts';
import { CacheService } from './cache.service.ts';
import { Subscription, concatMap, filter, map } from 'rxjs';
import { DiscordRPCPresenceService } from './discord-rpc-presence.service.ts';

@Service([DiscordRPCClientService, ListenBrainzClientService, EventLoopService, LogService, CacheService, DiscordRPCPresenceService])
export class RootService implements AppHost {
	constructor(
		private rpcClient: DiscordRPCClientService,
		private listenBrainzClient: ListenBrainzClientService,
		private eventLoop: EventLoopService,
        private logger: LogService,
        private cache: CacheService,
        private rpcPresence: DiscordRPCPresenceService
	) {}

    private rpcCacheSubscription: Subscription | null = null;

	async start(): Promise<void> {
        /** Firstly, ensure the token is correct. */
        const isTokenCorrect = await this.isTokenCorrect();

        if (!isTokenCorrect) {
            this.logger.log('The provided ListenBrainz token is not valid. Disposing.');
            return this.dispose();
        }

        /** Begin polling the ListenBrainz API. */
		this.eventLoop.start();
        await this.rpcClient.createGlobalAuthenticatedClient();

        this.rpcCacheSubscription = this.cache.cachedNowPlaying$.pipe(
            filter(trackOrNull => trackOrNull !== null),
            map(track => this.rpcPresence.createPresenceFromTrackMetadata(track!)),
            concatMap(presence => this.rpcClient.updateCurrentPresence(presence))
        ).subscribe();
	}

    async isTokenCorrect () {
        try {
            return this.listenBrainzClient.validateToken();
        } catch (error) {
            this.logger.log('Error checking ListenBrainz token is correct: ', error);
            return false;
        }
    }

	async dispose(): Promise<void> {
        /** Stop polling the ListenBrainz API. */
        this.eventLoop.dispose();
        this.rpcCacheSubscription?.unsubscribe();
    }
}
