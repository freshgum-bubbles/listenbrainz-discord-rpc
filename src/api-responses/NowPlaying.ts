import { z } from "zod";

// TODO: is TrackMetadata what the API calls this? make sure it is
export const ListenBrainzTrackMetadata = z.object({
    additional_info: z.object({
        artist_mbids: z.optional(z.array(z.string())),
        release_mbid: z.optional(z.string()),
        submission_client: z.string(),
        submission_client_version: z.string(),
        track_mbid: z.optional(z.string()),
        tracknumber: z.optional(z.number()),
    }),
    artist_name: z.string(),
    release_name: z.optional(z.string()),
    track_name: z.string(),
});

export const ListenBrainzPlayingNowResponse = z.object({
  payload: z.object({
    count: z.number(),
    listens: z.array(
      z.object({
        playing_now: z.boolean(),
        track_metadata: ListenBrainzTrackMetadata,
      })
    ),
    playing_now: z.boolean(),
    user_id: z.string(),
  }),
});


export type ListenBrainzPlayingNowResponse = z.infer<typeof ListenBrainzPlayingNowResponse>;
export type ListenBrainzTrackMetadata = z.infer<typeof ListenBrainzTrackMetadata>;
