/// <reference types = "cypress" />
describe('Cart Operations - Creation and Deletion',() => { 
    it('Creates a cart for a user and then deletes it',() => {
        const uniqueEmail = `abc${Date.now()}@gmail.com`;
        // User signup and getting access_token
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

        // Cart creation
        cy.get("@accessToken").then((accessToken)=>{
            cy.request({
                method : "GET",
                url : "/api/cart",
                headers :{
                    Authorization : `Bearer ${accessToken}`,
                },
            }).then((response) =>{
                expect(response.status).to.eq(200);
                const cartId = response.body.cart_id;
                cy.wrap(cartId).as("cartId");
            });
        });
        
        //delete cart with cartID
        Cypress.Promise.all([cy.get("@accessToken"),cy.get("@cartId")]).then(([accesstoken,cartId])=> {
            cy.request({
                method : "DELETE",
                url : '/api/cart/${cartId}',
                headers: {
                    Authorization : `Bearer ${accessToken}`,
                },
            }).then((response) => {
                expect(response.status).to.eq(204);
            });

        });

    });

});

