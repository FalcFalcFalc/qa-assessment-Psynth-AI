import test from "playwright/test";
import { CheckoutInteractions } from "../pom/interactions/checkout.interactions";
import { DetailsInteractions } from "../pom/interactions/details.interactions";
import { LoginInteractions } from "../pom/interactions/login.interactions";
import { StoreInteractions } from "../pom/interactions/store.interactions";
import { TopBarInteractions } from "../pom/interactions/top_bar.interactions";
import { StoreItems } from "../enums/store";
import { CartInteractions } from "../pom/interactions/cart.interactions";

test.describe("Checkout Tests", () => {

    let store: StoreInteractions;
    let login: LoginInteractions;
    let topbar: TopBarInteractions;
    let details: DetailsInteractions;
    let checkout: CheckoutInteractions;
    let cart: CartInteractions;

    test.beforeEach(async ({ page }) => {
        await page.goto(process.env.BASE_URL!);
        store = new StoreInteractions(page);
        login = new LoginInteractions(page);
        topbar = new TopBarInteractions(page);
        details = new DetailsInteractions(page);
        checkout = new CheckoutInteractions(page);
        cart = new CartInteractions(page);

        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
    });

    test("Checkout flow", async () => {

        const item = StoreItems.SHIRT

        const { price } = await store.addItemToCart(item);
        await topbar.clickCart();
        await cart.assertItemInCart(item);
        await cart.clickCheckout();
        await checkout.fillCheckoutForm("John", "Doe", "12345");
        await checkout.clickContinue();
        await checkout.assertTotalIsCorrect();
        await checkout.clickFinish();
        await checkout.assertSuccessMessage();
        await checkout.clickBackHome();
    });


});