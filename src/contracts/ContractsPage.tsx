import { useLocale } from "../i18n/Locale";
import { Code } from "../components/Code";
import { contractCopy } from "./copy";
import { Explorer } from "./Explorer";
import { matchingProviders, toolExample, type Catalog } from "./model";

export function ContractsPage({
  catalog,
  selected,
}: {
  catalog: Catalog;
  selected: string;
}) {
  const { lang } = useLocale();
  const c = contractCopy[lang];
  const d =
    catalog.capabilities.find((d) => d.id === selected) ??
    catalog.capabilities[0];
  if (!d) return <p>{c.empty}</p>;
  const providers = matchingProviders(catalog, d.id);
  return (
    <Explorer
      base="contracts"
      selected={d.id}
      items={catalog.capabilities.map((d) => ({
        id: d.id,
        title: d.title[lang],
      }))}
    >
      <section className="panel panel-body">
        <span className="badge">
          v{d.version} · {d.scope}
        </span>
        <h2>{d.title[lang]}</h2>
        <p>{d.description[lang]}</p>
        <code>
          {d.method} {d.path}
        </code>
        <p>
          <a href={`#mcp-tools/${d.tool}`}>{d.tool} →</a>
        </p>
        <h3>{c.rules}</h3>
        <ul>
          {d.rules[lang]?.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <h3>{c.mapping}</h3>
        <div className="contract-chips">
          {providers.map((p) => (
            <a className="badge" href={`#adapters/${p.id}`} key={p.id}>
              {p.name} · {p.network} · {p.enabled ? c.enabled : c.disabled}
            </a>
          ))}
        </div>
        {!providers.length && <p>{c.noProvider}</p>}
      </section>
      <section className="panel panel-body">
        <h3>{c.standard}</h3>
        <p>{c.standardText}</p>
        <h3>{c.errors}</h3>
        <p>{c.errorsText}</p>
        <Code
          label="REST error schema"
          value={JSON.stringify(catalog.schemas.Error, null, 2)}
        />
      </section>
      <Code
        label={c.example}
        value={JSON.stringify(toolExample(catalog, d.tool), null, 2)}
      />
      <p className="muted">{c.schemaNote}</p>
      <Code
        label={c.input}
        value={JSON.stringify(catalog.schemas[d.input_schema_name], null, 2)}
      />
      <Code
        label={c.output}
        value={JSON.stringify(catalog.schemas[d.output_schema_name], null, 2)}
      />
      <details className="panel panel-body">
        <summary>{c.bundle}</summary>
        <Code
          label="components.schemas"
          value={JSON.stringify(
            { components: { schemas: catalog.schemas } },
            null,
            2,
          )}
        />
      </details>
    </Explorer>
  );
}
