const AWS = require('aws-sdk');
const SES = new AWS.SES({ apiVersion: '2010-12-01' });
const db = require('./lib/db');

exports.handler = async (event, context, callback) => {
  try {
    // Get latest logs
    const last24hScrapLogs = await db.getScrapLogs(24);
    console.log({ last24hScrapLogs });

    let emailRes = await sendEmail(last24hScrapLogs);
    callback(null, {
      last24hScrapLogs, //: last24hScrapLogs.map((el) => el.scrapDate),
    });
  } catch (err) {
    callback(err);
    return;
  }
};

const sendEmail = async (logData) => {
  const ToAddress = 'thibaut.dehollain@gmail.com';
  let nonSuccesses = false;

  const textBody = logData
    .map((vehicle, i) => {
      if (!vehicle.log.success) nonSuccesses = true;
      return `
				<tr style='${i > 0 && 'border-top: 1px solid #aaa;'}'>
          <td style='padding: 5px 0 5px 15px; text-align: center;'>${i + 1}</td>
          <td style='padding: 5px 0 5px 15px;'>${vehicle.title}</td>
          <td style='${
            !vehicle.log.success && 'color: #E50000; font-weight: bold; '
          }padding: 5px; text-align: center;'>${vehicle.log.success}</td>
					<td style='padding: 5px; text-align: center;'>${vehicle.log.lastCount}</td>
					<td style='padding: 5px; text-align: center;'>${vehicle.log.oldCount}</td>
				</tr>
			`;
    })
    .join('\n');

  const htmlBody = `
    <!DOCTYPE html>
    <html>
			<head>
			</head>
			<body>
				<div style='font-family: "Helvetica"; background: linear-gradient(45deg,#4158d0,#c850c0); padding: 30px;'>
					<table style='width: 600px; margin: 20px auto; border-collapse: collapse; border-radius: 4px; overflow: hidden;'>
						<thead style='background: #333; font-size: 1.1rem; color: #eee;'>
							<tr>
                <td style='text-align: center; padding: 10px 18px 10px 30px;'>#</td>
                <td style='text-align: center; padding: 10px 30px;'>Vehicle</td>
                <td style='text-align: center; padding: 10px 30px;'>Success</td>
								<td style='text-align: center; padding: 10px 30px;'>Last count</td>
								<td style='text-align: center; padding: 10px 30px;'>Old count</td>
							</tr>
						</thead>
						<tbody style='background: #fff'>
							${textBody}
						</tbody>
					</table>
				</div>
    	</body>
  	</html>
	`;
  const now = new Date();
  const formattedDate = `${('0' + now.getDate()).slice(-2)}/${(
    '0' +
    (now.getMonth() + 1)
  ).slice(-2)}/${now.getFullYear()}`;

  const params = {
    Destination: {
      ToAddresses: [ToAddress],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody,
        },
        Text: {
          Charset: 'UTF-8',
          Data: textBody,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: `Used Cars Log - ${formattedDate}`,
      },
    },
    Source: `Used Cars <${ToAddress}>`,
  };

  // if (!nonSuccesses) return 'All successes, email not sent';
  try {
    let res = await SES.sendEmail(params).promise();
    return res;
  } catch (err) {
    throw new Error('Error sending email: ' + err.message);
  }
};
