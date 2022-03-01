export const environment = {
  production: false,
  auth: {
    domain: process.env.NG_APP_DOMAIN,
    clientId: process.env.NG_APP_CLIENT_ID,
    redirectUri: window.location.origin,
    audience: process.env.NG_APP_AUDIENCE,
  },
  backendURL: 'localhost:8080',
  protocol: 'http:'
};
