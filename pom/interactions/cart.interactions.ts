import { expect, Page } from "playwright/test";
import { CartPage } from "../pages/cart.page";
import { priceToFloat } from "../../helpers/priceToFloat";

export class CartInteractions {
    readonly page: Page;
    readonly cartPage: CartPage;

    constructor(page: Page) {
        this.page = page;
        this.cartPage = new CartPage(this.page);
    }

    // Actions --------------------------------------------------------------------------------------------

    /**
     * Gets an item's id in the cart
     * @param name 
    */
    async getId(name: string): Promise<string | null> {
        const nameElement = this.cartPage.item(name).name;
        const idProperty = await nameElement.locator('..').getAttribute("id");
        const id = idProperty?.match(/item_(\d+)/)?.[1] ?? null;
        return id;
    }

    /**
     * Clicks an item's link
     * @param name 
     * @returns item's id
    */
    async clickItemLink(name: string) {
        const id = await this.getId(name);
        await this.cartPage.item(name).name.click();
        return id;
    }

    /**
     * Removes an item from the cart
     * @param name 
    */
    async removeItem(name: string) {
        const id = await this.getId(name);
        await this.cartPage.item(name).removeButton.click();
        return id;
    }

    /**
     * Sets the quantity of an item in the cart
     * @param name 
     * @param quantity 
    */
    async setQuantityOfItem(name: string, quantity: number) {
        await this.cartPage.item(name).quantity.fill(quantity.toString());
    }

    /**
     * Gets the quantity of an item in the cart
     * @param name 
    */
    async getQuantityOfItem(name: string): Promise<number> {
        return parseInt(await this.cartPage.item(name).quantity.inputValue());
    }

    /**
     * Gets an item's price
     * @param name 
    */
    async getItemPrice(name: string): Promise<string> {
        const price = await this.cartPage.item(name).price.textContent();
        if (price === null) {
            throw new Error(`Price not found for item: ${name}.`);
        }
        return price.trim();
    }

    /**
     * Gets an item price (number format)
     * @param name 
    */
    async getNumericItemPrice(name: string): Promise<number> {
        const price = await this.getItemPrice(name);
        return priceToFloat(price);
    }

    /**
     * Clicks the checkout button
     */
    async clickCheckout() {
        await this.cartPage.checkoutButton.click();
    }


    // Validations ----------------------------------------------------------------------------------------

    /**
     * Assert cart is displayed
     * @param id 
    */
    async assertCartIsDisplayed() {
        const url = this.page.url();
        expect(url).toBe(process.env.BASE_URL! + "cart.html");
    }

    /**
     * Assert item in cart
     * @param name 
     */
    async assertItemInCart(name: string) {
        const item = this.cartPage.item(name);
        await expect(item.name).toBeVisible();
        await expect(item.description).toBeVisible();
        await expect(item.price).toBeVisible();
        await expect(item.removeButton).toBeVisible();
    }

    /**
     * Assert item not in cart
     * @param name 
     */
    async assertItemNotInCart(name: string) {
        const item = this.cartPage.item(name);
        await expect(item.name).not.toBeVisible();
    }

    /**
     * Assert item price
     * @param name 
     * @param expectedPrice
     */
    async assertItemPrice(name: string, expectedPrice: string) {
        const price = await this.getItemPrice(name);
        expect(price).toBe(expectedPrice);
    }

    /**
     * Assert item price
     * @param name 
     * @param expectedPrice
     */
    async assertQuantityOfItem(name: string, expectedQuantity: number) {
        const quantity = await this.getQuantityOfItem(name);
        expect(quantity).toBe(expectedQuantity);
    }
}