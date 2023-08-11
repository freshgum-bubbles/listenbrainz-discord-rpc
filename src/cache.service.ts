import { Service } from '@freshgum/typedi';
import { ListenBrainzTrackMetadata } from './api-responses/NowPlaying.ts';
import { BehaviorSubject } from 'rxjs';

@Service([ ])
export class CacheService {
    public cachedNowPlaying$ = new BehaviorSubject<null | ListenBrainzTrackMetadata>(null);

    public isEqualToCachedNowPlaying (currentTrack: ListenBrainzTrackMetadata) {
        const cachedTrack = this.cachedNowPlaying$.value;

        if (cachedTrack == null) {
            /**
             * If we don't have the value cached in the first place, we consider it out-of-date.
             */
            return false;
        }

        const { additional_info: lAdditionalInfo } = cachedTrack;
        const { additional_info: rAdditionalInfo } = currentTrack;

        return (
            lAdditionalInfo.track_mbid === rAdditionalInfo.track_mbid &&
            lAdditionalInfo.release_mbid === rAdditionalInfo.release_mbid &&
            lAdditionalInfo.artist_mbids === rAdditionalInfo.artist_mbids &&
            lAdditionalInfo.tracknumber === rAdditionalInfo.tracknumber
        );
    }

    public notifyCurrentTrack (currentTrack: ListenBrainzTrackMetadata) {
        if (this.isEqualToCachedNowPlaying(currentTrack)) {
            return false;
        }

        this.cachedNowPlaying$.next(currentTrack);
        return true;
    }
}
