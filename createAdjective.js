import { SSM } from 'aws-sdk'
const ssm = new SSM();
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
  try {
    var request = await ssm.getParameter({ Name: 'adjectiveslength', WithDecryption: false }).promise()
    var max = parseInt(request.Parameter.Value)
    

  } catch (e) {
    return failure({ error: "Adjectives length parameter failed" })
  }

  const params = {
    TableName: "adjectives",
    Item: {
      id: max + 1,
      content: data.content,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    await ssm.putParameter({ Name: 'adjectiveslength', Type: "String", Value: (max + 1).toString(), Overwrite: true }).promise()
    return success(params.Item);
  } catch (e) {
    return failure({ status: false })
  }
}
