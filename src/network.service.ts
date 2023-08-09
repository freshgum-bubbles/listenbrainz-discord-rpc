import { Service } from '@freshgum/typedi';
import fetch, { RequestInfo, RequestInit, Response } from 'node-fetch';

/**
 * A lightweight networking service to allow for testing the application,
 * without it making any requests to external servers.
 */
@Service([ ])
export class NetworkService {
    fetch (input: RequestInfo | URL, init?: RequestInit | undefined): Promise<Response> {
        return fetch(input, init);
    }
}
