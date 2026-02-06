// Mock data for a "real" looking CU demo (front-end only).
// Everything is local-first (no API) and stored in localStorage when mutated.

const LS_KEY = "verimark_cu_state_v1";

function randHex(len) {
  const chars = "abcdef0123456789";
  let s = "";
  for (let i = 0; i < len; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

function iso(d) {
  return new Date(d).toISOString();
}

function fakeHash() {
  // Looks like a sha256
  return randHex(64);
}
function fakeSig() {
  // Looks like a compact signature
  return "vm_sig_" + randHex(44);
}

function nowMinus(minutes) {
  return new Date(Date.now() - minutes * 60 * 1000).toISOString();
}

export const DEMO_USERS = [
  {
    id: "u_admin",
    email: "admin@verimark.local",
    password: "admin123",
    role: "admin",
    name: "Admin Operator",
  },
  {
    id: "u_user",
    email: "user@verimark.local",
    password: "user123",
    role: "user",
    name: "Studio User",
  },
];

export function seedState() {
  const base = {
    session: null,
    counters: {
      uploads7d: 214,
      verified7d: 203,
      failed7d: 11,
      apiCalls24h: 12847,
    },
    apiKeys: [
      {
        id: "k_1",
        label: "Production Key",
        prefix: "vm_live_",
        key: "vm_live_" + randHex(28),
        createdAt: nowMinus(60 * 24 * 8),
        lastUsedAt: nowMinus(18),
        enabled: true,
        scope: "sign,verify,read",
      },
      {
        id: "k_2",
        label: "CI Key",
        prefix: "vm_ci_",
        key: "vm_ci_" + randHex(28),
        createdAt: nowMinus(60 * 24 * 2),
        lastUsedAt: nowMinus(220),
        enabled: true,
        scope: "verify,read",
      },
      {
        id: "k_3",
        label: "Legacy Key",
        prefix: "vm_legacy_",
        key: "vm_legacy_" + randHex(28),
        createdAt: nowMinus(60 * 24 * 30),
        lastUsedAt: nowMinus(60 * 24 * 21),
        enabled: false,
        scope: "read",
      },
    ],
    usageLogs: [
      {
        id: "l1",
        at: nowMinus(6),
        level: "info",
        action: "verify.asset",
        actor: "api_key:vm_live_",
        meta: "verify ok — asset a_1042",
      },
      {
        id: "l2",
        at: nowMinus(21),
        level: "warn",
        action: "verify.asset",
        actor: "api_key:vm_ci_",
        meta: "integrity mismatch — asset a_1033 (hash differs)",
      },
      {
        id: "l3",
        at: nowMinus(44),
        level: "info",
        action: "sign.asset",
        actor: "user:user@verimark.local",
        meta: "bundle created — a_1042 (demo signer)",
      },
      {
        id: "l4",
        at: nowMinus(70),
        level: "info",
        action: "apikey.rotate",
        actor: "admin:admin@verimark.local",
        meta: "rotated key k_2",
      },
    ],
    storage: {
      provider: "MinIO (S3-compatible)",
      bucket: "verimark-assets",
      region: "us-east-1",
      usedGB: 18.6,
      capacityGB: 250,
      status: "healthy",
    },
    assets: [
      makeAsset({
        id: "a_1042",
        filename: "campaign_still_v3.png",
        type: "image/png",
        sizeMB: 4.8,
        status: "verified",
        createdAt: nowMinus(46),
        signerMode: "demo",
        creator: "Kestrel Studio",
        org: "Kestrel Studio LLC",
        tool: "Photoshop 2025.1",
        edits: "Color grade, minor retouch, crop to 4:5",
        license: "CC BY 4.0",
        integrityExpected: "pass",
        integrityCurrent: "pass",
      }),
      makeAsset({
        id: "a_1039",
        filename: "interview_cut_12.mp4",
        type: "video/mp4",
        sizeMB: 186.2,
        status: "pending",
        createdAt: nowMinus(98),
        signerMode: "extensible",
        creator: "Northlight Media",
        org: "Northlight Media Inc",
        tool: "Premiere Pro 25",
        edits: "Audio normalize, captions burned-in",
        license: "All Rights Reserved",
        integrityExpected: "pass",
        integrityCurrent: "pass",
      }),
      makeAsset({
        id: "a_1033",
        filename: "product_render_final.jpg",
        type: "image/jpeg",
        sizeMB: 7.1,
        status: "failed",
        createdAt: nowMinus(210),
        signerMode: "demo",
        creator: "Apex Design Lab",
        org: "Apex Design Lab",
        tool: "Blender 4.2",
        edits: "Lighting pass, denoise, sharpen",
        license: "Client Restricted",
        integrityExpected: "pass",
        integrityCurrent: "fail",
      }),
      makeAsset({
        id: "a_1022",
        filename: "event_poster_v9.png",
        type: "image/png",
        sizeMB: 3.3,
        status: "verified",
        createdAt: nowMinus(420),
        signerMode: "extensible",
        creator: "Hollowframe",
        org: "Hollowframe Agency",
        tool: "Figma",
        edits: "Typography tweak, logo placement",
        license: "CC BY-NC 4.0",
        integrityExpected: "pass",
        integrityCurrent: "pass",
      }),
    ],
    markets: {
      // Used for ticker tape + charts (fake metrics)
      integrityIndex: makeSeries(30, 76, 92),
      verifyLatencyMs: makeSeries(30, 210, 540),
      apiTraffic: makeSeries(30, 8000, 15000),
    },
    risk: {
      rateLimited24h: 19,
      blockedUploads24h: 7,
      suspiciousIPs24h: 3,
      topReasons: [
        { reason: "File type not allowed", count: 11 },
        { reason: "Size limit exceeded", count: 9 },
        { reason: "Signature invalid", count: 6 },
        { reason: "Hash mismatch", count: 4 },
      ],
    },
    news: [
      {
        id: "n1",
        at: nowMinus(55),
        source: "Watchtower",
        title: "New wave of synthetic media drives demand for provenance",
        sentiment: "positive",
      },
      {
        id: "n2",
        at: nowMinus(120),
        source: "ChainSignal",
        title: "Brands push for verification badges on public pages",
        sentiment: "positive",
      },
      {
        id: "n3",
        at: nowMinus(210),
        source: "RiskBrief",
        title: "Tamper attempts increase on viral visual assets",
        sentiment: "negative",
      },
    ],
    aiPipelines: [
      {
        id: "p1",
        name: "Upload → Claims → Sign → Verify",
        status: "healthy",
        lastRunAt: nowMinus(12),
        notes: "Demo signer active",
      },
      {
        id: "p2",
        name: "Nightly Integrity Re-scan",
        status: "healthy",
        lastRunAt: nowMinus(160),
        notes: "4 assets scanned / 1 mismatch",
      },
      {
        id: "p3",
        name: "API Usage Rollup (hourly)",
        status: "healthy",
        lastRunAt: nowMinus(38),
        notes: "latency stable",
      },
    ],
    agents: [
      {
        id: "ag1",
        name: "Integrity Sentinel",
        status: "online",
        queue: "verify",
        lastAction: "flagged mismatch a_1033",
        at: nowMinus(21),
      },
      {
        id: "ag2",
        name: "Claims Normalizer",
        status: "online",
        queue: "ingest",
        lastAction: "enriched tool metadata",
        at: nowMinus(70),
      },
      {
        id: "ag3",
        name: "RateLimit Watch",
        status: "degraded",
        queue: "edge",
        lastAction: "burst detected on /verify",
        at: nowMinus(14),
      },
    ],
    edu: [
      {
        id: "e1",
        title: "What is content provenance?",
        level: "Beginner",
        mins: 6,
      },
      {
        id: "e2",
        title: "Hashes, signatures, and integrity",
        level: "Beginner",
        mins: 9,
      },
      {
        id: "e3",
        title: "Claims schema design patterns",
        level: "Intermediate",
        mins: 12,
      },
      {
        id: "e4",
        title: "Operationalizing verification pages",
        level: "Intermediate",
        mins: 10,
      },
    ],
  };
  return base;
}

function makeSeries(n, min, max) {
  const arr = [];
  let v = min + Math.random() * (max - min);
  for (let i = 0; i < n; i++) {
    v = v + (Math.random() - 0.5) * (max - min) * 0.08;
    v = Math.max(min, Math.min(max, v));
    arr.push(Math.round(v));
  }
  return arr;
}

function makeAsset(opts) {
  const createdAt = opts.createdAt || iso(Date.now());
  const claims = {
    creator: opts.creator,
    organization: opts.org,
    creationDate: createdAt.slice(0, 10),
    tool: opts.tool,
    editsSummary: opts.edits,
    license: opts.license,
  };

  const hash = fakeHash();
  const sig = fakeSig();
  const bundle = {
    id: "b_" + randHex(8),
    hashAlg: "sha256",
    assetHash: hash,
    signature: sig,
    signer:
      opts.signerMode === "demo"
        ? "Demo HMAC signer"
        : "Extensible signer (adapter)",
    timestamp: createdAt,
    claims,
    claimsJson: JSON.stringify(claims, null, 2),
  };

  const timeline = [
    {
      at: createdAt,
      label: "Asset ingested",
      detail: `${opts.filename} (${opts.type})`,
    },
    {
      at: createdAt,
      label: "Claims attached",
      detail: `creator=${claims.creator}; org=${claims.organization}`,
    },
    {
      at: createdAt,
      label: "Bundle signed",
      detail: `${bundle.signer}; sig=${bundle.signature.slice(0, 14)}…`,
    },
    {
      at: createdAt,
      label: "Verification ready",
      detail: `/verify/${opts.id}`,
    },
  ];

  return {
    id: opts.id,
    createdAt,
    filename: opts.filename,
    type: opts.type,
    sizeMB: opts.sizeMB,
    status: opts.status, // verified, failed, pending
    signerMode: opts.signerMode, // demo, extensible
    bundle,
    integrity: {
      expected: opts.integrityExpected || "pass",
      current: opts.integrityCurrent || "pass",
      diagnostics:
        opts.integrityCurrent === "fail"
          ? {
              expectedHash: hash,
              computedHash: fakeHash(),
              diffHint: "Asset bytes changed after signing (hash mismatch).",
              lastCheckedAt: nowMinus(21),
            }
          : {
              expectedHash: hash,
              computedHash: hash,
              diffHint: "No differences detected.",
              lastCheckedAt: nowMinus(12),
            },
    },
    timeline,
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return seedState();
  }
}

export function saveState(state) {
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

export function resetState() {
  localStorage.removeItem(LS_KEY);
}

export function createAssetFromUpload(
  state,
  { filename, type, sizeMB, claims, signerMode }
) {
  const id = "a_" + (1000 + Math.floor(Math.random() * 8999));
  const createdAt = new Date().toISOString();
  const asset = {
    id,
    createdAt,
    filename,
    type,
    sizeMB,
    status: "verified",
    signerMode,
    bundle: {
      id: "b_" + randHex(8),
      hashAlg: "sha256",
      assetHash: fakeHash(),
      signature: fakeSig(),
      signer:
        signerMode === "demo"
          ? "Demo HMAC signer"
          : "Extensible signer (adapter)",
      timestamp: createdAt,
      claims,
      claimsJson: JSON.stringify(claims, null, 2),
    },
    integrity: {
      expected: "pass",
      current: "pass",
      diagnostics: {
        expectedHash: "—",
        computedHash: "—",
        diffHint: "No differences detected.",
        lastCheckedAt: createdAt,
      },
    },
    timeline: [
      {
        at: createdAt,
        label: "Asset ingested",
        detail: `${filename} (${type})`,
      },
      {
        at: createdAt,
        label: "Claims attached",
        detail: `creator=${claims.creator}; org=${claims.organization}`,
      },
      {
        at: createdAt,
        label: "Bundle signed",
        detail: `${
          signerMode === "demo"
            ? "Demo HMAC signer"
            : "Extensible signer (adapter)"
        }; sig=${fakeSig().slice(0, 14)}…`,
      },
      { at: createdAt, label: "Verification ready", detail: `/verify/${id}` },
    ],
  };

  const next = structuredClone(state);
  next.assets = [asset, ...next.assets];

  next.usageLogs = [
    {
      id: "l_" + randHex(6),
      at: createdAt,
      level: "info",
      action: "sign.asset",
      actor: "user:session",
      meta: `bundle created — ${id} (${signerMode} signer)`,
    },
    ...next.usageLogs,
  ];

  next.counters.uploads7d += 1;
  next.counters.verified7d += 1;

  saveState(next);
  return next;
}

export function toggleAssetTamper(state, assetId) {
  const next = structuredClone(state);
  const a = next.assets.find((x) => x.id === assetId);
  if (!a) return state;

  const toFail = a.integrity.current !== "fail";
  a.integrity.current = toFail ? "fail" : "pass";
  a.status = toFail ? "failed" : "verified";

  if (toFail) {
    a.integrity.diagnostics = {
      expectedHash: a.bundle.assetHash,
      computedHash: fakeHash(),
      diffHint: "Asset bytes changed after signing (hash mismatch).",
      lastCheckedAt: new Date().toISOString(),
    };
  } else {
    a.integrity.diagnostics = {
      expectedHash: a.bundle.assetHash,
      computedHash: a.bundle.assetHash,
      diffHint: "No differences detected.",
      lastCheckedAt: new Date().toISOString(),
    };
  }

  next.usageLogs = [
    {
      id: "l_" + randHex(6),
      at: new Date().toISOString(),
      level: toFail ? "warn" : "info",
      action: "verify.asset",
      actor: "ui",
      meta: `integrity ${toFail ? "mismatch" : "ok"} — asset ${assetId}`,
    },
    ...next.usageLogs,
  ];

  saveState(next);
  return next;
}

export function createApiKey(state, label, scope) {
  const next = structuredClone(state);
  const id = "k_" + randHex(6);
  const prefix = "vm_live_";
  const key = prefix + randHex(28);
  next.apiKeys = [
    {
      id,
      label,
      prefix,
      key,
      createdAt: new Date().toISOString(),
      lastUsedAt: "—",
      enabled: true,
      scope,
    },
    ...next.apiKeys,
  ];
  next.usageLogs = [
    {
      id: "l_" + randHex(6),
      at: new Date().toISOString(),
      level: "info",
      action: "apikey.create",
      actor: "admin:session",
      meta: `created key ${id} (${label})`,
    },
    ...next.usageLogs,
  ];
  saveState(next);
  return next;
}

export function toggleApiKey(state, id) {
  const next = structuredClone(state);
  const k = next.apiKeys.find((x) => x.id === id);
  if (!k) return state;
  k.enabled = !k.enabled;
  next.usageLogs = [
    {
      id: "l_" + randHex(6),
      at: new Date().toISOString(),
      level: "info",
      action: "apikey.toggle",
      actor: "admin:session",
      meta: `${k.enabled ? "enabled" : "disabled"} key ${id}`,
    },
    ...next.usageLogs,
  ];
  saveState(next);
  return next;
}

export function deleteApiKey(state, id) {
  const next = structuredClone(state);
  next.apiKeys = next.apiKeys.filter((x) => x.id !== id);
  next.usageLogs = [
    {
      id: "l_" + randHex(6),
      at: new Date().toISOString(),
      level: "warn",
      action: "apikey.delete",
      actor: "admin:session",
      meta: `deleted key ${id}`,
    },
    ...next.usageLogs,
  ];
  saveState(next);
  return next;
}

export function formatAgo(isoTs) {
  if (!isoTs || isoTs === "—") return "—";
  const ms = Date.now() - new Date(isoTs).getTime();
  const m = Math.floor(ms / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function safeFileTypeOk(type) {
  // UI-only constraints (looks real)
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/webp",
    "video/mp4",
    "video/quicktime",
    "video/webm",
  ];
  return allowed.includes(type);
}

export function mb(n) {
  return `${n.toFixed(1)} MB`;
}
