import micromustache from 'micromustache';
import {
	ListenBrainzEndpoint,
	ListenBrainzEndpointTemplates,
} from '../constants/listenbrainz-endpoints.const.ts';

/**
 * Interpolate values in a template provided as a {@link ListenBrainzEndpoint} member.
 */
export function renderTemplateWithValues<
	T extends keyof ListenBrainzEndpointTemplates
>(endpoint: T, values: ListenBrainzEndpointTemplates[T]): string;

/**
 * Interpolate values in a template with those specified in the values parameter.
 *
 * @remarks
 * Interpolations in templates must use single brackets (`{` and `}`) as opposed
 * to the standard double brackets (`{{` and `}}`).
 *
 * @param template The template to interpolate.
 * @param values The values to interpolate into the specified template.
 *
 * @example
 * ```ts
 * renderTemplateWithValues("{value}", { value: "hello" });
 * // -> "hello"
 * ```
 *
 * @privateRemarks
 * This is not provided as a service, as the application depends on {@link ListenBrainzEndpoint},
 * which contains Micromustache templates -- as that is the main use-case for this function,
 * abstracting this functionality into a service would be virtually pointless.
 *
 * @returns
 * A rendered version of the template.
 */
export function renderTemplateWithValues(
	template: string,
	values: Record<string, string>
) {
	return micromustache.render(template, values, {
		tags: ['{', '}'],
	});
}
