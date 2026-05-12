import { test } from "playwright/test";
import 'dotenv/config';
import { LoginInteractions } from "../pom/interactions/login.interactions";
import process from "process";
import { StoreInteractions } from "../pom/interactions/store.interactions";
import { StoreItems } from "../enums/store";
import { CartInteractions } from "../pom/interactions/cart.interactions";
import { TopBarInteractions } from "../pom/interactions/top_bar.interactions";

test.describe("Store Tests", () => {

    let store: StoreInteractions;
    let login: LoginInteractions;
    let topbar: TopBarInteractions;

    test.beforeEach(async ({ page }) => {
        store = new StoreInteractions(page);
        login = new LoginInteractions(page);
        topbar = new TopBarInteractions(page);
        await page.goto("https://www.saucedemo.com/");
    });

    test("View Item", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const id = await store.clickItemLink(StoreItems.BACKPACK);
        await store.assertItemDetailsIsDisplayed(id!)
    });

    test("Cart increased count", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const count = await topbar.getBadgeCount();
        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.assertBadgeCountGreaterThan(count);
    });

    test("Add multiple items", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        const timesAdded = 3;
        const ogCount = await topbar.getBadgeCount();
        for (let i = 0; i < timesAdded; i++) {
            await store.addItemToCart(StoreItems.BACKPACK);
        }
        await topbar.assertBadgeCountGreaterThan(ogCount + timesAdded);
    });
});