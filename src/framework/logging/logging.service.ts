import * as moment from 'moment';
import { HttpException } from 'nest.js';

export class LoggingService {
    public static log(error: Error | HttpException | string): void {

        let timestamp: moment.Moment = moment();
        // Make logging non-bloacking

        setTimeout(() => {
            if(error instanceof String === false) {
                LoggingService.executeLogging(<string>error, timestamp);
            }
            else {
                LoggingService.executeErrorLogging(error, timestamp);
            }
        });
    }

    private static executeErrorLogging(error: any, timestamp: moment.Moment): void {
        LoggingService.makeErrorSerializable();
        this.executeLogging(JSON.stringify(error), timestamp);
    }

    private static executeLogging(logText: string, timestamp: moment.Moment): void {
        let readableTimestamp: string = timestamp.toISOString();
        console.error(`${readableTimestamp}: ${logText}`);
    }

    /**
     * Adds property to Error that lets JSON.stringify() serialize {Error}. Will only run if not yet run.
     * Solution from http://stackoverflow.com/questions/18391212/is-it-not-possible-to-stringify-an-error-using-json-stringify#answer-18391400
     *
     * @private
     * @static
     */
    private static makeErrorSerializable() {
        if (!('toJSON' in Error.prototype)) {
            Object.defineProperty(Error.prototype, 'toJSON', {
                value: function () {
                    let alt = {};

                    Object.getOwnPropertyNames(this).forEach(function (key) {
                        alt[key] = this[key];
                    }, this);

                    return alt;
                },
                configurable: true,
                writable: true
            });
        }
    }
}