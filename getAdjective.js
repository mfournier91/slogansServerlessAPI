import { SSM } from 'aws-sdk'
const ssm = new SSM();
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
    try {
        var request = await ssm.getParameter({ Name: 'adjectiveslength', WithDecryption: false }).promise()
        var max = parseInt(request.Parameter.Value)
        var adjectiveLen = Math.floor(Math.random() * max) + 1;

    } catch (e) {
        return failure({ error: "Adjectives length parameter failed" })
    }
    const params = {
        TableName: "adjectives",
        Key: {
            id: adjectiveLen,
        }
    };
    console.log(params)

    try {
        const result = await dynamoDbLib.call("get", params);
        if (result.Item) {
            // Return the retrieved item
            return success(result.Item);
        } else {
            return failure({ status: false, error: "Item not found." });
        }
    } catch (e) {
        return failure({ status: false });
    }
}
