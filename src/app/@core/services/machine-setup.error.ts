import { MachineError } from '../models/shaft';

export class MachineSetupError {
	// extends Error
    error: any | null;
    message: string;
    code: number;
    /**
     * Errors are never okay, even when the status code is in the 2xx success range.
     */
    readonly ok: boolean;
    constructor(error: MachineError) {
        // Error.captureStackTrace(this, MachineSetupError);
        this.error = error;
        this.message = error.message;
        this.code = error.code;
    }
}