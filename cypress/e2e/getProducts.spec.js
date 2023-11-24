/// <reference types="cypress" />
describe('Retrieve Product List',() => {
    it('Get products after successful signup',() =>{
        const uniqueEmail = `abcd${Date.now()}@gmail.com`;

        cy.request({
            method :"POST",
            url :"/api/auth/signup",
            body : {
                email: uniqueEmail,
                password: "password123",
            },

        }).then((response) => {
            const accessToken = response.body.data["session"]["access_token"];
            cy.request({
                method : "GET",
                url: "/api/products/",
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                },
            }).then((response) => { 
                expect(response.status).to.eq(200);
                expect(response.body[0]).to.have.all.keys("created_at","name","description","name","quantity","id","category_id");
            });
        });

    });
});
