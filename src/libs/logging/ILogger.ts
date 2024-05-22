export interface ILogger {
	trace: <T extends object>(message: string, metadata?: T) => void;
	debug: <T extends object>(message: string, metadata?: T) => void;
	info: <T extends object>(message: string, metadata?: T) => void;
	warn: <T extends object>(message: string, metadata?: T) => void;
	error: <T extends object>(message: string, metadata?: T) => void;
	fatal: <T extends object>(message: string, metadata?: T) => void;
}
