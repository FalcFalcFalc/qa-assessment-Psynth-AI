import { Locator, Page } from "playwright/test";

class CartItem {
    readonly name: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly removeButton: Locator;
    readonly quantity: Locator;

    constructor(name: Locator, description: Locator, price: Locator, removeButton: Locator, quantity: Locator) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.removeButton = removeButton;
        this.quantity = quantity;
    }
}

export class CartPage {
    readonly item: (name: string) => CartItem;
    readonly checkoutButton: Locator;
    readonly continueShoppingButton: Locator;

    constructor(page: Page) {
        this.item = (hasText: string) => {
            const name = page.locator("a div.inventory_item_name", { hasText });
            const container = page.locator("div.cart_item", { has: name });
            return {
                name,
                description: container.locator("div.inventory_item_desc"),
                price: container.locator("div.inventory_item_price"),
                removeButton: container.locator("button[id^='remove']"),
                quantity: container.locator(".cart_quantity")
            };
        }
        this.checkoutButton = page.locator("#checkout");
        this.continueShoppingButton = page.locator("#continue-shopping");
    }
}