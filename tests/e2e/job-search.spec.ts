import { test, expect } from "@playwright/test";

test.describe("Job Search", () => {
  test("homepage loads successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/HARDCOREJOBS/);
  });

  test("can navigate to jobs page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/jobs"]');
    await expect(page).toHaveURL(/\/jobs/);
  });

  test("jobs page displays job listings", async ({ page }) => {
    await page.goto("/jobs");
    await expect(page.locator("main")).toBeVisible();
  });
});

test.describe("Accessibility", () => {
  test("skip link is functional", async ({ page }) => {
    await page.goto("/");

    // Tab to skip link
    await page.keyboard.press("Tab");
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeFocused();

    // Activate skip link
    await page.keyboard.press("Enter");
    await expect(page.locator("#main-content")).toBeFocused();
  });

  test("navigation is keyboard accessible", async ({ page }) => {
    await page.goto("/");

    // Tab through nav items
    await page.keyboard.press("Tab"); // Skip link
    await page.keyboard.press("Tab"); // Logo
    await page.keyboard.press("Tab"); // First nav item

    const navLink = page.locator('nav a').first();
    await expect(navLink).toBeVisible();
  });
});

test.describe("Responsive Design", () => {
  test("mobile menu toggles on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(menuButton).toBeVisible();

    // Click to open menu
    await menuButton.click();

    // Nav links should now be visible in mobile menu
    const mobileNav = page.locator('nav a').first();
    await expect(mobileNav).toBeVisible();
  });
});
