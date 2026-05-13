import { test } from "playwright/test";
import { StoreItems } from "../enums/store";
import { LoginInteractions } from "../pom/interactions/login.interactions";
import { StoreInteractions } from "../pom/interactions/store.interactions";
import { TopBarInteractions } from "../pom/interactions/top_bar.interactions";
import { DetailsInteractions } from "../pom/interactions/details.interactions";
import { navigateTo } from "../helpers/navigateTo";

test.describe("Details Page", () => {

    let store: StoreInteractions;
    let login: LoginInteractions;
    let topbar: TopBarInteractions;
    let details: DetailsInteractions;

    test.beforeEach(async ({ page }) => {
        await navigateTo(page, process.env.BASE_URL!);

        login = new LoginInteractions(page);
        store = new StoreInteractions(page);
        topbar = new TopBarInteractions(page);
        details = new DetailsInteractions(page);
    });


    test("View Item", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const id = await store.clickItemLink(StoreItems.BACKPACK);
        await details.assertItemDetailsIsDisplayed(id!)
    });

    test("Add to cart from details page", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const id = await store.clickItemLink(StoreItems.BACKPACK);
        await details.assertItemDetailsIsDisplayed(id!);
        const count = await topbar.getBadgeCount();
        await details.addItemToCart();
        await topbar.assertBadgeCountGreaterThan(count);
    });

    test("Remove from cart from details page", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const id = await store.clickItemLink(StoreItems.BACKPACK);
        await details.assertItemDetailsIsDisplayed(id!);
        await details.addItemToCart();
        const count = await topbar.getBadgeCount();
        await details.removeItemFromCart();
        await topbar.assertBadgeCountLessThan(count);
    });

    test("Item is the same for different users", async () => {
        test.fail(true, "The item links are not consistent between users. The problem user has different links than the standard user, but they should be the same.");
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);

        const id = await store.clickItemLink(StoreItems.BACKPACK);
        await topbar.clickHamburgerMenu();
        await topbar.clickLogout();

        await login.login(process.env.PROBLEM_USER, process.env.PROBLEM_USER_PASSWORD);
        
        await store.clickItemLink(StoreItems.BACKPACK);
        await details.assertItemDetailsIsDisplayed(id);
    });
});