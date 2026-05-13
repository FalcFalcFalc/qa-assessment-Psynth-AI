import { expect, Page } from "playwright/test";
import { DetailsPage } from "../pages/details.page";
import { priceToFloat } from "../../helpers/priceToFloat";

export class DetailsInteractions {
    readonly page: Page;
    readonly detailsPage: DetailsPage;

    constructor(page: Page) {
        this.page = page;
        this.detailsPage = new DetailsPage(this.page);
    }

    // Actions --------------------------------------------------------------------------------------------

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
            throw new Error(`Price not found for item`);
        }
        return price.trim();
    }

    /**
     * Gets an item price (number format)
    */
    async getNumericItemPrice(): Promise<number> {
        const price = await this.getItemPrice();
        return priceToFloat(price);
    }

    // Validations ----------------------------------------------------------------------------------------

    /**
     * Assert item details page is displayed
     * @param id 
    */
    async assertItemDetailsIsDisplayed(id: string | null) {
        if (!id) {
            throw new Error("ID is required to assert item details page");
        }
        const url = this.page.url();
        expect(url).toContain(process.env.BASE_URL! + "inventory-item.html");
        expect(url).toContain(`inventory-item.html?id=${id}`);
    }
}