import AWS from "aws-sdk";
import crateError from 'http-errors';
import commonMiddleware from "../lib/commonMiddleware";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getAuctionById(id) {
  let auction;

  try {
    const result = await dynamoDB.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }).promise();
    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new crateError.InternalServerError(error);
  }

  if (!auction) {
    throw new crateError.NotFound(`Auction with ID "${id}" not found`);
  }

  return auction;
}

async function getAuction(event, context) {
  const { id } = event.pathParameters;

  const auction = await getAuctionById(id);

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = commonMiddleware(getAuction);


