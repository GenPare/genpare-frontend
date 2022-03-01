export const environment = {
  production: true,
  auth: {
    domain: process.env.NG_APP_DOMAIN,
    clientId: process.env.NG_APP_CLIENT_ID,
    redirectUri: window.location.origin,
    audience: process.env.NG_APP_AUDIENCE,
  },
  backendURL: process.env.NG_APP_BACKEND_URL,
};
