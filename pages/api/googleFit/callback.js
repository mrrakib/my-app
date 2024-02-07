import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import Cors from 'micro-cors';

const cors = Cors({
    allowMethods: ['GET', 'POST'], // Adjust the allowed methods as needed
    origin: '*',
  });

const oAuth2Client = new OAuth2Client(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

const handler = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    // Now you can use `oAuth2Client` to make requests to the Google Fit API
    const fitness = google.fitness({ version: 'v1', auth: oAuth2Client });

    // Example: List the user's fitness data sources
    const dataSources = await fitness.users.dataSources.list({
      userId: 'me',
    });

    res.status(200).json({ data: dataSources.data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default cors(handler);