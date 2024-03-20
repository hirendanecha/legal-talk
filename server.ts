import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import fetch from 'node-fetch';
import { AppServerModule } from './src/main.server';
import 'localstorage-polyfill';
import 'reflect-metadata';
import { environment } from 'src/environments/environment.prod';

// SEO
// const url = 'https://freedom-api.opash.in';
// const url = 'https://freedom-api.opash.in';
// const url_img = url;
const api_url = environment.serverUrl;

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/legaltalk-tube/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  const domino = require('domino-ext');
  const fs = require('fs');
  const path = require('path');
  const template = fs
    .readFileSync(
      path.join(join(process.cwd(), 'dist/legaltalk-tube/browser'), 'index.html')
    )
    .toString();
  // Shim for the global window and document objects.
  const window = domino.createWindow(template);

  global['localStorage'] = localStorage;
  global['window'] = window;
  global['document'] = window.document;
  global['self'] = window;
  global['sessionStorage'] = window.sessionStorage;
  global['IDBIndex'] = window.IDBIndex;
  global['navigator'] = window.navigator;
  global['Event'] = window.Event;
  global['Event']['prototype'] = window.Event.prototype;
  global['HTMLElement'] = window.HTMLElement;
  global['jwplayer'] = window.jwplayer;
  // global.google = google;
  global['getComputedStyle'] = window.getComputedStyle;

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/main/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
      inlineCriticalCss: false,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine

  server.get('*', (req, res) => {
    res.render(
      indexHtml,
      { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] },
      async (err, html) => {
        if (err) {
          console.log('Error', err);
        }
        const params = req.params[0];
        var seo: any = {
          title: 'Legaltalk Tube',
          description:
            'Speak face-to-face with attorneys locally or worldwide',
          image:
            'https://www.legaltalk.tube/assets/images/LegalTalk-Banner.jpg',
          site: 'https://www.legaltalk.tube/',
          url: 'https://www.legaltalk.tube' + params,
          keywords: 'LegaltalkTube',
        };
        if (
          params.indexOf('attorneys/') > -1 ||
          params.indexOf('pages/') > -1
        ) {
          let id = params.split('/');
          id = id[id.length - 1];
          // id = params[params.length - 1];
          // id = Number(id);
          // let id = 'local-organic-food-sources';
          console.log({ id });

          // if (!isNaN(id) || Math.sign(id) > 0) {
          const community: any = await getCommunity(id);

          console.log({ params }, { id }, { community });

          const talent = {
            name: community?.CommunityName,
            description: community?.CommunityDescription,
            image: community?.coverImg,
          };
          seo.title = talent.name;
          seo.description = strip_html_tags(talent.description);
          seo.image = `${talent.image}`;
          // }
        } else if (params.indexOf('settings/view-profile/') > -1) {
          let id = params.split('/');
          id = +id[id.length - 1];
          // id = params[params.length - 1];
          // id = Number(id);
          // let id = 'local-organic-food-sources';
          // console.log({ id });

          // if (!isNaN(id) || Math.sign(id) > 0) {
          const { data: profile }: any = await getProfile(id);

          console.log({ params }, { id }, { profile: JSON.stringify(profile) });
          const talent = {
            name: profile[0]?.Username,
            description: profile[0].FirstName + ' ' + profile[0].LastName,
            image: profile[0].ProfilePicName,
          };
          seo.title = talent.name;
          seo.description = strip_html_tags(talent.description);
          seo.image = `${talent.image}`;
        } else if (params.indexOf('post/') > -1) {
          let id = params.split('/');
          id = id[id.length - 1];
          // id = params[params.length - 1];
          // id = Number(id);
          // let id = 'local-organic-food-sources';
          console.log({ id });

          // if (!isNaN(id) || Math.sign(id) > 0) {
          const [post]: any = await getPost(+id);

          console.log('post===>', post);
          const pdhtml = document.createElement('div');
          pdhtml.innerHTML = post?.postdescription || post?.metadescription;
          const talent = {
            name: post?.title || post?.albumname || 'Legaltalk.Tube Post',
            description: pdhtml?.textContent || 'Post content',
            image: post?.thumbfilename || post?.metaimage || post?.imageUrl || 'https://www.legaltalk.tube/assets/images/LegalTalk-Banner.jpg',
          };
          seo.title = talent.name;
          seo.description = strip_html_tags(talent.description);
          seo.image = talent.image;
          // }
        }else if (params.indexOf('research/') > -1) {
          let id = params.split('/');
          id = id[id.length - 1];
          console.log({ id });

          const group: any = await getResearchGroup(id);

          console.log('group===>', group);
          const talent = {
            name: `legaltalkTube Research ${group?.PageTitle}`,
            description: group?.PageDescription,
            image: group?.CoverPicName || group?.ProfilePicName
          };
          seo.title = talent.name;
          seo.description = talent.description;
          seo.image = talent.image;
        }

        html = html.replace(/\$TITLE/g, seo.title);
        html = html.replace(/\$DESCRIPTION/g, strip_html_tags(seo.description));
        html = html.replace(
          /\$OG_DESCRIPTION/g,
          strip_html_tags(seo.description)
        );
        html = html.replace(
          /\$OG_META_DESCRIPTION/g,
          strip_html_tags(seo.description)
        );
        html = html.replace(/\$OG_TITLE/g, seo.title);
        html = html.replace(/\$OG_IMAGE/g, seo.image);
        html = html.replace(/\$OG_SITE/g, seo.site);
        html = html.replace(/\$OG_URL/g, seo.url);
        html = html.replace(/\$OG_META_KEYWORDS/g, seo.keywords);
        res.send(html);
      }
    );
  });
  return server;
}

async function getCommunity(id: any) {
  return fetch(api_url + 'community/bySlug/' + id).then((resp) =>
    resp.json()
  );
}

async function getPost(id: any) {
  console.log(api_url);
  return fetch(api_url + 'posts/get/' + id).then((resp) => resp.json());
}
async function getProfile(id: any) {
  return fetch(api_url + 'customers/profile/' + id).then((resp: any) =>
    resp.json()
  );
}

async function getResearchGroup(id: any) {
  return fetch(api_url + 'profile/getGroupBasicDetails/' + id).then((resp: any) =>
    resp.json()
  );
}

function strip_html_tags(str: any) {
  if (str === null || str === '') {
    return false;
  } else {
    str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  }
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
