///<reference types= "cypress"/>
describe('verify the product details', () => {
    it('verify the product details by productId', () => {
        const uniqueEmail = `abc${Date.now()}@gmail.com`;

        // Signup API call to create a new user
        cy.request({
            method: "POST",
            url: "/api/auth/signup",
            body: {
                email: uniqueEmail,
                password: "1234avssdcf",

            },
        }).then((response) => {
            const accessToken = response.body.data.session.access_token;
            cy.wrap(accessToken).as("accessToken");
        });

        // Product API call to get the list of products and alias the first product
        cy.get('@accessToken').then((accessToken) => {
            cy.request({
                method: "GET",
                url: "/api/products/",
                headers :{
                    Authorization : `Bearer ${accessToken}`,
                },

            }).then((response) => {
                expect(response.status).to.equal(200);
                expect(response.body).to.have.length.greaterThan(0)
                //Option1: Either get the first first product and access product.id in the next request GetProductListByID
                const product = response.body[0];
                cy.wrap(product).as("product");
                cy.log("Product before request:", "@product");

                //option2: Or directly stored the productID from the response body and use it it GetProductListByID
                const productId = response.body[0].id;
                
                if (productId !== undefined) {
                    // Set the "Product_ID" collection variable
                    cy.wrap(productId).as("productId");
                    cy.log("ProductId before request:", "@productId");
                }
                
            });
        });
        // Fetch product info using the product ID from the aliased product
        
            Cypress.Promise.all([cy.get("@accessToken"), cy.get("@productId")]).then(([accessToken, productId]) => {
        
                cy.request({
                    method: "GET",
                    url: `/api/products/${productId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    },

                }).then((response) => {
                    expect(response.body.id).to.be.eq(productId);
                });

            });

        });
    });
