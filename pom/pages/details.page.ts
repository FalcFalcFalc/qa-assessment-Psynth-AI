import { Locator, Page } from "playwright/test";

export class DetailsPage {
    
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly addButton: Locator;
    readonly removeButton: Locator;

    constructor(page: Page) {
        this.name = page.locator("a div.inventory_item_name");
        const container = page.locator("div.inventory_item_container");
        this.description = container.locator("div.inventory_item_desc");
        this.price = container.locator("div.inventory_item_price");
        this.addButton = container.locator("button[id='add-to-cart']");
        this.removeButton = container.locator("button[id='remove']");
    }
}