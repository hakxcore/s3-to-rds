console.log('Loading function');
const aws = require('aws-sdk');
const os = require('os');
const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));

  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, ' ')
  );
  const params = {
    Bucket: bucket,
    Key: key,
  };
  try {
    const data = await s3.getObject(params).promise();
    const fileArray = data.Body.toString()
      .split(os.EOL)
      .map((e) => e.split(',').map((ee) => ee.trim()));
    const file = [];
    for (let i = 1; i < fileArray.length; i++) {
      const obj = {};
      obj[fileArray[0][0]] = fileArray[i][0];
      obj[fileArray[0][1]] = fileArray[i][1];
      obj[fileArray[0][2]] = fileArray[i][2];
      obj[fileArray[0][3]] = fileArray[i][3];
      obj[fileArray[0][4]] = fileArray[i][4];
      file.push(obj);
    }
    const response = await fetch(
      'http://api-env.eba-6qs36wpr.ap-south-1.elasticbeanstalk.com/',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `${JSON.stringify(file)}`,
      }
    );
    const body = await response.json();
    console.log(body);
    return body;
  } catch (err) {
    console.log(err);
    const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
    console.log(message);
    throw new Error(message);
  }
};
