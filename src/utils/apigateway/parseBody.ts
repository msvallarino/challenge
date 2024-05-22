import { badData } from '@hapi/boom';

export function parseBody(stringifyBody: string | undefined): Record<string, unknown> {
	if (stringifyBody == null) {
		return {};
	}

	try {
		// Attempt to parse the JSON string
		return JSON.parse(stringifyBody);
	} catch (error) {
		throw badData('Malformed JSON');
	}
}
