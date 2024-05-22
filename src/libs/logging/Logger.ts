import pino from 'pino';

import { ServiceConstants } from '@ServiceConstants';
import type { ILogger } from './ILogger';
import { LogLevel } from './LogLevel';

export interface LoggerOptions {
	name?: string;
	logLevel?: LogLevel;
	base?: object;
}

class PinoLogger implements ILogger {
	private readonly logger: pino.Logger;

	constructor(options: LoggerOptions) {
		if (!options.logLevel) {
			const isTraceEnvironment = ServiceConstants.stage === 'local' || ServiceConstants.stage === 'dev';
			options.logLevel = isTraceEnvironment ? LogLevel.trace : LogLevel.warn;
		}

		const pinoOptions: pino.LoggerOptions = {
			name: options.name,
			level: options.logLevel,
			base: options.base,
		};
		this.logger = pino(pinoOptions);

		this.logger.child({});
	}

	trace<T extends object>(message: string, metadata?: T): void {
		if (metadata != null) {
			this.logger.trace<T>(metadata, message);
		} else {
			this.logger.trace({}, message);
		}
	}

	debug<T extends object>(message: string, metadata?: T): void {
		if (metadata != null) {
			this.logger.debug<T>(metadata, message);
		} else {
			this.logger.debug({}, message);
		}
	}

	info<T extends object>(message: string, metadata?: T): void {
		if (metadata != null) {
			this.logger.info<T>(metadata, message);
		} else {
			this.logger.info({}, message);
		}
	}

	warn<T extends object>(message: string, metadata?: T): void {
		if (metadata != null) {
			this.logger.warn<T>(metadata, message);
		} else {
			this.logger.warn({}, message);
		}
	}

	error<T extends object>(message: string, metadata?: T): void {
		if (metadata != null) {
			this.logger.error<T>(metadata, message);
		} else {
			this.logger.error({}, message);
		}
	}

	fatal<T extends object>(message: string, metadata?: T): void {
		if (metadata != null) {
			this.logger.fatal<T>(metadata, message);
		} else {
			this.logger.fatal({}, message);
		}
	}
}

export const Logger = new PinoLogger({
	name: ServiceConstants.serviceName,
	logLevel: ServiceConstants.logLevel,
	base: {
		service: ServiceConstants.serviceName,
		stage: ServiceConstants.stage,
		region: ServiceConstants.region,
		λ: ServiceConstants.lambda_name,
	},
});
