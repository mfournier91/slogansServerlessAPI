import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body);
const nounsArray = data.map((noun) => ({
    PutRequest: {
     Item: {
      "id": noun['id'], 
      "content": noun['content'],
       "createdAt": Date.now()
     }
    }
   }))
  const params = {
    RequestItems: {
        "nouns" : nounsArray
    },
  };

  try {
    await dynamoDbLib.call("batchWrite", params);
    return success(params.Item);
  } catch (e) {
    return failure({ status: false })
  }
}
