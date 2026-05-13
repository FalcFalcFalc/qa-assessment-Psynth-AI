import test from "playwright/test";
import { CheckoutInteractions } from "../pom/interactions/checkout.interactions";
import { DetailsInteractions } from "../pom/interactions/details.interactions";
import { LoginInteractions } from "../pom/interactions/login.interactions";
import { StoreInteractions } from "../pom/interactions/store.interactions";
import { TopBarInteractions } from "../pom/interactions/top_bar.interactions";
import { StoreItems } from "../enums/store";
import { CartInteractions } from "../pom/interactions/cart.interactions";
import { navigateTo } from "../helpers/navigateTo";

test.describe("Checkout Tests", () => {

    let store: StoreInteractions;
    let login: LoginInteractions;
    let topbar: TopBarInteractions;
    let details: DetailsInteractions;
    let checkout: CheckoutInteractions;
    let cart: CartInteractions;

    test.beforeEach(async ({ page }) => {
        await navigateTo(page, process.env.BASE_URL!);
        store = new StoreInteractions(page);
        login = new LoginInteractions(page);
        topbar = new TopBarInteractions(page);
        details = new DetailsInteractions(page);
        checkout = new CheckoutInteractions(page);
        cart = new CartInteractions(page);

    });

    test("Checkout flow", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const item = StoreItems.SHIRT
        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };

        const { price } = await store.addItemToCart(item);
        await topbar.clickCart();
        await cart.assertItemInCart(item);
        await cart.clickCheckout();

        await checkout.fillCheckoutForm(personalInfo);
        await checkout.assertCheckoutFormIsFilled(personalInfo);
        await checkout.clickContinue();

        await checkout.assertTotalIsCorrect(price);
        await checkout.clickFinish();

        await checkout.assertSuccessMessage();
        await checkout.clickBackHome();
    });

    test("Buying ALL items", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        let price = 0;
        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };

        for (const item of Object.values(StoreItems)) {
            const addedItem = await store.addItemToCart(item);
            price += addedItem.price;
        }
        await topbar.clickCart();

        for (const item of Object.values(StoreItems)) {
            await cart.assertItemInCart(item);
        }
        await cart.clickCheckout();

        await checkout.fillCheckoutForm(personalInfo);
        await checkout.assertCheckoutFormIsFilled(personalInfo);
        await checkout.clickContinue();

        await checkout.assertTotalIsCorrect(price);
        await checkout.clickFinish();

        await checkout.assertSuccessMessage();
        await checkout.clickBackHome();
    });

    test("Personal information is filled correctly", async () => {
        test.fail(true, "Items added won't be the ones that were selected. Also, the checkout form should retain the filled information if the user goes back to it, but it doesn't.");
        await login.login(process.env.ERROR_USER, process.env.ERROR_USER_PASSWORD);

        const item = StoreItems.SHIRT
        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };

        const { price } = await store.addItemToCart(item);
        await topbar.clickCart();
        await cart.assertItemInCart(item);
        await cart.clickCheckout();

        await checkout.fillCheckoutForm(personalInfo);
        await checkout.assertCheckoutFormIsFilled(personalInfo);
        await checkout.clickContinue();

        await checkout.assertTotalIsCorrect(price);
        await checkout.clickFinish();

        await checkout.assertSuccessMessage();
        await checkout.clickBackHome();
    });

    test("Checking out with no items", async () => {
        test.fail(true, "It is currently possible to proceed to checkout with no items in the cart.");
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };

        await topbar.clickCart();
        await cart.assertNoItemsInCart();
        await cart.assertCheckoutButtonDisabled();
        await cart.clickCheckout();
        await checkout.fillCheckoutForm(personalInfo);
        await checkout.assertContinueDisabled();
        await checkout.assertTotalIsCorrect(0);
        await checkout.clickContinue();
        await checkout.clickFinish();
        await checkout.assertFailureMessage();
        await checkout.clickBackHome();
    });
});