import { Token } from '@freshgum/typedi';

export const LISTENBRAINZ_HOST = new Token<string>('The host of the ListenBrainz API, as a base URL.');