//// <reference types="cypress" />

describe('Retrieve Specific Product Details', () => {
    it("Get a product's details using its ID as a path parameter", () => {
        const uniqueEmail = `test${Date.now()}@gmail.com`;

        // Signup API call to create a new user
        cy.request({
            method: "POST",
            url: "/api/auth/signup",
            body: {
                email: uniqueEmail,
                password: "12345678",
            },
        }).then((response) => {
            const accessToken = response.body.data["session"]["access_token"];
            cy.wrap(accessToken).as("accessToken"); // Alias the access token for later use
        });

        // Product API call to get the list of products and alias the first product
        cy.get("@accessToken").then((accessToken) => {
            cy.request({
                method: "GET",
                url: "/api/products/",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                cy.wrap(response.body[0]).as("product"); // Alias the first product for later use
            });
        });

        // Fetch product info using the product ID from the aliased product
        Cypress.Promise.all([cy.get("@accessToken"), cy.get("@product")]).then(([accessToken, product]) => {
            cy.request({
                method: "GET",
                url: `/api/products/${product["id"]}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => {
                // Validating the product id
                expect(response.body.id).to.be.eq(product.id);
            });
        });
    });
});