import { expect, Page } from "playwright/test";
import { TopBarPage } from "../pages/top_bar.page";

export class TopBarInteractions {
    readonly page: Page;
    readonly topBarPage: TopBarPage;

    constructor(page: Page) {
        this.page = page;
        this.topBarPage = new TopBarPage(this.page);
    }

    // Actions --------------------------------------------------------------------------------------------

    /**
     * Clicks on cart
     */
    async clickCart() {
        await this.topBarPage.cartButton.click();
    }

    /**
     * Clicks the hamburger menu
     */
    async clickHamburgerMenu() {
        await this.topBarPage.hamburgerMenuButton.click();
    }

    /**
     * Clicks on All Items
     */
    async clickAllItems() {
        await this.topBarPage.allItemsLink.click();
    }

    /**
     * Clicks on About
     */
    async clickAbout() {
        await this.topBarPage.aboutLink.click();
    }

    /**
     * Clicks on Logout
     */
    async clickLogout() {
        await this.topBarPage.logoutLink.click();
    }

    /**
     * Logs out
     */
    async logout() {
        await this.clickHamburgerMenu();
        await this.clickLogout();
    }

    /**
     * Clicks on Reset App State
     */
    async clickResetAppState() {
        await this.topBarPage.resetAppStateLink.click();
    }

    /**
     * Gets the badge count
     */
    async getBadgeCount(): Promise<number> {
        const badge = this.topBarPage.cartBadge;
        if (!(await badge.isVisible())) {
            return 0;
        }
        const badgeText = await badge.textContent();
        if (badgeText === null) {
            return 0;
        }
        const count = parseInt(badgeText.trim(), 10);
        return isNaN(count) ? 0 : count;
    }

    // Validations ----------------------------------------------------------------------------------------

    /**
     * Assert badge count is greater than a number
     * @param expectedCount 
     */
    async assertBadgeCountGreaterThan(expectedCount: number) {
        const actualCount = await this.getBadgeCount();
        expect(actualCount).toBeGreaterThan(expectedCount);
    }

    /**
     * Assert badge count is less than a number
     * @param expectedCount 
     */
    async assertBadgeCountLessThan(expectedCount: number) {
        if (expectedCount > 1) {
            const actualCount = await this.getBadgeCount();
            expect(actualCount).toBeLessThan(expectedCount);
        }
        else {
            await this.assertBadgeNotDisplayed();
        }
    }

    /**
     * Assert badge not displayed
     */
    async assertBadgeNotDisplayed() {
        await expect(this.topBarPage.cartBadge).not.toBeVisible();
    }
}