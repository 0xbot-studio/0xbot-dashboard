import { useCallback, useState } from "react";
import { ShieldCheck, ScrollText } from "lucide-react";
import { api, result } from "./api/client";
import { useLocale } from "./i18n/Locale";
import { useAccount } from "./auth/useAccount";
import { Login } from "./auth/Login";
import { Shell, usePage } from "./components/Shell";
import { Remote, useRemote } from "./components/Remote";
import { Providers } from "./components/Providers";
import { ContractCenter } from "./contracts/ContractCenter";
import { contractCopy } from "./contracts/copy";
import { Studio } from "./studio/Studio";
import { studioCopy } from "./studio/copy";
function MFA({ reload }: { reload: () => Promise<void> }) {
  const { t, error } = useLocale();
  const [code, setCode] = useState("");
  const [err, setErr] = useState<unknown>(null);
  const [busy, setBusy] = useState(false);
  return (
    <section className="panel panel-body mfa-card">
      <span className="icon-tile">
        <ShieldCheck size={23} />
      </span>
      <h1>{t.mfaTitle}</h1>
      <p>{t.mfaText}</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setErr(null);
          try {
            result(await api.POST("/v1/auth/mfa", { body: { code } }));
            await reload();
          } catch (e) {
            setErr(e);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          {t.mfaCode}
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            autoComplete="one-time-code"
            required
          />
        </label>
        <button className="btn primary" disabled={busy}>
          {t.verify}
        </button>
        {err != null && (
          <div className="notice error" role="alert">
            {error(err)}
          </div>
        )}
      </form>
    </section>
  );
}
function Audit() {
  const { t, lang } = useLocale();
  const [offset, setOffset] = useState(0);
  const load = useCallback(
    async () =>
      result(
        await api.GET("/v1/admin/audit", {
          params: { query: { limit: 25, offset } },
        }),
      ),
    [offset],
  );
  const state = useRemote(load);
  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>{t.audit}</h2>
          <button className="btn small" onClick={state.refresh}>
            {t.refresh}
          </button>
        </div>
        <Remote busy={state.busy} err={state.err} retry={state.refresh}>
          {state.data?.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t.action}</th>
                    <th>{t.target}</th>
                    <th>{t.details}</th>
                    <th>{t.created}</th>
                  </tr>
                </thead>
                <tbody>
                  {state.data.map((a) => (
                    <tr key={a.id}>
                      <td>{a.action}</td>
                      <td>{a.target}</td>
                      <td>
                        <code>{JSON.stringify(a.details)}</code>
                      </td>
                      <td>{new Date(a.created_at).toLocaleString(lang)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">
              <span className="icon-tile">
                <ScrollText size={20} />
              </span>
              <h3>{t.auditEmpty}</h3>
              <p>{t.auditEmptyText}</p>
            </div>
          )}
        </Remote>
      </section>
      <div className="pagination">
        <button
          className="btn small"
          disabled={!offset || state.busy}
          onClick={() => setOffset(Math.max(0, offset - 25))}
        >
          {t.previous}
        </button>
        <button
          className="btn small"
          disabled={state.busy || !state.data || state.data.length < 25}
          onClick={() => setOffset(offset + 25)}
        >
          {t.next}
        </button>
      </div>
    </>
  );
}
export default function App() {
  const account = useAccount();
  const page = usePage("providers");
  const { t, lang } = useLocale();
  if (account.loading || account.error)
    return (
      <Remote busy={account.loading} err={account.error} retry={account.reload}>
        {null}
      </Remote>
    );
  if (!account.user) return <Login onLogin={account.reload} />;
  const root = page.split("/")[0];
  const active =
    root === "audit" ||
    root === "studio" ||
    root === "contracts" ||
    root === "mcp-tools" ||
    root === "adapters"
      ? root
      : "providers";
  const isContract =
    active === "contracts" || active === "mcp-tools" || active === "adapters";
  return (
    <Shell admin user={account.user} page={active} onLogout={account.logout}>
      {!account.user.admin ? (
        <section className="panel empty">
          <ShieldCheck size={35} />
          <h1>{t.adminDenied}</h1>
          <p>{t.adminDeniedText}</p>
        </section>
      ) : !account.user.mfa ? (
        <MFA reload={account.reload} />
      ) : (
        <>
          <div className="page-heading">
            <div>
              <h1>{t[active]}</h1>
              <p>
                {active === "studio"
                  ? studioCopy[lang].intro
                  : isContract
                    ? contractCopy[lang].intro
                    : active === "audit"
                      ? t.auditIntro
                      : t.adminIntro}
              </p>
            </div>
            <span className="badge">ADMIN</span>
          </div>
          {active === "studio" ? (
            <Studio id={page.split("/")[1] ?? ""} />
          ) : isContract ? (
            <ContractCenter page={active} selected={page.split("/")[1] ?? ""} />
          ) : active === "providers" ? (
            <Providers admin />
          ) : (
            <Audit />
          )}
        </>
      )}
    </Shell>
  );
}
