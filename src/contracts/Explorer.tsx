import { useState, type ReactNode } from "react";
import { useLocale } from "../i18n/Locale";
import { contractCopy } from "./copy";

export function Explorer({
  items,
  selected,
  base,
  children,
}: {
  items: { id: string; title: string }[];
  selected: string;
  base: string;
  children: ReactNode;
}) {
  const { lang } = useLocale();
  const c = contractCopy[lang];
  const [query, setQuery] = useState("");
  const visible = items.filter((i) =>
    `${i.id} ${i.title}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="contract-layout">
      <aside className="panel contract-nav">
        <label>
          {c.search}
          <input value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <nav aria-label={c.details}>
          {visible.map((i) => (
            <a
              key={i.id}
              href={`#${base}/${i.id}`}
              aria-current={selected === i.id ? "page" : undefined}
            >
              <strong>{i.title}</strong>
              <code>{i.id}</code>
            </a>
          ))}
        </nav>
        {!visible.length && <p>{c.empty}</p>}
      </aside>
      <div className="contract-detail">{children}</div>
    </div>
  );
}
