/**
 * An enumerated collection of ListenBrainz endpoints.
 * 
 * Please note that only endpoints which the application uses are present here.
 * This is most certainly not meant to be an exhaustive list.
 * 
 * @remarks
 * Members of this enum are typically templates, which must then be rendered
 * with {@link renderListenBrainzEndpoint} before they can be used as URLs.
 * In line with ListenBrainz' documentation, we use single brackets instead
 * of double brackets, which is the default in Mustache templates.
 * 
 * @remarks **Important!**
 * Any members which require templated values MUST be added to the interface below.
 * 
 * @see https://listenbrainz.readthedocs.io/en/latest/users/api/core.html
 */
export enum ListenBrainzEndpoint {
    ValidateToken = '/1/validate-token',
    UserPlayingNow = '/1/user/{user_name}/playing-now'
}

export interface ListenBrainzEndpointTemplates {
    [ListenBrainzEndpoint.ValidateToken]: never;
    [ListenBrainzEndpoint.UserPlayingNow]: { user_name: string };
}