import { ServiceConstants } from '@ServiceConstants';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const marshallOptions = {
	// Whether to automatically convert empty strings, blobs, and sets to 'null'.
	convertEmptyValues: false, // false, by default.
	// Whether to remove undefined values while marshalling.
	removeUndefinedValues: false, // false, by default.
	// Whether to convert typeof object to map attribute.
	convertClassInstanceToMap: false, // false, by default.
};

const unmarshallOptions = {
	// Whether to return numbers as a string instead of converting them to native JavaScript numbers.
	wrapNumbers: false, // false, by default.
};

const options = { region: ServiceConstants.region };
if (process.env.STAGE === 'local') {
	Object.assign(options, {
		endpoint: 'http://localhost:4566',
		credentials: {
			accessKeyId: 'XXXXXX',
			secretAccessKey: 'XXXXXX',
		},
	});
}

export const dynamoDBClient = DynamoDBDocumentClient.from(new DynamoDBClient(options), {
	marshallOptions,
	unmarshallOptions,
});
