import zod from 'zod';

export function doesZodTypeMatchValue<T> (zodType: zod.ZodType<T>, input: unknown): input is T {
    /**
     * Between you and me, I'm only using Zod because the runtypes plugin for Insomnia
     * doesn't exist any more.  I do generally prefer runtypes over Zod.
     * 
     * The fact that it doesn't have a type guard built in is a bit shit :/
     */
    return zodType.safeParse(input).success;
}
