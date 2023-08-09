import { Service } from '@freshgum/typedi';
import { NetworkService } from './network.service.ts';
import { LISTENBRAINZ_HOST } from './constants/listenbrainz-host.const.ts';
import { LISTENBRAINZ_TOKEN } from './constants/listenbrainz-token.const.ts';
import {
	ListenBrainzEndpoint,
	ListenBrainzEndpointTemplates,
} from './constants/listenbrainz-endpoints.const.ts';
import { ListenBrainzEndpointOptions } from './types/listenbrainz-endpoint-options.ts';
import { RequestInit, Headers } from 'node-fetch';
import { renderTemplateWithValues } from './utilities/render-template-with-values.util.ts';

@Service([LISTENBRAINZ_HOST, LISTENBRAINZ_TOKEN, NetworkService])
export class ListenBrainzClientService {
	constructor(
		private host: string,
		private token: string,
		private network: NetworkService
	) {}

	/**
	 * Create a {@link URL} from the name of a ListenBrainz endpoint.
	 *
	 * @example
	 * ```ts
	 * const renderedEndpoint =
	 * const url: URL = client.createURLFromListenBrainzEndpoint()
	 * ```
	 */
	protected createURLFromListenBrainzEndpoint(endpoint: string) {
		return new URL(`${this.host}/${endpoint}`);
	}

	/**
	 * Create a network request to the specified Listenbrainz API route.
	 *
	 * @param endpoint The endpoint to request.
	 * @param options A list of options to change the behaviour of the request.
	 * @param baseInit Optionally, a {@link RequestInit}.
	 *
	 * @remarks
	 * Note that the `baseInit` argument requires an init with headers of type `Headers`, if they are provided.
	 */
	public fetchListenBrainzEndpoint<
		T extends keyof ListenBrainzEndpointTemplates
	>(
		endpoint: T,
		options?: ListenBrainzEndpointOptions<T>,
		baseInit?: RequestInit & { headers?: Headers }
	) {
		const templateValues = options?.values;
		const renderedURL = templateValues ? renderTemplateWithValues<T>(endpoint, templateValues!) : endpoint;
		const url = this.createURLFromListenBrainzEndpoint(renderedURL);

		/**
		 * Ensure we have a valid `RequestInit` object which we can mutate with `options`.
		 * We clone `baseInit` here as we wouldn't want to mutate the original object.
		 */
		const init = { ...baseInit } ?? {};

		// Ensure the `init` object has a Headers value.
		if (!init.headers) {
			init.headers = new Headers();
		}

		/**
		 * If the options tells us to deliver a token in the headers (or it does not),
		 * then we must attach it to the headers object of the `RequestInit`.
		 *
		 * Note that providing a token is the default.
		 */
		if (options?.provideToken ?? true) {
			if (!this.token) {
				/** This should never happen. */
				throw new Error(
					'An authenticated API request was attempted, but a token is not present.'
				);
			}

			init.headers.set('Authorization', `Token ${this.token}`);
		}

		return this.network.fetch(url, init);
	}

	/**
	 * Validate the token provided in the current environment.
	 *
	 * @returns A promise indicating whether the token is valid.
	 *
	 * @throws Error
	 * An error may be thrown as a result of the network request.
	 */
	async validateToken(): Promise<boolean> {
		const { token: proposedToken } = this;

		/** Perform some very basic sanity checking straight away. */
		if (proposedToken == null || proposedToken.trim() === '') {
			return false;
		}

		const validateTokenEndpoint = ListenBrainzEndpoint.ValidateToken;

		return this.fetchListenBrainzEndpoint(validateTokenEndpoint).then(response => {
			return response.status === 200;
		});
	}
}
