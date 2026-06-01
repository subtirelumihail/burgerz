import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, "..");
const configPath = path.join(projectRoot, "pa11y.json");

const PORT = process.env.PORT || 3000;
const baseURL = `http://localhost:${PORT}`;
const FETCH_TIMEOUT_MS = 5_000;
const mockEnv = {
  ...process.env,
  PORT: String(PORT),
  NEXT_PUBLIC_API_MOCKING: "enabled",
};

const paths = [
  "/",
  "/restaurants",
  "/burgers/burger-1",
  "/restaurants/restaurant-1",
];

function log(message) {
  console.log(`[a11y] ${message}`);
}

async function fetchWithTimeout(url, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function probeServer(url) {
  try {
    const response = await fetchWithTimeout(url);
    return { status: "ready", ok: response.ok };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { status: "timeout" };
    }

    return { status: "down" };
  }
}

function runPa11y(url) {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["pa11y", url, "--config", configPath], {
      cwd: projectRoot,
      stdio: "inherit",
      env: mockEnv,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `pa11y failed for ${url} with exit code ${code ?? "unknown"}`,
        ),
      );
    });
  });
}

async function isMockDataReady(url) {
  try {
    const response = await fetchWithTimeout(`${url}/api/burgers/burger-1`);
    if (!response.ok) {
      return false;
    }

    const burger = await response.json();
    return burger?.id === "burger-1" && burger?.title === "Smash Shack Classic";
  } catch {
    return false;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function startServer() {
  return spawn("npx", ["next", "dev", "--port", String(PORT)], {
    cwd: projectRoot,
    env: mockEnv,
    stdio: "inherit",
  });
}

function stopServer(server) {
  if (server && !server.killed) {
    server.kill("SIGTERM");
  }
}

function assertServerProcessRunning(server) {
  if (server.exitCode !== null) {
    throw new Error(
      `Mock dev server exited before becoming ready. Another Next.js dev server may already be running in this project. Stop it, then run "npm run test:a11y" again, or start the app with "npm run dev:mock".`,
    );
  }
}

async function waitForServer(url, server, maxAttempts = 60) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    assertServerProcessRunning(server);

    const probe = await probeServer(url);
    if (probe.status === "ready" && probe.ok) {
      return;
    }

    if (attempt === 1 || attempt % 5 === 0) {
      log(
        `Waiting for mock dev server at ${url} (${attempt}/${maxAttempts})...`,
      );
    }

    await sleep(1000);
  }

  throw new Error(`Server at ${url} did not become ready in time`);
}

async function waitForMockData(url, server, maxAttempts = 60) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    assertServerProcessRunning(server);

    if (await isMockDataReady(url)) {
      return;
    }

    if (attempt === 1 || attempt % 5 === 0) {
      log(`Waiting for mock API at ${url} (${attempt}/${maxAttempts})...`);
    }

    await sleep(1000);
  }

  throw new Error(
    `Mock data was not available at ${url}. Ensure NEXT_PUBLIC_API_MOCKING=enabled and MSW is running.`,
  );
}

async function ensureMockServer() {
  log(`Checking for mock server at ${baseURL}...`);

  const probe = await probeServer(baseURL);

  if (probe.status === "timeout") {
    throw new Error(
      `Port ${PORT} is occupied but not responding. Kill the stale process with "lsof -ti :${PORT} | xargs kill", or run "PORT=3010 npm run test:a11y".`,
    );
  }

  if (probe.status === "ready") {
    log("Server detected. Verifying mock data...");

    if (await isMockDataReady(baseURL)) {
      log(`Using existing mock server at ${baseURL}`);
      return { server: null, startedServer: false };
    }

    throw new Error(
      `Server at ${baseURL} is running without mock data. Stop it, then run "npm run test:a11y" or start the app with "npm run dev:mock".`,
    );
  }

  log(`Starting mock dev server on port ${PORT}...`);
  const server = startServer();

  await waitForServer(baseURL, server);
  await waitForMockData(baseURL, server);

  log("Mock dev server is ready");
  return { server, startedServer: true };
}

async function main() {
  let server = null;
  let startedServer = false;

  const handleSignal = () => {
    stopServer(startedServer ? server : null);
    process.exit(1);
  };

  process.on("SIGINT", handleSignal);
  process.on("SIGTERM", handleSignal);

  try {
    ({ server, startedServer } = await ensureMockServer());

    for (const route of paths) {
      const url = `${baseURL}${route}`;
      log(`Running pa11y on ${url}`);
      await runPa11y(url);
    }
  } finally {
    if (startedServer) {
      stopServer(server);
    }
  }
}

main().catch((error) => {
  console.error(`[a11y] ${error.message}`);
  process.exit(1);
});
