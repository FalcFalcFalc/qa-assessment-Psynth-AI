export function priceToFloat(price: string | null): number {
    if (price === null) {
        throw new Error("Price is null");
    }
    const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
    if (isNaN(numericPrice)) {
        throw new Error(`Invalid price format. Got ${price}, then parsed to ${numericPrice}.`);
    }
    return numericPrice;
}