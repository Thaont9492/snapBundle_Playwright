Feature: Product Page Testing
  As a shopper
  I want to browse product details
  So that I can make informed purchasing decisions

  Scenario: View first product details
    Given I am on the Shopify store homepage
    When I navigate to the first product page
    Then I should see product details

  Scenario: View second product details
    Given I am on the Shopify store homepage
    When I navigate to the second product page
    Then I should see product details