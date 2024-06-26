import {v4 as uuid} from "uuid";
import AWS from "aws-sdk";
import crateError from 'http-errors';
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
  const {title} = event.body;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endingAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    }
  }

  try {
    await dynamoDB.put({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Item: auction,
    }).promise();
  } catch (error) {
    console.error(error);
    throw new crateError.InternalServerError(error);
  }


  return {
    statusCode: 201,
    body: JSON.stringify({auction}),
  };
}

export const handler = commonMiddleware(createAuction);

