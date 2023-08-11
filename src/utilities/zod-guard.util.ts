import { Container } from '@freshgum/typedi';
import zod from 'zod';
import { LogService } from '../log.service.ts';

export function doesZodTypeMatchValue<T> (zodType: zod.ZodType<T>, input: unknown): input is T {
    const validationResult = zodType.safeParse(input);

    if (validationResult.success === false) {
        // TODO: move this into a service
        Container.get(LogService).log(`Invalid validation result: ${validationResult.error}`);
    }

    /**
     * Between you and me, I'm only using Zod because the runtypes plugin for Insomnia
     * doesn't exist any more.  I do generally prefer runtypes over Zod.
     * 
     * The fact that it doesn't have a type guard built in is a bit shit :/
     */
    return validationResult.success;
}
