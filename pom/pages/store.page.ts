import { Locator, Page } from "playwright/test";

class StoreItem {
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly addButton: Locator;
    readonly removeButton: Locator;

    constructor(name: Locator, description: Locator, price: Locator, addToCartButton: Locator, removeFromCartButton: Locator) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.addButton = addToCartButton;
        this.removeButton = removeFromCartButton;
    }
}

export class StorePage {

    readonly item: (name: string) => StoreItem;
    readonly sortSelect: Locator;
    readonly cartLink: Locator;

    constructor(page: Page) {
        this.item = (hasText: string) => {
            const name = page.locator("a div.inventory_item_name", { hasText });
            const container = page.locator("div.inventory_item", { has: name });
            return {
                name,
                description: container.locator("div.inventory_item_desc"),
                price: container.locator("div.inventory_item_price"),
                addButton: container.locator("button[id^='add-to-cart']"),
                removeButton: container.locator("button[id^='remove']")
            };
        };
        this.sortSelect = page.locator("select.product_sort_container");
        this.cartLink = page.locator("a.shopping_cart_link");
    }
}