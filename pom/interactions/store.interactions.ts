import { expect, Page } from "playwright/test";
import { StorePage } from "../pages/store.page";
import { StoreItems, StoreSortOptions } from "../../enums/store";
import { priceToFloat } from "../../helpers/priceToFloat";

export class StoreInteractions {
    readonly page: Page;
    readonly storePage: StorePage;

    constructor(page: Page) {
        this.page = page;
        this.storePage = new StorePage(this.page);
    }

    // Actions --------------------------------------------------------------------------------------------

    /**
     * gets an item's id
     * @param name 
     * @returns id of the item
     */
    async getId(name: string): Promise<string | null> {
        const nameElement = this.storePage.item(name).name;
        const idProperty = await nameElement.locator('..').getAttribute("id");
        // The id is in the format "item_4_(...)", so we need to extract the number from it
        const id = idProperty?.match(/item_(\d+)/)?.[1] ?? null;
        return id;
    }

    /**
     * Clicks an item's link
     * @param name 
     * @returns item's id and price
    */
    async clickItemLink(name: string) {
        const id = await this.getId(name);
        const price = await this.getNumericItemPrice(name);
        await this.storePage.item(name).name.click();
        // returing it this way we have more versatility
        return { id, price };
    }

    /**
     * Adds an item to the cart
     * @param name 
     * @return the id and price of the added item
    */
    async addItemToCart(name: string) {
        const id = await this.getId(name);
        const price = await this.getNumericItemPrice(name);
        const button = this.storePage.item(name).addButton;

        // Asserting that the button is visible before clicking it to enable test.fail()
        await expect(button).toBeVisible();
        await button.click();
        return { id, price };
    }

    /**
     * Removes an item from the cart
     * @param name 
    */
    async removeItemFromCart(name: string) {
        const id = await this.getId(name);
        const button = this.storePage.item(name).removeButton;
        await expect(button).toBeVisible();
        await button.click();
        return id;
    }

    /**
     * Gets an item's price
     * @param name 
    */
    async getItemPrice(name: string): Promise<string> {
        const price = await this.storePage.item(name).price.textContent();
        if (price === null) {
            throw new Error(`Price not found for item: ${name}`);
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
     * Sorts the store items
     * @param option 
    */
    async sortBy(option: StoreSortOptions) {
        await this.storePage.sortSelect.selectOption(option);
    }

    /**
     * Assert item price is displayed correctly
     * @param price 
     */
    async assertItemPrice(name: string, price: number) {
        const displayedPrice = await this.getNumericItemPrice(name);
        expect(displayedPrice).toBeCloseTo(price, 2);
    }
}