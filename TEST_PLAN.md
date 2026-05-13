# Test Plan

## Scope

The pages I will be automating will be the following:
- Login page (https://www.saucedemo.com/)
- Store page (https://www.saucedemo.com/inventory.html)
- Item details page (https://www.saucedemo.com/inventory-item.html)
- Cart page (https://www.saucedemo.com/cart.html)
- Checkout pages
    - https://www.saucedemo.com/checkout-step-one.html
    - https://www.saucedemo.com/checkout-step-two.html
    - https://www.saucedemo.com/checkout-complete.html

The user journeys that will be automated will be the following:
- Buying an item
- Buying multiple items
- Buying zero items
- Buying an item without filling personal information

## Test cases

### Happy paths
- Cart Tests
  - Add to cart
  - Remove from cart
- Checkout Tests
  - Buying an item
  - Buying ALL items
- Details Page
  - View Item
  - Add to cart from details page
  - Remove from cart from details page
- Login Tests
  - Login with valid credentials
  - Login with invalid credentials
- Store Tests
  - Cart increased count
  - Cart decreased count
### Edge cases
- Cart Tests
  - Set quantity of item in cart
- Checkout Tests
  - Checking out with no items
  - Checking out without filling form
  - Personal information is filled correctly
- Store Tests
  - Add multiple items to cart
### Cross uses scenarios
- Details Page
  - Item id is the same for different users
- Store Tests
  - Item price is the same for different users
## Out of scope
Performance testing was excluded from this plan as it falls outside my current expertise. I wouldn't feel confortable trying to rush the learning process for it and I want to stay honest about it.
## Risk assessment
The features most likely to present defects are form interactions and button behaviors. From an initial look, I consider the checkout flow to be high-risk, as are the store and cart pages — particularly the functionality surrounding adding and removing items.