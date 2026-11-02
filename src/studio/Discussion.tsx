import { useCallback, useState } from "react";
import { Remote, useRemote } from "../components/Remote";
import { useLocale } from "../i18n/Locale";
import { studio } from "./client";
import { studioCopy } from "./copy";
import { useRoomMutation } from "./useMutation";
import { MutationError } from "./MutationError";
import { CreateDiscussion } from "./CreateDiscussion";
export function Discussion({ id }: { id: string }) {
  const { lang } = useLocale();
  const p = studioCopy[lang];
  const load = useCallback(() => studio.get(id), [id]);
  const state = useRemote(load);
  const [cloning, setCloning] = useState(false);
  const [summary, setSummary] = useState("");
  const mutation = useRoomMutation(() => {
    state.refresh();
    setSummary("");
  });
  const detail = state.data,
    r = detail?.snapshot.room,
    plan = detail?.plan;
  const owner = !!r && r.host_id === detail?.snapshot.self_id;
  function moderate(action: string, participant_id?: string) {
    if (!r || !confirm(p.actionConfirm)) return;
    const input = {
      room_id: id,
      action,
      participant_id,
      expected_seq: r.seq,
      idempotency_key: crypto.randomUUID(),
    };
    mutation.run((signal) => studio.moderate(input, signal));
  }
  if (cloning && r && plan)
    return (
      <CreateDiscussion
        initial={{
          topic: r.topic,
          name: r.members?.find((m) => m.id === r.host_id)?.name ?? "",
          max_rounds: r.max_rounds,
          idempotency_key: "",
          plan: {
            ...plan,
            guests: (plan.guests ?? []).map((g) => ({
              ...g,
              agent_id: undefined,
            })),
          },
        }}
      />
    );
  return (
    <div className="studio-stack">
      <a href="#studio">← {p.back}</a>
      <button className="btn" disabled={mutation.busy} onClick={state.refresh}>
        {p.refresh}
      </button>
      <Remote busy={state.busy} err={state.err} retry={state.refresh}>
        {r && (
          <>
            <section className="panel panel-body studio-stack">
              <span className="badge">{r.status}</span>
              <h2>{r.topic}</h2>
              <a
                href={"https://app.0xbot.org/#rooms/" + id}
                target="_blank"
                rel="noreferrer"
              >
                {p.view}
              </a>
              <p className="notice">{p.external}</p>
              {plan ? (
                <>
                  <p>{p.immutable}</p>
                  <button
                    className="btn"
                    disabled={!!mutation.pending}
                    onClick={() => setCloning(true)}
                  >
                    {p.clone}
                  </button>
                  <p>
                    {p.budget}: {plan.budget_micro_usd}
                  </p>
                  <h3>{p.common}</h3>
                  <pre>{plan.common_prompt}</pre>
                  {plan.guests?.map((g) => (
                    <details key={g.agent_id}>
                      <summary>
                        {g.name} · {g.role} · {g.provider} / {g.model}
                      </summary>
                      <p>
                        {p.plannedID}: <code>{g.agent_id}</code>
                      </p>
                      <p>
                        {p.tokens}: {g.max_output_tokens}
                      </p>
                      <pre>{g.system_prompt}</pre>
                    </details>
                  ))}
                </>
              ) : (
                <p>{p.noPlan}</p>
              )}
            </section>
            <section className="panel panel-body studio-stack">
              <h2>{p.seats}</h2>
              {!owner && <p>{p.otherHost}</p>}
              <fieldset
                disabled={!!mutation.pending || !owner}
                className="studio-stack"
              >
                {r.members?.map((m) => (
                  <div key={m.id}>
                    <strong>{m.name}</strong> · {m.role}
                    <p>
                      <code>{m.id}</code>
                    </p>
                    {r.status === "lobby" && m.role !== "host" && (
                      <button
                        className="btn"
                        onClick={() =>
                          moderate(
                            m.role === "speaker" ? "demote" : "promote",
                            m.id,
                          )
                        }
                      >
                        {m.role === "speaker" ? p.demote : p.promote}
                      </button>
                    )}
                  </div>
                ))}
                <div className="row">
                  {r.status === "lobby" && (
                    <button
                      className="btn primary"
                      disabled={!r.speakers?.length}
                      onClick={() => moderate("start")}
                    >
                      {p.start}
                    </button>
                  )}
                  {r.status === "live" && (
                    <button className="btn" onClick={() => moderate("skip")}>
                      {p.skip}
                    </button>
                  )}
                  {r.status !== "closed" && (
                    <button className="btn" onClick={() => moderate("close")}>
                      {p.close}
                    </button>
                  )}
                </div>
              </fieldset>
            </section>
            <MutationError mutation={mutation} />
            <section className="panel panel-body studio-stack">
              <h2>{p.transcript}</h2>
              {r.events
                ?.filter((e) => e.kind === "message" || e.kind === "question")
                .map((e) => (
                  <article key={e.seq}>
                    <strong>
                      #{e.seq} · {e.kind} ·{" "}
                      {r.members?.find((m) => m.id === e.participant_id)
                        ?.name ?? e.participant_id}
                    </strong>
                    <pre>{e.body}</pre>
                  </article>
                ))}
              {r.status === "closed" && (
                <>
                  <span className="badge">{r.summary.kind}</span>
                  <pre>{r.summary.text}</pre>
                </>
              )}
              {owner &&
                r.status === "closed" &&
                r.summary.kind === "extractive" &&
                !!r.summary.message_seqs?.length && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!confirm(p.summaryConfirm)) return;
                      const input = {
                        room_id: id,
                        body: summary,
                        through_seq: r.seq,
                        message_seqs: r.summary.message_seqs!,
                        idempotency_key: crypto.randomUUID(),
                      };
                      mutation.run((signal) => studio.summary(input, signal));
                    }}
                  >
                    <fieldset disabled={!!mutation.pending}>
                      <label>
                        {p.summaryLabel}
                        <textarea
                          required
                          maxLength={16000}
                          rows={8}
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                        />
                      </label>
                      <button className="btn primary">{p.summary}</button>
                    </fieldset>
                  </form>
                )}
            </section>
          </>
        )}
      </Remote>
    </div>
  );
}
