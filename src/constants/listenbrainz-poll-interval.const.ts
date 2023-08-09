import { Token } from "@freshgum/typedi";

export const LISTENBRAINZ_POLL_INTERVAL = new Token<number>(
    'An interval in milliseconds to use for polling the ListenBrainz API for currently playing music.'
);
