import { Service } from '@freshgum/typedi';
import { Client as RPCClient, Presence as RPCPresence } from 'discord-rpc';
import { DISCORD_RPC_APPLICATION_ID } from './constants/discord-rpc-application-id.const.ts';
import { DISCORD_RPC_APPLICATION_SCOPES } from './constants/discord-rpc-application-scopes.const.ts';
import { DISCORD_RPC_TRANSPORT } from './constants/discord-rpc-transport.const.ts';
import { BehaviorSubject } from 'rxjs';
import { DiscordRPCTransportType } from './types/discord-rpc-transport.type.ts';

@Service([DISCORD_RPC_APPLICATION_ID, DISCORD_RPC_APPLICATION_SCOPES, DISCORD_RPC_TRANSPORT])
export class DiscordRPCClientService {
	constructor(private appID: string, private appScopes: string[], private rpcTransport: DiscordRPCTransportType) {}

	/** The RPC client currently in use by the application. */
	public rpcClient: RPCClient | null = null;

	/**
	 * A behaviour subject with contains either null, if no activity has been
	 * rendered yet, or a cached version of the previously set presence.
	 *
	 * Note that the value here isn't guaranteed to be what's displayed on Discord.
	 * Aside from application or networking errors, the two shouldn't generally drift apart.
	 */
	protected rpcActivity$ = new BehaviorSubject<null | RPCPresence>(null);

	async updateCurrentPresence(presence: RPCPresence) {
		if (!this.rpcClient) {
			return null;
		}

		/** Not sure what this returns, but it might be important? */
		const returnValue = await this.rpcClient.setActivity(presence);

		/** Only update the subject if we're somewhat certain it's been updated. */
		this.rpcActivity$.next(presence);

        return returnValue;
	}

	/**
	 * Create a new instance of the Discord RPC {@link Client} class.
	 * The returned class will not be logged in.
	 */
	createUnauthenticatedClient() {
		return new RPCClient({ transport: this.rpcTransport });
	}

	/**
	 * Create a new instance of the Discord RPC {@link Client} class.
	 * The returned class will be authenticated with the credentials specified in the container.
	 */
	async createAuthenticatedClient() {
		const { appID, appScopes } = this;

		const client = this.createUnauthenticatedClient();
		return client.login({ clientId: appID, scopes: appScopes });
	}

	/**
	 * Create an authenticated RPC client and attach it to {@link DiscordRPCClientService.rpcClient}.
	 */
	async createGlobalAuthenticatedClient() {
		if (this.rpcClient) {
			throw new Error('An RPC client is already attached.');
		}

		const authenticatedClient = await this.createAuthenticatedClient();
		this.rpcClient = authenticatedClient;
	}

    async destroyGlobalAuthenticatedClient () {
        if (!this.rpcClient) {
            throw new Error('Cannot destroy an RPC client when one is not present.');
        }

        try {
            await this.rpcClient.destroy();
        } finally {
            this.rpcActivity$.next(null);
            this.rpcClient = null;
        }
    }
}
