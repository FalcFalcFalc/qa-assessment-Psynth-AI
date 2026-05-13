import { Locator, Page } from "playwright/test";

export class CheckoutPage {

    // Step one
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly cancelButton: Locator;

    // Step two
    readonly finishButton: Locator;
    readonly subtotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;

    // Step three
    readonly successMessage: Locator;
    readonly backHomeButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.firstNameInput = page.locator("#first-name");
        this.lastNameInput = page.locator("#last-name");
        this.postalCodeInput = page.locator("#postal-code");
        this.continueButton = page.locator("#continue");
        this.cancelButton = page.locator("#cancel");
        this.finishButton = page.locator("#finish");
        this.subtotal = page.locator(".summary_subtotal_label");
        this.tax = page.locator(".summary_tax_label");
        this.total = page.locator(".summary_total_label");
        this.successMessage = page.locator("h2.complete-header");
        this.backHomeButton = page.locator("#back-to-products");
        this.errorMessage = page.locator("div.error h3");
    }
}