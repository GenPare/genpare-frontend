export const environment = {
  production: false,
  auth: {
    domain: process.env.NG_APP_DOMAIN,
    clientId: process.env.NG_APP_CLIENT_ID,
    redirectUri: 'http://localhost:4200/success',
    audience: process.env.NG_APP_AUDIENCE,
  },
  backendURL: 'localhost:8280',
  protocol: 'http://'
};
