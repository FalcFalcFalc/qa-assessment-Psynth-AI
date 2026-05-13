import { expect, Page } from "playwright/test";
import { DetailsPage } from "../pages/details.page";

export class DetailsInteractions {
    readonly page: Page;
    readonly detailsPage: DetailsPage;

    constructor(page: Page) {
        this.page = page;
        this.detailsPage = new DetailsPage(this.page);
    }

    // Actions --------------------------------------------------------------------------------------------

    async getId(name: string): Promise<string | null> {
        const idProperty = await this.detailsPage.name.locator('..').getAttribute("id");
        const id = idProperty?.match(/item_(\d+)/)?.[1] ?? null;
        return id;
    }

    /**
     * Adds an item to the cart
    */
    async addItemToCart() {
        await this.detailsPage.addButton.click();
    }

    /**
     * Removes an item from the cart
     */
    async removeItemFromCart() {
        await this.detailsPage.removeButton.click();
    }

    /**
     * Gets an item's price
    */
    async getItemPrice(): Promise<string> {
        const price = await this.detailsPage.price.textContent();
        if (price === null) {
            throw new Error(`Price not found for item: ${name}`);
        }
        return price.trim();
    }

    /**
     * Gets an item price (number format)
    */
    async getNumericItemPrice(name: string): Promise<number> {
        const price = await this.getItemPrice();
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice)) {
            throw new Error(`Invalid price format for item: ${name}`);
        }
        return numericPrice;
    }

    // Validations ----------------------------------------------------------------------------------------

    /**
     * Assert item details page is displayed
     * @param id 
    */
    async assertItemDetailsIsDisplayed(id: string) {
        const url = this.page.url();
        expect(url).toContain(process.env.BASE_URL! + "inventory-item.html");
        expect(url).toContain(`inventory-item.html?id=${id}`);
    }
}