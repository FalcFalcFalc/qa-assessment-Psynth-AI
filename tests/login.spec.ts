import { test } from "playwright/test";
import 'dotenv/config';
import { LoginInteractions } from "../pom/interactions/login.interactions";
import process from "process";
import { navigateTo } from "../helpers/navigateTo";

test.describe("Login Tests", () => {

    let login: LoginInteractions;

    test.beforeEach(async ({ page }) => {
        login = new LoginInteractions(page);
        await navigateTo(page, process.env.BASE_URL!);
    });

    test("Login with valid credentials", async () => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        await login.assertLoggedIn();
    });

    test("Login with invalid credentials", async () => {
        await login.login(process.env.LOCKED_OUT_USER, process.env.LOCKED_OUT_USER_PASSWORD);
        await login.assertNotLoggedIn();
    });
});