import AWS from "aws-sdk";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getEndedAuctions() {
  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    IndexName: 'statusAndEndDate',
    KeyConditionExpression: '#status = :status AND endingAt <= :now',
    ExpressionAttributeValues: {
      ':status': 'OPEN',
      ':now': new Date().toISOString(),
    },
    ExpressionAttributeNames: {
      '#status': 'status'
    }
  }

  const result = await dynamoDB.query(params).promise();

  return result.Items;
}