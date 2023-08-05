const options = {
    // ... other options ...
    agent: new http.Agent({ 
      proxy: {
        host: proxyHost,
        port: proxyPort,
        auth: 'username:password', // Replace with your actual username and password
      }
    })
  };
  const https = require('https');

  const options = {
    hostname: 'api.ipify.org',
    port: 443, // Use 443 for HTTPS
    path: '/',
    method: 'GET',
    agent: new https.Agent({ 
      // ... proxy configuration ...
    })
  };
  
  const request = https.request(options, (response) => {
    // ... handle the response ...
  });