///<reference types = "cypress"/
describe('Cart Operations - Add and Update Cart Item',()=>{
    it('Adds an item to the cart and updates it',() => {
        const uniqueEmail = `abce${Date.now()}@gmail.com`;
        // 1. sign up as a user
        cy.request({
            method : "POST",
            url : "/api/auth/signup",
            body:{
                email: uniqueEmail,
                password : "addsfde12",
            },
        }).then ((response) => {
           // expect(response.body.status).to.eq(200);
            const accessToken = response.body.data.session.access_token;
            cy.wrap(accessToken).as("accessToken");
        });

        // 2. List Products
        cy.get(("@accessToken")).then((accessToken) => {
            cy.request({
                method : "GET",
                url : "/api/products/",
                headers: {
                    Authorization : `Bearer ${accessToken}`,
                },
            }).then((response) => {
                //expect(response.body.status).to.eq(200);
                cy.wrap(response.body).as("products");
            });
        });

        // 3 . Create Cart
        cy.get("@accessToken").then((accessToken) => {
            cy.request({
                method : "POST",
                url :"/api/cart",
                headers:{
                    Authorization : `Bearer ${accessToken}`,
                },
            }).then((response) => {
                //expect(response.body.status).to.eq(200);
                console.log(response);
                console.log(response.body);
                const cartId = response.body["cart_id"];
                cy.wrap(cartId).as("cartId");
               
                
            });
        });

        // 4. Add items to the cart and update it 
        Cypress.Promise.all([cy.get("@accessToken"), cy.get("@products"), cy.get("@cartId")]).then(
            ([accessToken, products, cartId]) => {
                // Create cart item
                cy.request({
                    method: "POST",
                    url: `/api/cart/${cartId}/items`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: {
                        product_id: products[0].id, 
                        quantity: 10,
                    },
                }).then((response) => {

                expect(response.status).to.eq(201);
                expect(response.body.quantity).to.be.eq(10);
                const cartItemId = response.body.cart_item_id;
                if (cartItemId !== undefined) {
                    // Set the "CART_ID" collection variable
                    cy.wrap(cartItemId).as("cartItemId");
                }

                //5. update the cart quantity and verify

                cy.request({
                    method : "PUT",
                   url : `/api/cart/${cartId}/items/${cartItemId}`,
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body:{
                        product_id: products[1].id, // Here initially we are going to create the cart item with first product in the array
                        quantity: 14,
                    },
                }).then((response) => { 
                    expect(response.status).to.eq(200);
                    expect(response.body.product_id).to.be.eq(products[1].id);
                    expect(response.body.quantity).to.be.eq(14);

                });


            });
        });

    });
});