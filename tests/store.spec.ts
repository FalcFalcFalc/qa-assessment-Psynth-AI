import { expect, test } from "playwright/test";
import 'dotenv/config';
import { LoginInteractions } from "../pom/interactions/login.interactions";
import process from "process";
import { StoreInteractions } from "../pom/interactions/store.interactions";
import { StoreItems } from "../enums/store";
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

    test("Add multiple items to cart", async () => {
        test.fail(true, "It is not possible to add multiple instances of the same item to the cart.");
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        const timesAdded = 3;
        const ogCount = await topbar.getBadgeCount();
        for (let i = 0; i < timesAdded; i++) {
            await store.addItemToCart(StoreItems.BACKPACK);
        }
        await topbar.assertBadgeCountGreaterThan(ogCount + timesAdded);
    });

    test("Item price is the same for different users", async () => {
        test.fail(true, "The item price is not consistent between users.");
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const { price } = await store.clickItemLink(StoreItems.BACKPACK);

        await topbar.logout();
        await login.login(process.env.VISUAL_USER, process.env.VISUAL_USER_PASSWORD);

        await store.assertItemPrice(StoreItems.BACKPACK, price);
    });
});