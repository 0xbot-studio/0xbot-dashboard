import { useCallback, useState } from "react";
import { Remote, useRemote } from "../components/Remote";
import { useLocale } from "../i18n/Locale";
import { studio } from "./client";
import { studioCopy } from "./copy";
import { CreateDiscussion } from "./CreateDiscussion";
import { Discussion } from "./Discussion";
import "./studio.css";

export function Studio({ id }: { id: string }) {
  const { lang } = useLocale();
  const p = studioCopy[lang];
  const [cursor, setCursor] = useState("");
  const load = useCallback(() => studio.list(cursor), [cursor]);
  const state = useRemote(load);
  if (id === "new") return <CreateDiscussion />;
  if (id) return <Discussion key={id} id={id} />;
  return (
    <div className="studio-stack">
      <p>{p.intro}</p>
      <a className="btn primary" href="#studio/new">
        {p.create}
      </a>
      <button className="btn" onClick={state.refresh}>
        {p.refresh}
      </button>
      <Remote busy={state.busy} err={state.err} retry={state.refresh}>
        {state.data?.data.rooms?.map((r) => (
          <article className="panel panel-body" key={r.id}>
            <span className="badge">{r.status}</span>
            <h2>{r.topic}</h2>
            <a className="btn" href={"#studio/" + r.id}>
              {p.open}
            </a>
          </article>
        ))}
        {state.data?.data.rooms?.length === 0 && <p>{p.empty}</p>}
        {state.data?.data.next_cursor && (
          <button
            className="btn"
            onClick={() => setCursor(state.data!.data.next_cursor)}
          >
            {p.more}
          </button>
        )}
        {cursor && (
          <button className="btn" onClick={() => setCursor("")}>
            {p.back}
          </button>
        )}
      </Remote>
    </div>
  );
}
