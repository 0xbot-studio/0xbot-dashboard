import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

test('studio form is bilingual, has independent guest plans and never claims execution', async () => {
  const server = await createServer({server:{middlewareMode:true, hmr:false}, appType:'custom'});
  try {
    const {LocaleProvider} = await server.ssrLoadModule('/src/i18n/Locale.tsx');
    const {CreateDiscussion} = await server.ssrLoadModule('/src/studio/CreateDiscussion.tsx');
    const {studioCopy} = await server.ssrLoadModule('/src/studio/copy.ts');
    assert.deepEqual(Object.keys(studioCopy.en).sort(), Object.keys(studioCopy.zh).sort());
    for (const lang of ['en','zh']) {
      globalThis.localStorage = {getItem:()=>lang};
      const html = renderToStaticMarkup(createElement(LocaleProvider, null, createElement(CreateDiscussion)));
      assert.ok(html.includes(studioCopy[lang].notice));
      assert.ok(html.includes(studioCopy[lang].confirm));
      assert.equal((html.match(/rows="5"/g) ?? []).length, 2);
      assert.ok(html.includes('disabled=""'));
      assert.ok(!html.includes('type="password"'));
    }
  } finally { await server.close(); delete globalThis.localStorage; }
});
