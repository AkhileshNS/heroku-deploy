const { exec } = require('child_process');

exec('heroku git:remote --app 12345', (err, stdout, stderr) =>
  console.log({ err, stdout, stderr })
);
