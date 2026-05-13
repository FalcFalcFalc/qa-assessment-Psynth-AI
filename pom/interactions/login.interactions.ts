import { expect, Page } from "playwright/test";
import { LoginPage } from "../pages/login.page";

export class LoginInteractions {
    readonly page: Page;
    readonly loginPage: LoginPage;
    constructor(page: Page) {
        this.page = page;
        this.loginPage = new LoginPage(this.page);
    }

    // Actions --------------------------------------------------------------------------------------------

    /**
     * Fills the username
     * @param username 
    */
    async fillUsername(username: string) {
        await this.loginPage.usernameInput.fill(username);
    }

    /**
     * Fills the password
     * @param username 
     */
    async fillPassword(password: string) {
        await this.loginPage.passwordInput.fill(password);
    }

    /**
     * Presses the login button
     * @param username 
     */
    async pressLogin() {
        await this.loginPage.loginButton.click();
    }

    /**
     * Logins with the provided credentials
     * @param username 
     */
    async login(username: string | undefined, password: string | undefined) {
        await this.fillUsername(username!);
        await this.fillPassword(password!);
        await this.pressLogin();
    }

    // Validations ----------------------------------------------------------------------------------------

    /**
     * Asserts that the user is logged in
     */
    async assertLoggedIn() {
        const url = this.page.url();
        expect(url).toBe(process.env.BASE_URL! + "inventory.html");
        expect(url).not.toBe(process.env.BASE_URL!);
    }

    /**
     * Asserts that the user is not logged in
     */
    async assertNotLoggedIn() {
        const currentURL = this.page.url();
        expect(currentURL).toBe(process.env.BASE_URL!);
        expect(currentURL).not.toBe(process.env.BASE_URL! + "inventory.html");
    }
}