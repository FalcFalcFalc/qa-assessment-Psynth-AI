import { expect, test } from "playwright/test";
import 'dotenv/config';
import { LoginInteractions } from "../pom/interactions/login.interactions";
import process from "process";
import { StoreInteractions } from "../pom/interactions/store.interactions";
import { StoreItems } from "../enums/store";
import { CartInteractions } from "../pom/interactions/cart.interactions";
import { TopBarInteractions } from "../pom/interactions/top_bar.interactions";
import { navigateTo } from "../helpers/navigateTo";

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
        await navigateTo(page, process.env.BASE_URL!);
    });

    test("Add to cart", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        // Adding an item and asserting that it is in the cart
        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.clickCart();
        await cart.assertItemInCart(StoreItems.BACKPACK);
    });

    test("Remove from cart", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        // Adding an item and then going to the cart page
        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.clickCart();

        // Removing the item and asserting that it is no longer in the cart
        await cart.removeItem(StoreItems.BACKPACK);
        await cart.assertItemNotInCart(StoreItems.BACKPACK);
    });

    test("Set quantity of item in cart", async () => {
        test.fail(true, "The targeted box should be an input where you can set the quantity, but it's not. It's just a div with value 1.");
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const quantity = 3;

        // Adding an item and then going to the cart page
        await store.addItemToCart(StoreItems.BACKPACK);
        await topbar.clickCart();

        // Setting the quantity of the item in the cart and asserting that the quantity has been updated
        await cart.setQuantityOfItem(StoreItems.BACKPACK, quantity);
        await cart.assertQuantityOfItem(StoreItems.BACKPACK, quantity);
    });
});