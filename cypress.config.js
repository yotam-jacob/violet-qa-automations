const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");
const SLACK_WEBHOOK_URL =
  "https://hooks.slack.com/services/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"; //delete me later
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
    // split on dot, underscore, dash, slash, or backslash
    .split(/[._\-\/\\]+/)
    .filter(Boolean)
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
const ghRepo = () =>
  process.env.GITHUB_REPOSITORY || "Exactius/violet-qa-automations";
const ghRun = () =>
  process.env.GITHUB_RUN_ID
    ? `https://github.com/${ghRepo()}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : "";

module.exports = defineConfig({
  video: true,
  screenshotsFolder: "cypress/screenshots",
  videosFolder: "cypress/videos",
  e2e: {
    baseUrl: "https://staging.violetgrowth.com",
    retries: {
      runMode: 0,
      openMode: 0,
    },
    specPattern: "cypress/tests/**/*.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1920,
    viewportHeight: 1080,
    videoCompression: false,
    setupNodeEvents(on, config) {
      // on("after:run", async (r) => {
      //   const isGH = !!(
      //     process.env.GITHUB_ACTIONS || process.env.GITHUB_RUN_ID
      //   );
      //   const reportPath =
      //     process.env.SLACK_REPORT_PATH ||
      //     path.join(process.cwd(), "slack_report.txt");

      //   const {
      //     totalTests,
      //     totalPassed,
      //     totalFailed,
      //     totalDuration,
      //     cypressVersion,
      //     browserName,
      //     browserVersion,
      //     runs,
      //   } = r;
      //   const label = envLabel(config.baseUrl),
      //     passRate = Math.round((totalPassed / totalTests) * 100) || 0,
      //     mins = Math.floor(totalDuration / 6e4),
      //     secs = Math.round((totalDuration % 6e4) / 1e3),
      //     failed = totalFailed > 0,
      //     emoji = failed ? "❌" : "✅";

      //   const lines = [
      //     SEP,
      //     `${emoji} *QA Automations Report — ${label}* — ${totalPassed}/${totalTests} passed (${passRate}%) • ${mins}m ${secs}s`,
      //     SEP,
      //     isGH
      //       ? `GitHub Job: <${ghRun()}|Open Job>`
      //       : `Local test run — no job or artifacts.`,
      //     SEP,
      //     "",
      //   ];

      //   for (const run of runs) {
      //     const file = (run.spec.name || "").split("/").pop(),
      //       nice = suiteName(file),
      //       tests = (run.tests || []).filter((t) =>
      //         ["passed", "failed", "skipped", "pending"].includes(
      //           t.state || t.attempts?.slice(-1)?.[0]?.state
      //         )
      //       );
      //     if (!tests.length) continue;

      //     lines.push(`*Test Suite - ${nice} (${file})*`, SEP);
      //     tests.forEach((t, i) => {
      //       const s = t.state || t.attempts?.slice(-1)?.[0]?.state,
      //         prefix =
      //           s === "passed"
      //             ? "✅"
      //             : s === "failed"
      //             ? "❌"
      //             : s === "skipped"
      //             ? "⏭ Skipped:"
      //             : "🟡 Pending:",
      //         title = t.title
      //           ? t.title.slice(1).join(" › ") || t.title.join(" › ")
      //           : "Unnamed test";
      //       lines.push(`  ${i + 1}. ${prefix} ${title}`);
      //     });
      //     lines.push("");
      //   }

      //   lines.push(
      //     SEP,
      //     `Cypress: ${cypressVersion} • Browser: ${browserName} ${browserVersion} • Node: ${process.version}`
      //   );

      //   // Write the report so the workflow can append artifact link & post
      //   fs.writeFileSync(reportPath, lines.join("\n"));

      //   // Only send directly when running locally
      //   if (!isGH && SLACK_WEBHOOK_URL) {
      //     await fetch(SLACK_WEBHOOK_URL, {
      //       method: "POST",
      //       headers: { "Content-Type": "application/json" },
      //       body: JSON.stringify({ text: lines.join("\n") }),
      //     });
      //   }
      // });

      return config;
    },
  },
});
