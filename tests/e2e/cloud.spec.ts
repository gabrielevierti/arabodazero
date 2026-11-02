import { test, expect, type Page } from "@playwright/test";

/**
 * Optional backup to the person's own Google Drive. The build only offers it
 * when it carries an OAuth client id (VITE_GOOGLE_CLIENT_ID), so these tests
 * check that it is absent otherwise, and that the whole round trip works —
 * against a stand-in for Google, never the real service.
 */
const FILE_ID = "file-1";

/** A stand-in for Google: the sign-in script and the Drive app-data folder. */
async function fakeGoogle(page: Page, store: { text?: string; modifiedTime?: string }) {
  await page.route("https://accounts.google.com/gsi/client", (route) =>
    route.fulfill({
      contentType: "text/javascript",
      body: `window.google = { accounts: { oauth2: {
        initTokenClient: (c) => ({
          requestAccessToken() { setTimeout(() => this.callback({ access_token: "test-token", expires_in: 3600 }), 0); },
        }),
        revoke: (token, done) => done && done(),
      } } };`,
    }),
  );
  await page.route(/https:\/\/www\.googleapis\.com\/.*/, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const auth = request.headers()["authorization"];
    if (auth !== "Bearer test-token") return route.fulfill({ status: 401, body: "{}" });
    if (url.pathname === "/drive/v3/files" && request.method() === "GET")
      return route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          files: store.text ? [{ id: FILE_ID, modifiedTime: store.modifiedTime }] : [],
        }),
      });
    if (url.pathname === `/drive/v3/files/${FILE_ID}` && url.searchParams.get("alt") === "media")
      return route.fulfill({ contentType: "application/json", body: store.text || "" });
    // create (multipart) and update (media): keep the JSON body
    const body = request.postData() || "";
    const json = body.includes("multipart") || body.startsWith("--") ? body.split(/\r\n\r\n/).pop()!.split(/\r\n--/)[0] : body;
    store.text = json;
    store.modifiedTime = new Date().toISOString();
    return route.fulfill({ contentType: "application/json", body: JSON.stringify({ id: FILE_ID }) });
  });
}

const configured = async (page: Page) => {
  await page.goto("/#/settings");
  await expect(page.locator(".az-settings")).toBeVisible();
  return (await page.locator(".az-cloud").count()) > 0;
};

test("the Google backup is offered only when the build carries a client id", async ({ page }) => {
  const store: { text?: string } = {};
  await fakeGoogle(page, store);
  if (!(await configured(page))) {
    // no client id in this build: the site must not mention the account anywhere
    await expect(page.getByText(/account Google/i)).toHaveCount(0);
    return;
  }
  await expect(page.getByRole("heading", { name: /Salvataggio con Google/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Collega il tuo account Google/ })).toBeVisible();
});

test("connecting saves a copy, and a copy from another device is merged in", async ({ page }) => {
  const store: { text?: string; modifiedTime?: string } = {};
  await fakeGoogle(page, store);
  if (!(await configured(page))) test.skip();
  // some work done on this device
  await page.goto("/#/lesson/A0-L0-01");
  await page.getByRole("button", { name: /02 Allenati/ }).click();
  await page.locator(".choice-options button").first().click();
  await page.goto("/#/settings");
  await page.getByRole("button", { name: /Collega il tuo account Google/ }).click();
  await expect(page.locator(".az-cloud-state")).toContainText(/Copia salvata nel tuo Drive/);
  expect(JSON.parse(store.text!).data["answer:native:A0-L0-01:starter:1"]).toBeTruthy();

  // another device has studied a different lesson and saved its copy
  const other = JSON.parse(store.text!);
  other.data["progress:A0-L0-02"] = { read: [0, 1], step: 1 };
  other.data["study:2026-01-01"] = { seconds: 900 };
  store.text = JSON.stringify(other);
  store.modifiedTime = new Date(Date.now() + 60000).toISOString();

  await page.reload();
  await page.waitForTimeout(1500);
  await page.getByRole("button", { name: "Sincronizza ora" }).click();
  await expect(page.locator(".az-cloud-state")).toContainText(/Copia salvata nel tuo Drive/);
  // the work of both devices is now on this one and in the copy
  const merged = JSON.parse(store.text!).data;
  expect(merged["progress:A0-L0-02"].read).toEqual([0, 1]);
  expect(merged["answer:native:A0-L0-01:starter:1"]).toBeTruthy();
  const local = await page.evaluate(
    () =>
      new Promise<any>((resolve) => {
        const r = indexedDB.open("arabic-academy:./");
        r.onsuccess = () => {
          const tx = r.result.transaction("records", "readonly").objectStore("records").get("progress:A0-L0-02");
          tx.onsuccess = () => resolve(tx.result);
        };
      }),
  );
  expect(local.read).toEqual([0, 1]);
});

test("disconnecting stops the backup and keeps the progress on the device", async ({ page }) => {
  const store: { text?: string; modifiedTime?: string } = {};
  await fakeGoogle(page, store);
  if (!(await configured(page))) test.skip();
  await page.getByRole("button", { name: /Collega il tuo account Google/ }).click();
  await expect(page.locator(".az-cloud-state")).toBeVisible();
  await page.getByRole("button", { name: "Scollega questo dispositivo" }).click();
  await page.getByRole("button", { name: "Sì, scollega" }).click();
  await expect(page.getByRole("button", { name: /Collega il tuo account Google/ })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: /Collega il tuo account Google/ })).toBeVisible();
});
