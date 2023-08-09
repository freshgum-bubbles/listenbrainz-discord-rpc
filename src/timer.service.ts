import { Service } from '@freshgum/typedi';
import { Observable, delay, interval } from 'rxjs';

@Service([ ])
export class TimerService {
    /**
     * Create an {@link Observable} that emits 
     * 
     * @see {@link interval}
     */
    createDelay (timeInMs: number) {
        return new Observable(subscriber => {
            const timeoutID = setTimeout(() => {
                subscriber.next();
                subscriber.complete();
            }, timeInMs);

            return function dispose () {
                clearTimeout(timeoutID);
            }
        });
    }

    /**
     * Create an {@link Observable} that emits sequential numbers every specified interval of time.
     * 
     * @see {@link interval}
     */
    createInterval (timeInMs: number) {
        return interval(timeInMs);    
    }
}
