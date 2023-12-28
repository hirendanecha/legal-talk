const url = 'https://api.legaltalk.tube';
const webUrl = 'https://legaltalk.tube/';
const tubeUrl = 'https://video.legaltalk.tube/'

// const url = 'http://localhost:8080';
// const webUrl = 'http://localhost:4200/';

export const environment = {
  production: false,
  hmr: false,
  serverUrl: `${url}/api/v1/`,
  socketUrl: `${url}/`,
  webUrl: webUrl,
  tubeUrl: tubeUrl,
  domain: '.legaltalk.tube'
};
