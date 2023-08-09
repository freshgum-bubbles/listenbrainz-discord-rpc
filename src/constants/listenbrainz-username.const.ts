import { Token } from "@freshgum/typedi";

export const LISTENBRAINZ_USERNAME = new Token<string>(
    'The ListenBrainz username of the user to collect Now Playing metadata from.'
);
