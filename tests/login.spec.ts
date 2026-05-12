import { test } from "playwright/test";
import 'dotenv/config';
import { LoginInteractions } from "../pom/interactions/login.interactions";
import process from "process";

test.describe("Login Tests", () => {

    let login: LoginInteractions;

    test.beforeEach(async ({ page }) => {
        login = new LoginInteractions(page);
        await page.goto("https://www.saucedemo.com/");
    });

    test("Login with valid credentials", async ({ page }) => {
        await login.login(process.env.STANDARD_USER, process.env.STANDARD_USER_PASSWORD);
        await login.assertLoggedIn(page);
    });

    test("Login with invalid credentials", async ({ page }) => {
        await login.login(process.env.LOCKED_OUT_USER, process.env.LOCKED_OUT_USER_PASSWORD);
        await login.assertNotLoggedIn(page);
    });
});