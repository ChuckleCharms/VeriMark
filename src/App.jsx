import React, { useEffect, useMemo, useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";

import Overview from "./pages/Overview.jsx";
import Markets from "./pages/Markets.jsx";
import Screener from "./pages/Screener.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Orders from "./pages/Orders.jsx";
import StrategyLab from "./pages/StrategyLab.jsx";
import Backtest from "./pages/Backtest.jsx";
import Risk from "./pages/Risk.jsx";
import NewsSentiment from "./pages/NewsSentiment.jsx";
import AIGathering from "./pages/AIGathering.jsx";
import Pipelines from "./pages/Pipelines.jsx";
import ModelLab from "./pages/ModelLab.jsx";
import Agents from "./pages/Agents.jsx";
import Monitoring from "./pages/Monitoring.jsx";
import EducationCenter from "./pages/EducationCenter.jsx";
import Verify from "./pages/Verify.jsx";
import NotFound from "./pages/NotFound.jsx";

import { DEMO_USERS, loadState, resetState, saveState } from "./mockData.js";
import { Button } from "./ui.jsx";

/* -----------------------------
   Minimal hash router helpers
----------------------------- */

function getPath() {
  const h = window.location.hash || "";
  return h.startsWith("#") ? h.slice(1) : "/";
}

function navigate(path) {
  if (!path.startsWith("/")) path = "/" + path;
  window.location.hash = "#" + path;
}

function matchVerify(path) {
  const m = path.match(/^\/verify\/([^/]+)$/);
  return m ? m[1] : null;
}

/* -----------------------------
   App
----------------------------- */

export default function App() {
  const [state, setState] = useState(() => loadState());
  const [search, setSearch] = useState("");
  const [path, setPath] = useState(getPath());

  useEffect(() => saveState(state), [state]);

  useEffect(() => {
    const onHash = () => setPath(getPath());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const session = state.session;

  // Redirect root
  useEffect(() => {
    if (path === "/" || path === "") {
      navigate(session ? "/app/overview" : "/login");
    }
  }, [path, session]);

  // Guard app routes
  useEffect(() => {
    if (path.startsWith("/app") && !session) navigate("/login");
    if (path === "/login" && session) navigate("/app/overview");
  }, [path, session]);

  /* -----------------------------
     Public verify page
  ----------------------------- */
  const verifyId = matchVerify(path);
  if (verifyId) {
    return (
      <Verify
        id={verifyId}
        state={state}
        setState={setState}
        navigate={navigate}
      />
    );
  }

  /* -----------------------------
     Login
  ----------------------------- */
  if (path === "/login") {
    return (
      <LoginPage
        onLogin={(sess) => setState((s) => ({ ...s, session: sess }))}
        onReset={() => {
          resetState();
          setState(loadState());
        }}
      />
    );
  }

  /* -----------------------------
     App shell
  ----------------------------- */
  if (path.startsWith("/app")) {
    return (
      <Shell
        path={path}
        state={state}
        setState={setState}
        session={session}
        search={search}
        setSearch={setSearch}
      />
    );
  }

  return <NotFound navigate={navigate} />;
}

/* -----------------------------
   Shell
----------------------------- */

function Shell({ path, state, setState, session, search, setSearch }) {
  function logout() {
    setState((s) => ({ ...s, session: null }));
    navigate("/login");
  }

  const title = useMemo(() => {
    if (path.includes("/overview")) return "Overview";
    if (path.includes("/markets")) return "Signals";
    if (path.includes("/screener")) return "Assets";
    if (path.includes("/pipelines")) return "Pipelines";
    if (path.includes("/agents")) return "Agents";
    if (path.includes("/model-lab")) return "Model Lab";
    if (path.includes("/news-sentiment")) return "News + Sentiment";
    if (path.includes("/monitoring")) return "Monitoring";
    if (path.includes("/risk")) return "Risk";
    if (path.includes("/education")) return "Education Center";
    return "Dashboard";
  }, [path]);

  const subtitle = "High-trust content provenance & verification (CU demo)";

  let page = null;

  if (path === "/app/overview")
    page = (
      <Overview
        state={state}
        setState={setState}
        session={session}
        search={search}
        navigate={navigate}
      />
    );
  else if (path === "/app/markets") page = <Markets state={state} />;
  else if (path === "/app/screener")
    page = <Screener state={state} search={search} navigate={navigate} />;
  else if (path === "/app/portfolio") page = <Portfolio />;
  else if (path === "/app/orders") page = <Orders />;
  else if (path === "/app/strategy-lab") page = <StrategyLab />;
  else if (path === "/app/backtest") page = <Backtest />;
  else if (path === "/app/risk") page = <Risk state={state} />;
  else if (path === "/app/news-sentiment")
    page = <NewsSentiment state={state} />;
  else if (path === "/app/ai-gathering") page = <AIGathering />;
  else if (path === "/app/pipelines") page = <Pipelines state={state} />;
  else if (path === "/app/model-lab") page = <ModelLab />;
  else if (path === "/app/agents") page = <Agents state={state} />;
  else if (path === "/app/monitoring") page = <Monitoring state={state} />;
  else if (path === "/app/education") page = <EducationCenter state={state} />;
  else page = <NotFound navigate={navigate} />;

  return (
    <div className="appShell">
      <Sidebar
        session={session}
        onLogout={logout}
        path={path}
        navigate={navigate}
      />

      <div className="mainWrap">
        <TopBar
          title={title}
          subtitle={subtitle}
          search={search}
          setSearch={setSearch}
          right={
            <div style={{ display: "flex", gap: 10 }}>
              <Button variant="ghost" onClick={() => navigate("/app/overview")}>
                Home
              </Button>
            </div>
          }
        />
        {page}
      </div>
    </div>
  );
}

/* -----------------------------
   Login
----------------------------- */

function LoginPage({ onLogin, onReset }) {
  const [email, setEmail] = useState("admin@verimark.local");
  const [password, setPassword] = useState("admin123");
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    setErr("");
    const u = DEMO_USERS.find(
      (x) => x.email === email && x.password === password
    );
    if (!u) {
      setErr("Invalid demo credentials.");
      return;
    }
    onLogin({ id: u.id, email: u.email, role: u.role, name: u.name });
    navigate("/app/overview");
  }

  return (
    <div className="loginWrap">
      <div className="loginCard">
        <div className="heroPane">
          <div className="heroTitle">VeriMark</div>
          <div className="small">Content Provenance-as-a-Service — CU demo</div>
        </div>

        <div className="formPane">
          {err && <div className="inlineWarn">{err}</div>}

          <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
            <input
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="btnRow">
              <Button type="button" variant="ghost" onClick={onReset}>
                Reset demo
              </Button>
              <Button type="submit" variant="primary">
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
