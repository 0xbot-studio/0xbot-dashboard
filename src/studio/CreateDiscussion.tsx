import { useState } from "react";
import { useLocale } from "../i18n/Locale";
import { studio, type CreateInput, type Guest } from "./client";
import { studioCopy } from "./copy";
import { useRoomMutation } from "./useMutation";
import { MutationError } from "./MutationError";
const guest = (): Guest => ({
  name: "",
  role: "",
  provider: "",
  model: "",
  system_prompt: "",
  max_output_tokens: 1024,
});
export function CreateDiscussion({ initial }: { initial?: CreateInput }) {
  const { lang } = useLocale();
  const p = studioCopy[lang];
  const [form, setForm] = useState<CreateInput>(
    () =>
      initial ?? {
        topic: "",
        name: "",
        max_rounds: 3,
        idempotency_key: "",
        plan: {
          version: 1,
          common_prompt: "",
          budget_micro_usd: "1000000",
          guests: [guest(), guest()],
        },
      },
  );
  const [confirmed, setConfirmed] = useState(false);
  const mutation = useRoomMutation((out) => {
    location.hash = "studio/" + out.data.room.id;
  });
  const plan = form.plan;
  function updateGuest(index: number, patch: Partial<Guest>) {
    setForm({
      ...form,
      plan: {
        ...plan,
        guests: plan.guests.map((g, i) =>
          i === index ? { ...g, ...patch } : g,
        ),
      },
    });
  }
  return (
    <div className="studio-stack">
      <a href="#studio">← {p.back}</a>
      <p className="notice">{p.notice}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!confirmed) return;
          const input = structuredClone({
            ...form,
            idempotency_key: crypto.randomUUID(),
          });
          mutation.run((signal) => studio.create(input, signal));
        }}
      >
        <fieldset disabled={!!mutation.pending} className="studio-stack">
          <section className="panel panel-body studio-stack">
            <label>
              {p.topic}
              <input
                required
                maxLength={200}
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
              />
            </label>
            <label>
              {p.host}
              <input
                required
                maxLength={60}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label>
              {p.rounds}
              <input
                required
                type="number"
                min={1}
                max={10}
                value={form.max_rounds}
                onChange={(e) =>
                  setForm({ ...form, max_rounds: Number(e.target.value) })
                }
              />
            </label>
            <label>
              {p.common}
              <textarea
                required
                maxLength={8000}
                rows={4}
                value={plan.common_prompt}
                onChange={(e) =>
                  setForm({
                    ...form,
                    plan: { ...plan, common_prompt: e.target.value },
                  })
                }
              />
            </label>
            <label>
              {p.budget}
              <input
                required
                inputMode="numeric"
                pattern="[1-9][0-9]{0,9}"
                value={plan.budget_micro_usd}
                onChange={(e) =>
                  setForm({
                    ...form,
                    plan: { ...plan, budget_micro_usd: e.target.value },
                  })
                }
              />
            </label>
          </section>
          <h2>{p.plans}</h2>
          {plan.guests.map((g, i) => (
            <section className="panel panel-body studio-stack" key={i}>
              <h3>
                {p.plans} {i + 1}
              </h3>
              <div className="studio-grid">
                {(
                  [
                    ["name", p.name, 60],
                    ["role", p.role, 200],
                    ["provider", p.provider, 100],
                    ["model", p.model, 100],
                  ] as const
                ).map(([field, label, max]) => (
                  <label key={field}>
                    {label}
                    <input
                      required
                      maxLength={max}
                      value={g[field]}
                      onChange={(e) =>
                        updateGuest(i, { [field]: e.target.value })
                      }
                    />
                  </label>
                ))}
              </div>
              <label>
                {p.prompt}
                <textarea
                  required
                  rows={5}
                  maxLength={8000}
                  value={g.system_prompt}
                  onChange={(e) =>
                    updateGuest(i, { system_prompt: e.target.value })
                  }
                />
              </label>
              <label>
                {p.tokens}
                <input
                  required
                  type="number"
                  min={1}
                  max={4096}
                  value={g.max_output_tokens}
                  onChange={(e) =>
                    updateGuest(i, {
                      max_output_tokens: Number(e.target.value),
                    })
                  }
                />
              </label>
              <button
                className="btn"
                type="button"
                disabled={plan.guests.length <= 1}
                onClick={() =>
                  setForm({
                    ...form,
                    plan: {
                      ...plan,
                      guests: plan.guests.filter((_, k) => k !== i),
                    },
                  })
                }
              >
                {p.remove}
              </button>
            </section>
          ))}
          <button
            className="btn"
            type="button"
            disabled={plan.guests.length >= 5}
            onClick={() =>
              setForm({
                ...form,
                plan: { ...plan, guests: [...plan.guests, guest()] },
              })
            }
          >
            {p.add}
          </button>
          <label className="row">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            {p.confirm}
          </label>
          <button className="btn primary" disabled={!confirmed}>
            {p.create}
          </button>
        </fieldset>
      </form>
      <MutationError mutation={mutation} />
    </div>
  );
}
