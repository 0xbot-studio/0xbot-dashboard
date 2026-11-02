import { useLocale } from "../i18n/Locale";
import { Explorer } from "./Explorer";
import { contractCopy } from "./copy";
import type { Catalog } from "./model";
export function AdaptersPage({
  catalog,
  selected,
}: {
  catalog: Catalog;
  selected: string;
}) {
  const { lang } = useLocale();
  const c = contractCopy[lang];
  const provider =
    catalog.providers.find((p) => p.id === selected) ?? catalog.providers[0];
  if (!provider) return <p>{c.empty}</p>;
  return (
    <Explorer
      base="adapters"
      selected={provider.id}
      items={catalog.providers.map((p) => ({ id: p.id, title: p.name }))}
    >
      <section className="panel panel-body">
        <h2>{provider.name}</h2>
        <p>
          <code>{provider.id}</code> · {provider.network}
        </p>
        <p>
          {c.status}: {provider.health} ·{" "}
          {provider.enabled ? c.enabled : c.disabled} · {c.priority}:{" "}
          {provider.priority}
        </p>
        <a href="#providers">{c.manage} →</a>
        <h3>{c.linked}</h3>
        <div className="contract-chips">
          {provider.capabilities.map((id) => (
            <a className="badge" key={id} href={`#contracts/${id}`}>
              {id}
            </a>
          ))}
        </div>
      </section>
      <section className="panel panel-body">
        <h3>{c.adapters}</h3>
        <p>{c.adapterText}</p>
        <h3>{c.tests}</h3>
        <p>{c.testsText}</p>
      </section>
    </Explorer>
  );
}
