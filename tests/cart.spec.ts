import { expect, test } from "playwright/test";
import 'dotenv/config';
import { LoginInteractions } from "../pom/interactions/login.interactions";
import process from "process";
import { StoreInteractions } from "../pom/interactions/store.interactions";
import { StoreItems } from "../enums/store";
import { CartInteractions } from "../pom/interactions/cart.interactions";
import { TopBarInteractions } from "../pom/interactions/top_bar.interactions";

test.describe("Cart Tests", () => {

    let store: StoreInteractions;
    let login: LoginInteractions;
    let topbar: TopBarInteractions;
    let cart: CartInteractions;

    test.beforeEach(async ({ page }) => {
        store = new StoreInteractions(page);
        login = new LoginInteractions(page);
        cart = new CartInteractions(page);
        topbar = new TopBarInteractions(page);
        await page.goto(process.env.BASE_URL!);
    });

    test("Add to cart", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.assertBadgeCountGreaterThan(0);
        await topbar.clickCart();
        await cart.assertItemInCart(StoreItems.BACKPACK);
    });
    
    test("Remove from cart", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        
        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.clickCart();
        await cart.assertItemInCart(StoreItems.BACKPACK);
        const badgeCount = await topbar.getBadgeCount();
        await cart.removeItem(StoreItems.BACKPACK);
        await cart.assertItemNotInCart(StoreItems.BACKPACK);
        await topbar.assertBadgeCountLessThan(badgeCount);
    });

    // This one fails
    test("Set quantity of item in cart", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const quantity = 3;

        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.clickCart();
        await cart.assertItemInCart(StoreItems.BACKPACK);
        await cart.setQuantityOfItem(StoreItems.BACKPACK, quantity);
        await cart.assertQuantityOfItem(StoreItems.BACKPACK, quantity);
    })
        
});