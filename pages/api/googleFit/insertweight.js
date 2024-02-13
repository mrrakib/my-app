import { google } from 'googleapis';
import Cors from 'micro-cors';

const cors = Cors({
    allowMethods: ['GET', 'POST'], // Adjust the allowed methods as needed
    origin: '*',
});


const handler = async (req, res) => {
  try {
    // Use the googleapis library to make a request to the Fitness API
    const fitness = google.fitness({ version: 'v1' });
    console.log(fitness.users.dataset);
    // Example payload for posting weight data
    const weightData = {
      dataSourceId: 'derived:com.google.weight:com.google.android.gms:merge_weight',
      timestampMillis: Date.now(),
      value: {
        fpVal: 59,
      },
    };

    // Insert the data point into the Fitness API
    const insertDataResponse = await fitness.users.dataSources.datasets.patch({
      userId: 'me',
      dataSourceId: weightData.dataSourceId,
      datasetId: 'derived:com.google.weight:com.google.android.gms:merge_weight',
      requestBody: {
        dataSourceId: weightData.dataSourceId,
        maxEndTimeNs: weightData.timestampMillis * 1000000,
        minStartTimeNs: weightData.timestampMillis * 1000000,
        point: [
          {
            dataTypeName: 'com.google.weight',
            startTimeNanos: weightData.timestampMillis * 1000000,
            endTimeNanos: weightData.timestampMillis * 1000000,
            value: {
              fpVal: weightData.value.fpVal,
            },
          },
        ],
      },
    });

    console.log('Weight data posted successfully:', insertDataResponse.data);

    res.status(200).json({ message: 'Weight data posted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default cors(handler);
