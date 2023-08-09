import { Token } from '@freshgum/typedi';

export const LISTENBRAINZ_TOKEN = new Token<string>('The token to use to authenticate requests to the ListenBrainz API.');
