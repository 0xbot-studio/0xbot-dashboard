import { useCallback } from "react";
import { api, result } from "../api/client";
import { Remote, useRemote } from "../components/Remote";
import { useLocale } from "../i18n/Locale";
import { contractCopy } from "./copy";
import { ContractsPage } from "./ContractsPage";
import { ToolsPage } from "./ToolsPage";
import { AdaptersPage } from "./AdaptersPage";
import "./contracts.css";

export function ContractCenter({
  page,
  selected,
}: {
  page: string;
  selected: string;
}) {
  const { lang } = useLocale();
  const c = contractCopy[lang];
  const load = useCallback(
    async () => result(await api.GET("/v1/admin/contracts")),
    [],
  );
  const state = useRemote(load);
  return (
    <>
      <div className="notice">{c.readonly}</div>
      <div className="contract-toolbar">
        <p>{c.limitations}</p>
        <button
          className="btn small"
          onClick={state.refresh}
          disabled={state.busy}
        >
          {c.refresh}
        </button>
        {state.data && !state.busy && !state.err && (
          <button
            className="btn small"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(state.data, null, 2)], {
                  type: "application/json",
                }),
              );
              const a = document.createElement("a");
              a.href = url;
              a.download = "0xbot-contracts-v1.json";
              a.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            {c.docs}
          </button>
        )}
      </div>
      <Remote busy={state.busy} err={state.err} retry={state.refresh}>
        {state.data &&
          (page === "contracts" ? (
            <ContractsPage catalog={state.data} selected={selected} />
          ) : page === "mcp-tools" ? (
            <ToolsPage catalog={state.data} selected={selected} />
          ) : (
            <AdaptersPage catalog={state.data} selected={selected} />
          ))}
      </Remote>
    </>
  );
}
