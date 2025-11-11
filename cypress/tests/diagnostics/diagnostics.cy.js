describe("Diagnostics", () => {
  it("prints CI IP and the login HTML shape", () => {
    cy.request("https://api.ipify.org?format=json").then((response) => {
      cy.log(`CI_IP=${response.body.ip}`);
    });

    const url = "https://dev.violetgrowth.com/login?from=/";
    cy.request({
      url,
      failOnStatusCode: false,
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "en-US,en;q=0.9",
      },
    }).then((res) => {
      const body = String(res.body || "");
      const lower = body.toLowerCase();

      const markers = [
        "captcha",
        "verify you are human",
        "access denied",
        "blocked",
        "challenge",
        "checking your browser",
      ];
      const found = markers.filter((marker) => lower.includes(marker));

      cy.log(`STATUS=${res.status}`);
      cy.log(`BOT_MARKERS=${found.join(",") || "none"}`);

      const snippet = body.slice(0, 10000);
      cy.writeFile("cypress/artifacts/diagnostics-login-body.html", snippet, {
        log: false,
      });
    });
  });
});
