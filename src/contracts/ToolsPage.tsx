import { useLocale } from "../i18n/Locale";
import { Code } from "../components/Code";
import { Explorer } from "./Explorer";
import { contractCopy } from "./copy";
import { toolExample, type Catalog } from "./model";
export function ToolsPage({
  catalog,
  selected,
}: {
  catalog: Catalog;
  selected: string;
}) {
  const { lang } = useLocale();
  const c = contractCopy[lang];
  const tool =
    catalog.tools.find((t) => t.name === selected) ?? catalog.tools[0];
  if (!tool) return <p>{c.empty}</p>;
  const definition = catalog.capabilities.find((d) => d.tool === tool.name);
  return (
    <Explorer
      base="mcp-tools"
      selected={tool.name}
      items={catalog.tools.map((t) => ({ id: t.name, title: t.name }))}
    >
      <section className="panel panel-body">
        <h2>{tool.name}</h2>
        <p>{tool.description}</p>
        {definition ? (
          <a href={`#contracts/${definition.id}`}>
            {c.linked}: {definition.title[lang]} →
          </a>
        ) : (
          <p>{c.registry}</p>
        )}
      </section>
      <Code
        label={c.example}
        value={JSON.stringify(toolExample(catalog, tool.name), null, 2)}
      />
      <Code label={c.input} value={JSON.stringify(tool.inputSchema, null, 2)} />
      <Code
        label={c.output}
        value={JSON.stringify(tool.outputSchema, null, 2)}
      />
      <Code label={c.instructions} value={catalog.instructions} />
    </Explorer>
  );
}
