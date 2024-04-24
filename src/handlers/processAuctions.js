import createError from 'http-errors';
import {getEndedAuctions} from "../lib/getEndedAuctions";
import {closeAuction} from "../lib/closeAuction";

async function processAuctions(event, context) {
  let auctionsToClose = [];
  try {
    auctionsToClose = await getEndedAuctions();
    await Promise.all(auctionsToClose.map(auction => closeAuction(auction)));
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {closed: auctionsToClose.length};
}

export const handler = processAuctions;