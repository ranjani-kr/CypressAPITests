/// <reference types = "cypress" />
describe('Cart Operations - Creation and Deletion',() => { 
    it('Creates a cart for a user and then deletes it',() => {
        const uniqueEmail = `abc${Date.now()}@gmail.com`;
        // 1. User signup and getting access_token
        cy.request({
            method : "POST",
            url : "/api/auth/signup/",
            body:{
                email : uniqueEmail,
                password : "abc12e12",
            },
        }).then((response) => {
            const accessToken = response.body.data.session.access_token;
            cy.wrap(accessToken).as("accessToken");
        });

        // 2. Cart creation
        cy.get("@accessToken").then((accessToken)=>{
            cy.request({
                method : "POST",
                url : "/api/cart",
                headers :{
                    Authorization : `Bearer ${accessToken}`,
                },
            }).then((response) =>{
                expect(response.status).to.eq(201);

               const cartId = response.body["cart_id"];
               cy.wrap(cartId).as("cartId");
                // const cartId = response.body.cart_id;
                // if (cartId !== undefined) {
                //     // Set the "CART_ID" collection variable
                //     cy.wrap(cartId).as("cartId");
                // }
                console.log(cartId);
            });
        });
        
        //3. delete cart with cartID
        Cypress.Promise.all([cy.get("@accessToken"), cy.get("@cartId")]).then(([accessToken, cartId]) => {
            cy.request({
                method : "DELETE",
                url : `/api/cart/${cartId}`,
                headers: {
                    Authorization : `Bearer ${accessToken}`,
                },
            }).then((response) => {
                expect(response.status).to.eq(204);
            });

            //4.Check for Idempotency with DELETE request
            cy.request({
                method : "DELETE",
                url : `/api/cart/${cartId}`,
                headers: {
                    Authorization : `Bearer ${accessToken}`,
                },
            }).then((response) => {
                expect(response.status).to.eq(204);
            });

            // 5 . Verify the Cart is Deleted
            cy.request({
                method: "GET",
                    url: "/api/cart",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }).then((response) => {
                    // Validating the "No cart found" message in the response indicates that the cart is deleted
                    expect(response.body.message).to.be.eq("No cart found");
                });
            });
        });

    });

