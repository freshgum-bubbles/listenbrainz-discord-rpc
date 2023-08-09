import { Service } from '@freshgum/typedi';

@Service([ ])
export class LogService {
    log (...fragments: unknown[]) {
        console.log(fragments);
    }
}