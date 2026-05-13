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

    test("Buying an item", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const item = StoreItems.SHIRT
        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };

        // Adding item to cart and going to checkout
        const { price } = await store.addItemToCart(item);
        await topbar.clickCart();
        await cart.assertItemInCart(item);
        await cart.clickCheckout();

        // Filling checkout form and finishing purchase
        await checkout.fillCheckoutForm(personalInfo);
        await checkout.assertCheckoutFormIsFilled(personalInfo);
        await checkout.clickContinue();

        // Asserting total price is correct (not including tax)
        await checkout.assertTotalIsCorrect(price);
        await checkout.clickFinish();

        // Asserting checkout was successful
        await checkout.assertSuccessMessage();
        await checkout.clickBackHome();
    });

    test("Buying ALL items", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        let price = 0;
        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };

        // Adding all items to cart and calculating total price
        for (const item of Object.values(StoreItems)) {
            const addedItem = await store.addItemToCart(item);
            price += addedItem.price;
        }
        await topbar.clickCart();

        // Asserting all items are in the cart
        for (const item of Object.values(StoreItems)) {
            await cart.assertItemInCart(item);
        }
        await cart.clickCheckout();

        await checkout.fillCheckoutForm(personalInfo);
        await checkout.assertCheckoutFormIsFilled(personalInfo);
        await checkout.clickContinue();

        // Asserting total price is correct (not including tax)
        await checkout.assertTotalIsCorrect(price);
        await checkout.clickFinish();

        await checkout.assertSuccessMessage();
        await checkout.clickBackHome();
    });

    test("Personal information is filled correctly", async () => {
        test.fail(true, "Items added won't be the ones that were selected. Also, the checkout form should retain the filled information if the user goes back to it, but it doesn't.");
        await login.login(process.env.ERROR_USER, process.env.ERROR_USER_PASSWORD);

        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };

        await store.addItemToCart(StoreItems.SHIRT);
        await topbar.clickCart();
        await cart.clickCheckout();

        // Asserting that the form retains the filled information after filling the fields
        await checkout.fillCheckoutForm(personalInfo);
        await checkout.assertCheckoutFormIsFilled(personalInfo);
        await checkout.clickContinue();
    });

    test("Checking out with no items", async () => {
        test.fail(true, "It is currently possible to proceed to checkout with no items in the cart.");
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };

        await topbar.clickCart();

        await cart.assertNoItemsInCart();
        await cart.clickCheckout();

        await checkout.fillCheckoutForm(personalInfo);
        await checkout.clickContinue();
        await checkout.clickFinish();

        // The checkout should not be successful
        await checkout.assertSuccessMessageNotVisible();
        await checkout.clickBackHome();
    });

    test("Checking out without filling form", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const personalInfo = { firstName: "John", lastName: "Doe", postalCode: "12345" };
        const item = StoreItems.SHIRT

        await store.addItemToCart(item);
        await topbar.clickCart();
        await cart.assertItemInCart(item);
        await cart.clickCheckout();

        await checkout.clickContinue();
        await checkout.assertErrorMessageIsVisible();

        // Filling the form one field at a time and asserting that the error message is still visible until all fields are filled
        await checkout.fillFirstName(personalInfo.firstName);
        await checkout.clickContinue();
        await checkout.assertErrorMessageIsVisible();

        await checkout.fillLastName(personalInfo.lastName);
        await checkout.clickContinue();
        await checkout.assertErrorMessageIsVisible();

        // After filling it the error message should not be visible anymore
        await checkout.fillPostalCode(personalInfo.postalCode);
        await checkout.clickContinue();
        await checkout.assertErrorMessageIsNotVisible();

    });
});