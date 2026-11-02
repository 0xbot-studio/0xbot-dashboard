import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Explicit fixture: not presented as live provider data.
const catalog = {
  version:'1.0.0', instructions:'Fixture MCP instructions', networks:['eip155:56'],
  capabilities:[{id:'data.balance',version:'1.0.0',title:{en:'Native balance',zh:'原生币余额'},description:{en:'Native coin only',zh:'仅原生币'},method:'POST',path:'/v1/data/balance',tool:'get_native_balance',input_schema_name:'BalanceInput',output_schema_name:'BalanceResult',scope:'data:read',rules:{en:['No funds move'],zh:['不移动资金']}}],
  schemas:{BalanceInput:{type:'object'},BalanceResult:{type:'object'},Error:{type:'object'}},
  providers:[{id:'fixture-bsc',name:'Fixture BSC',network:'eip155:56',capabilities:['data.balance'],enabled:false,priority:10,health:'healthy'},{id:'fixture-other',name:'Other',network:'eip155:1',capabilities:['other'],enabled:true,priority:20,health:'healthy'}],
  tools:[{name:'get_native_balance',description:'Native BNB',inputSchema:{type:'object'},outputSchema:{type:'object'}},{name:'get_supported_tokens',description:'Registry',inputSchema:{type:'object'},outputSchema:{type:'object'}}],
  tokens:[{network:'eip155:56',contract:'0x0000000000000000000000000000000000000002'}],
};

test('capability, MCP and adapter pages render their own mappings in both languages', async () => {
  const server = await createServer({server:{middlewareMode:true},appType:'custom'});
  try {
    const {LocaleProvider} = await server.ssrLoadModule('/src/i18n/Locale.tsx');
    for (const lang of ['en','zh']) {
      globalThis.localStorage = {getItem:()=>lang};
      for (const [page,selected,expected] of [['ContractsPage','data.balance','/v1/data/balance'],['ToolsPage','get_native_balance','Fixture MCP instructions'],['AdaptersPage','fixture-bsc','fixture-bsc']]) {
        const module = await server.ssrLoadModule(`/src/contracts/${page}.tsx`);
        const html=renderToStaticMarkup(createElement(LocaleProvider,null,createElement(module[page],{catalog,selected})));
        assert.ok(html.includes(expected));
        assert.ok(!html.includes('<form'));
        assert.ok(!html.includes('type="password"'));
      }
    }
    const model = await server.ssrLoadModule('/src/contracts/model.ts');
    assert.deepEqual(model.matchingProviders(catalog,'data.balance').map(p=>p.id),['fixture-bsc']);
    assert.equal(model.toolExample(catalog,'get_token_balance').contract,catalog.tokens[0].contract);
    assert.deepEqual(model.toolExample(catalog,'get_supported_tokens'),{});
    assert.equal(model.toolExample(catalog,'send_message').provider,'padin-inbox');
    assert.equal(model.toolExample(catalog,'list_messages').limit,20);
    assert.equal(model.toolExample(catalog,'get_message').id.length,64);
    assert.equal(model.toolExample(catalog,'get_asset_price').asset,'BTC');
  } finally { delete globalThis.localStorage; await server.close(); }
});
