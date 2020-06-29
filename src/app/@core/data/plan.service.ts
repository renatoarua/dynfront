/**
 * Mocking client-server processing
 */
import { jsonPlans } from './jsonPlans';
import { Observable } from 'rxjs/Rx';

const TIMEOUT = 100;

export default {
    getPlans(timeout) {
        return Observable.of(jsonPlans)
        	.delay(timeout || TIMEOUT);
    },

    buyPlan(payload, timeout) {
        return Observable.timer(timeout || TIMEOUT);
    }
    // buyProducts: (payload, cb, timeout) => setTimeout(() => cb(), timeout || TIMEOUT)
}