import serverless from 'serverless-http';
import { connectLambda } from '@netlify/blobs';

let appHandler;

export async function handler(event, context) {
  process.env.NETLIFY = 'true';
  connectLambda(event);
  if (!appHandler) {
    const { app } = await import('../../server/index.js');
    appHandler = serverless(app);
  }
  return appHandler(event, context);
}
