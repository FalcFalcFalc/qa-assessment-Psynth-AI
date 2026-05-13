import { expect, Page } from "playwright/test";

export async function navigateTo(page: Page, path: string) {
    await page.goto(`${process.env.BASE_URL}${path}`);
    expect(page.url()).toContain(`${process.env.BASE_URL}${path}`);
}