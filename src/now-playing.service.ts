import { Service } from '@freshgum/typedi';
import { ListenBrainzClientService } from './listenbrainz-client.service.ts';
import { ListenBrainzEndpoint, ListenBrainzEndpointTemplates } from './constants/listenbrainz-endpoints.const.ts';
import { ListenBrainzPlayingNowResponse } from './api-responses/NowPlaying.ts';
import { doesZodTypeMatchValue } from './utilities/zod-guard.util.ts';
import { LogService } from './log.service.ts';
import { LISTENBRAINZ_USERNAME } from './constants/listenbrainz-username.const.ts';

@Service([ListenBrainzClientService, LogService, LISTENBRAINZ_USERNAME])
export class NowPlayingService {
	constructor(
		private listenBrainzClient: ListenBrainzClientService,
        private logger: LogService,
        private userName: string
	) {}

	public async getNowPlayingFromListenBrainz(): Promise<ListenBrainzPlayingNowResponse | null> {
        const endpoint = ListenBrainzEndpoint.UserPlayingNow;
		const response = await this.listenBrainzClient.fetchListenBrainzEndpoint(endpoint, {
            values: { user_name: this.userName }
        });
        
        if (response.status !== 200) {
            this.logger.log('ListenBrainz returned a non-200 status code: ', response.status);
            return null;
        }

        /** Now we know the value is correct, let's unpack it. */
        const jsonResponse = await response.json();

        /** Ensure the input is of the expected type. */
        if (doesZodTypeMatchValue(ListenBrainzPlayingNowResponse, jsonResponse)) {
            return jsonResponse;
        }

        return null;
	}
}
