export const environment = {
  production: false,
  auth: {
    domain: process.env.NG_APP_DOMAIN,
    clientId: process.env.NG_APP_CLIENT_ID,
    redirectUri: process.env.NG_APP_REDIRECT_URI,
    audience: process.env.NG_APP_AUDIENCE,
  },
  backendURL: process.env.NG_APP_BACKEND_URL,
  protocol: 'http://'
};
