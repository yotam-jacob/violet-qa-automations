const { defineConfig } = require("cypress");

const SLACK_WEBHOOK_URL =
  "https://hooks.slack.com/services/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";
const SEP = "────────────────────────────────";
const envLabel = (u) =>
  ((h) =>
    h.includes("staging")
      ? "Staging"
      : h.includes("dev")
      ? "Dev"
      : h.includes("prod") || h === "app.violetgrowth.com"
      ? "Prod"
      : h)(new URL(u).host.toLowerCase());
const suiteName = (f) =>
  f
    .replace(/\.cy\.(j|t)sx?$/i, "")
    .replace(/\.spec\.(j|t)sx?$/i, "")
    .replace(/\.(j|t)sx?$/i, "")
    .split(/[._\-/]+/)
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
const ghRepo = () =>
  process.env.GITHUB_REPOSITORY || "Exactius/violet-qa-automations";
const ghRun = () =>
  process.env.GITHUB_RUN_ID
    ? `https://github.com/${ghRepo()}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "<GITHUB_RUN_URL_PLACEHOLDER>";
const ghArtifact = (name) =>
  process.env.GITHUB_RUN_ID
    ? `https://github.com/${ghRepo()}/actions/runs/${
        process.env.GITHUB_RUN_ID
      }/artifacts?name=${encodeURIComponent(name)}`
    : `<GITHUB_ARTIFACT_${name.toUpperCase()}_URL_PLACEHOLDER>`;

module.exports = defineConfig({
  component: { devServer: { framework: "react", bundler: "vite" } },
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  videoCompression: false,
  e2e: {
    baseUrl: "https://staging.violetgrowth.com/",
    specPattern: "cypress/tests/violet_app/**/*.js",
    viewportWidth: 1920,
    viewportHeight: 1080,
    screenshotOnRunFailure: false,
    videoCompression: false,
    pageLoadTimeout: 240000,
    retries: { runMode: 2, openMode: 0 },
    setupNodeEvents(on, config) {
      on("task", { logToTerminal: (m) => (console.log(m), null) });
      on(
        "before:browser:launch",
        (b = {}, o) => (
          b.family === "chromium" &&
            o.args.push(
              "--no-sandbox",
              "--disable-gpu",
              "--disable-dev-shm-usage",
              '--js-flags="--max_old_space_size=1024 --max_semi_space_size=1024"'
            ),
          o
        )
      );

      on("after:run", async (r) => {
        if (!SLACK_WEBHOOK_URL) return;
        const {
          totalTests,
          totalPassed,
          totalFailed,
          totalDuration,
          cypressVersion,
          browserName,
          browserVersion,
          runs,
        } = r;
        const label = envLabel(config.baseUrl),
          passRate = Math.round((totalPassed / totalTests) * 100) || 0,
          mins = Math.floor(totalDuration / 6e4),
          secs = Math.round((totalDuration % 6e4) / 1e3),
          failed = totalFailed > 0,
          emoji = failed ? "❌" : "✅";

        const lines = [
          SEP,
          `${emoji} *QA Automations Report — ${label}* — ${totalPassed}/${totalTests} passed (${passRate}%) • ${mins}m ${secs}s`,
          SEP,
          `GitHub Job: <${ghRun()}|Open Job>`,
          failed
            ? `Artifacts (videos): <${ghArtifact(
                "cypress-videos"
              )}|Open>\nArtifacts (screenshots): <${ghArtifact(
                "cypress-screenshots"
              )}|Open>`
            : `Job passed — no artifacts.`,
          SEP,
          "",
        ];

        for (const run of runs) {
          const file = (run.spec.name || "").split("/").pop(),
            nice = suiteName(file),
            tests = (run.tests || []).filter((t) =>
              ["passed", "failed", "skipped", "pending"].includes(
                t.state || t.attempts?.slice(-1)?.[0]?.state
              )
            );
          if (!tests.length) continue;

          lines.push(`*Test Suite - ${nice} (${file})*`, SEP);
          tests.forEach((t, i) => {
            const s = t.state || t.attempts?.slice(-1)?.[0]?.state,
              prefix =
                s === "passed"
                  ? "✅"
                  : s === "failed"
                  ? "❌"
                  : s === "skipped"
                  ? "⏭ Skipped:"
                  : "🟡 Pending:",
              title = t.title
                ? t.title.slice(1).join(" › ") || t.title.join(" › ")
                : "Unnamed test";
            lines.push(`  ${i + 1}. ${prefix} ${title}`);
          });
          lines.push("");
        }

        lines.push(
          SEP,
          `Cypress: ${cypressVersion} • Browser: ${browserName} ${browserVersion} • Node: ${process.version}`
        );
        await fetch(SLACK_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: lines.join("\n") }),
        });
      });

      return config;
    },
  },
});
