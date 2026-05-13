import { expect, Page } from "playwright/test";
import { StorePage } from "../pages/store.page";
import { StoreSortOptions } from "../../enums/store";
import { priceToFloat } from "../../helpers/priceToFloat";

export class StoreInteractions {
    readonly page: Page;
    readonly storePage: StorePage;

    constructor(page: Page) {
        this.page = page;
        this.storePage = new StorePage(this.page);
    }

    // Actions --------------------------------------------------------------------------------------------

    async getId(name: string): Promise<string | null> {
        const nameElement = this.storePage.item(name).name;
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
        await this.storePage.item(name).name.click();
        return id;
    }

    /**
     * Adds an item to the cart
     * @param name 
     * @return the id and price of the added item
    */
    async addItemToCart(name: string) {
        const id = await this.getId(name);
        const price = await this.getNumericItemPrice(name);
        await this.storePage.item(name).addButton.click();
        return { id, price };
    }

    /**
     * Removes an item from the cart
     * @param name 
    */
    async removeItemFromCart(name: string) {
        const id = await this.getId(name);
        await this.storePage.item(name).removeButton.click();
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
}