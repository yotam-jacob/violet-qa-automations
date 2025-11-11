// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-real-events/support";
import "@neuralegion/cypress-har-generator/commands";

Cypress.on("uncaught:exception", (err) => {
  if (err.message.includes("&")) {
    return false; 
  } else if (
    err.message.includes("NetworkError when attempting to fetch resource")
  ) {
    return false; 
  } else if (
    err.message.includes("Failed to execute 'writeText' on 'Clipboard'")
  ) {
    return false; 
  } else if (err.message.includes("showCustomViewAsync")) {
    return false; 
  } else if (err.message.includes("reading 'status'")) {
    return false; 
  } else if (err.message.includes('Request failed with status code 500')) {
    return false; 
  }

  return true;
});

require("cypress-xpath");

const sanitizeFileName = (value) =>
  value.replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "") || "network-log";

const consoleLevels = ["log", "info", "warn", "error", "debug"];
const consoleBuffer = [];

const serializeArg = (arg) => {
  if (arg === undefined) return "undefined";
  if (arg === null) return "null";
  if (typeof arg === "string") return arg;
  if (typeof arg === "number" || typeof arg === "boolean") return `${arg}`;
  if (arg instanceof Error) {
    return arg.stack || `${arg.name}: ${arg.message}`;
  }
  try {
    return JSON.stringify(arg);
  } catch (error) {
    return Object.prototype.toString.call(arg);
  }
};

Cypress.on("window:before:load", (win) => {
  consoleLevels.forEach((level) => {
    const original = win.console[level] && win.console[level].bind(win.console);
    win.console[level] = (...args) => {
      try {
        consoleBuffer.push({
          level,
          timestamp: new Date().toISOString(),
          messages: args.map(serializeArg),
        });
      } catch {
        // ignore serialization issues
      }

      if (original) {
        original(...args);
      }
    };
  });

  win.addEventListener("error", (event) => {
    consoleBuffer.push({
      level: "error",
      timestamp: new Date().toISOString(),
      messages: [event?.message || "Uncaught error"],
      details: {
        source: event?.filename,
        line: event?.lineno,
        column: event?.colno,
      },
    });
  });

  win.addEventListener("unhandledrejection", (event) => {
    consoleBuffer.push({
      level: "error",
      timestamp: new Date().toISOString(),
      messages: [
        "Unhandled promise rejection",
        serializeArg(event?.reason),
      ],
    });
  });
});

beforeEach(() => {
  consoleBuffer.length = 0;
  cy.recordHar();
});

afterEach(function () {
  const titlePath = this.currentTest?.titlePath?.() || [];
  const fileSlug = sanitizeFileName(titlePath.join("__") || `test-${Date.now()}`);
  const testTitle = titlePath.join(" > ") || "Unnamed test";
  const consoleEntries = consoleBuffer.splice(0);

  return cy
    .saveHar({ fileName: `${fileSlug}.har` })
    .then(() =>
      cy.task("saveConsoleLogEntries", {
        fileName: `${fileSlug}-console.json`,
        entries: consoleEntries,
        meta: {
          spec: Cypress.spec?.name || "unknown-spec",
          test: testTitle,
        },
      })
    );
});
