import { expect, Page } from "playwright/test";
import { CheckoutPage } from "../pages/checkout.page";
import { priceToFloat } from "../../helpers/priceToFloat";

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
    async fillCheckoutForm(values: { firstName: string, lastName: string, postalCode: string }) {
        await this.fillFirstName(values.firstName);
        await this.fillLastName(values.lastName);
        await this.fillPostalCode(values.postalCode);
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

    async assertCheckoutFormIsFilled(values: { firstName: string, lastName: string, postalCode: string }) {
        await expect(this.checkoutPage.firstNameInput).toHaveValue(values.firstName);
        await expect(this.checkoutPage.lastNameInput).toHaveValue(values.lastName);
        await expect(this.checkoutPage.postalCodeInput).toHaveValue(values.postalCode);
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
        return priceToFloat(subtotal);
    }

    /**
     * @returns gets the tax amount as a number
    */
    async getTax(): Promise<number> {
        const tax = await this.checkoutPage.tax.textContent();
        return priceToFloat(tax);
    }

    /**
     * @returns gets the total amount as a number
    */
    async getTotal(): Promise<number> {
        const total = await this.checkoutPage.total.textContent();
        return priceToFloat(total);
    }

    /**
     * Asserts the total amount is correct (subtotal + tax)
     * @param price the price of the item being checked out (used to assert subtotal is correct)
    */
    async assertTotalIsCorrect(price: number) {
        const subtotal = await this.getSubtotal();
        const tax = await this.getTax();
        const total = await this.getTotal();
        expect(total).toBeCloseTo(subtotal + tax, 2);
        expect(price).toBeCloseTo(subtotal, 2);
    }

    /**
     * Asserts the error message is visible
     */
    async assertErrorMessageIsVisible() {
        await expect(this.checkoutPage.errorMessage).toBeVisible();
    }

    /**
     * Asserts the error message is not visible
     */
    async assertErrorMessageIsNotVisible() {
        await expect(this.checkoutPage.errorMessage).not.toBeVisible();
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

    /**
     * @returns gets the failure message text
     */
    async assertSuccessMessageNotVisible() {
        await expect(this.checkoutPage.successMessage).not.toBeVisible();
    }

}
