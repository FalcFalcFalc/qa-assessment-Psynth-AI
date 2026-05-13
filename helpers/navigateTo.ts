import { expect, Page } from "playwright/test";

export async function navigateTo(page: Page, path: string) {
    // I was having some issues with navigation and the URL not updating, so I added an assertion to make sure the navigation was successful
    await page.goto(`${path}`);
    expect(page.url()).toContain(`${path}`);
}