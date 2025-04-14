Feature: Product Volume Offer Features
  As a customer
  I want to see and interact with volume offers on product pages
  So that I can get discounts when buying multiple items

  Background:
    Given I am logged in to the Shopify store
    And I navigate to the "14k Dangling Pendant Earrings" product page

  Scenario: Volume offer table is displayed below quantity selector
    Then I should see the volume offer table
    And the volume offer table should be positioned below the quantity selector
    And the volume offer table should display multiple tier options
    # And each tier should show a quantity and discounted price

  Scenario: Selecting a tier and clicking "Grab deal now" adds correct quantity to cart
    When I click on tier 4
    And I click the "Grab offer now" button
    Then 8 items should be added to my cart
    And the correct discounted name should appear