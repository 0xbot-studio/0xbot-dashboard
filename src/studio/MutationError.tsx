import { useLocale } from "../i18n/Locale";
import { studioCopy } from "./copy";
import type { useRoomMutation } from "./useMutation";
export function MutationError({
  mutation: m,
}: {
  mutation: ReturnType<typeof useRoomMutation>;
}) {
  const { lang, error } = useLocale();
  const p = studioCopy[lang];
  if (m.err == null) return null;
  return (
    <div className="notice error" role="alert">
      {error(m.err)}
      <p>{p.unknown}</p>
      <button className="btn" disabled={m.busy} onClick={m.retry}>
        {p.retry}
      </button>
      <button
        className="btn"
        disabled={m.busy}
        onClick={() => {
          if (confirm(p.discardConfirm)) m.discard();
        }}
      >
        {p.discard}
      </button>
    </div>
  );
}
