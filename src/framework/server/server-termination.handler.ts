import { LoggingService } from '../logging/logging.service';
declare const process;

export class ServerTerminationHandler {

    private signatures: string[];

    constructor() {
        this.signatures = ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'];
    }

    public init(): void {
        process.on('exit', () => {
            this.terminate(null);
        });

        this.signatures.forEach((element, index, array) => {
            process.on(element, () => {
                this.terminate(element);
            });
        });
    }

    private terminate(signature: string): void {
        try {
            if (signature) {
                LoggingService.log(`Received ${signature} - terminating API ...`);
                process.exit(1);
            }

            LoggingService.log('Node server stopped.');
        }
        catch(err) {
            console.log('node server stopped');
        }
    }
}