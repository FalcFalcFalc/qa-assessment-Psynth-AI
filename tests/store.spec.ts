import { test } from "playwright/test";
import 'dotenv/config';
import { LoginInteractions } from "../pom/interactions/login.interactions";
import process from "process";
import { StoreInteractions } from "../pom/interactions/store.interactions";
import { StoreItems } from "../enums/store";
import { CartInteractions } from "../pom/interactions/cart.interactions";
import { TopBarInteractions } from "../pom/interactions/top_bar.interactions";
import { navigateTo } from "../helpers/navigateTo";

test.describe("Store Tests", () => {

    let store: StoreInteractions;
    let login: LoginInteractions;
    let topbar: TopBarInteractions;

    test.beforeEach(async ({ page }) => {
        store = new StoreInteractions(page);
        login = new LoginInteractions(page);
        topbar = new TopBarInteractions(page);
        await navigateTo(page, process.env.BASE_URL!);
    });

    test("Cart increased count", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const count = await topbar.getBadgeCount();
        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.assertBadgeCountGreaterThan(count);
    });

    test("Cart decreased count", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        let count = await topbar.getBadgeCount();
        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.assertBadgeCountGreaterThan(count);
        count = await topbar.getBadgeCount();
        await store.removeItemFromCart(StoreItems.BACKPACK);
        await topbar.assertBadgeCountLessThan(count);
    });

    test("Add multiple items", async () => {
        test.fail(true, "It is not possible to add multiple instances of the same item to the cart. The 'Add to cart' button changes to 'Remove' after adding the first one, so you can't add more without removing it first.");
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        const timesAdded = 3;
        const ogCount = await topbar.getBadgeCount();
        for (let i = 0; i < timesAdded; i++) {
            await store.addItemToCart(StoreItems.BACKPACK);
        }
        await topbar.assertBadgeCountGreaterThan(ogCount + timesAdded);
    });
});