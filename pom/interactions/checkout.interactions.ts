import { expect, Page } from "playwright/test";
import { CheckoutPage } from "../pages/checkout.page";

export class CheckoutInteractions {
    readonly checkoutPage: CheckoutPage;
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.checkoutPage = new CheckoutPage(page);
    }

    // Step one ------------------------------------------------------------------------------------

    /**
     * Fills the first name input
     * @param firstName 
    */
    async fillFirstName(firstName: string) {
        await this.checkoutPage.firstNameInput.fill(firstName);
    }

    /**
     * Fills the last name input
     * @param lastName 
     */
    async fillLastName(lastName: string) {
        await this.checkoutPage.lastNameInput.fill(lastName);
    }

    /**
     * Fills the postal code input
     * @param postalCode 
    */
    async fillPostalCode(postalCode: string) {
        await this.checkoutPage.postalCodeInput.fill(postalCode);
    }

    /**
     * Fills all checkout fields
     * @param firstName 
     * @param lastName 
     * @param postalCode 
    */
    async fillCheckoutForm(firstName: string, lastName: string, postalCode: string) {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillPostalCode(postalCode);
    }

    /**
     * Clicks the continue button
    */
    async clickContinue() {
        await this.checkoutPage.continueButton.click();
    }

    /**
     * Clicks the cancel button
     */
    async clickCancel() {
        await this.checkoutPage.cancelButton.click();
    }

    // Step Two ------------------------------------------------------------------------------------

    /**
     * Clicks the finish button
     */
    async clickFinish() {
        await this.checkoutPage.finishButton.click();
    }

    /**
     * @returns gets the subtotal amount as a number
     */
    async getSubtotal(): Promise<number> {
        const subtotal = await this.checkoutPage.subtotal.textContent();
        if (subtotal === null) {
            throw new Error("Subtotal not found");
        }
        return parseFloat(subtotal.replace('$', ''));
    }

    /**
     * @returns gets the tax amount as a number
     */
    async getTax(): Promise<number> {
        const tax = await this.checkoutPage.tax.textContent();
        if (tax === null) {
            throw new Error("Tax not found");
        }
        return parseFloat(tax.replace('$', ''));
    }

    /**
     * @returns gets the total amount as a number
     */
    async getTotal(): Promise<number> {
        const total = await this.checkoutPage.total.textContent();
        if (total === null) {
            throw new Error("Total not found");
        }
        return parseFloat(total.replace('$', ''));
    }

    /**
     * Asserts the total amount is correct (subtotal + tax)
     */
    async assertTotalIsCorrect() {
        const subtotal = await this.getSubtotal();
        const tax = await this.getTax();
        const total = await this.getTotal();
        expect(total).toBeCloseTo(subtotal + tax, 2);
    }

    // Step Three ------------------------------------------------------------------------------------

    /**
     * Clicks the Back Home button
     */
    async clickBackHome() {
        await this.checkoutPage.backHomeButton.click();
        const url = this.page.url();
        expect(url).toContain(process.env.BASE_URL! + "inventory.html");
    }

    /**
     * @returns gets the success message text
     */
    async assertSuccessMessage() {
        await expect(this.checkoutPage.successMessage).toBeVisible();
        await expect(this.checkoutPage.successMessage).toHaveText("Thank you for your order!");
    }

}
