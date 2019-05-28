import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
const adjectivesArray = data.map((adj) => ({
    PutRequest: {
     Item: {
      "id": adj['id'], 
      "content": adj['content'],
       "createdAt": Date.now()
     }
    }
   }))
  const params = {
    RequestItems: {
        "adjectives" : adjectivesArray
    },
  };

  try {
    await dynamoDbLib.call("batchWrite", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false })
  }
}
