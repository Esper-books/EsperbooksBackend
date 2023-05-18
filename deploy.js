const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();

const config = {
    user: 'Esperbooks',
    password: 'P@55k3y!0!',
    host: '198.37.116.18',
    port: 21,
    localRoot: __dirname + '/local-deploy', // Path to the local folder you want to deploy
    remoteRoot: '/www.esperbooksbackend.somee.com/esperbook', // Remote path on the FTP server where files will be uploaded
    include: ['*'], // Patterns of files to include in the deployment
    exclude: [] // Patterns of files to exclude from the deployment
  };

  ftpDeploy.deploy(config, function(err) {
    if (err) {
        console.log('failed');
      console.error(err);
    } else {
      console.log('Deployment successful!');
    }
  });
  