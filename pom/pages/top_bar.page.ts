import { Locator, Page } from "playwright/test";

export class TopBarPage {
    readonly cartButton: Locator;
    readonly cartBadge: Locator;
    readonly hamburgerMenuButton: Locator;
    readonly allItemsLink: Locator;
    readonly aboutLink: Locator;
    readonly logoutLink: Locator;
    readonly resetAppStateLink: Locator;

    constructor(page: Page) {
        const hamburgerLink = (hasText: string) => page.locator(".bm-item-list a").filter({ hasText });
        this.allItemsLink = hamburgerLink("All Items");
        this.aboutLink = hamburgerLink("About");
        this.logoutLink = hamburgerLink("Logout");
        this.resetAppStateLink = hamburgerLink("Reset App State");

        this.cartButton = page.locator("a.shopping_cart_link");
        this.cartBadge = this.cartButton.locator("span.shopping_cart_badge");
        this.hamburgerMenuButton = page.locator("#react-burger-menu-btn");
    }
}