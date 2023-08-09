import { ListenBrainzEndpointTemplates } from "../constants/listenbrainz-endpoints.const.ts";

export type EndpointTemplateOrNull<T extends keyof ListenBrainzEndpointTemplates, U = ListenBrainzEndpointTemplates[T]> =
    U extends never ? undefined : U;

export interface ListenBrainzEndpointOptions<T extends keyof ListenBrainzEndpointTemplates> {
    /**
     * Whether the request should be delivered with a token, if present.
     */
    provideToken?: boolean;

    /** Values to interpolate for the specified endpoint. */
    values: EndpointTemplateOrNull<T>;
}
