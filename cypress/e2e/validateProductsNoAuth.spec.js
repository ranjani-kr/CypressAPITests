/// <reference types="cypress" /> 
describe('Product end point validation without authorisation',()=> {
    it('Authorization header is missing',() =>{
        cy.request({
            method :"GET",
            url :"/api/products/",
            failOnStatusCode: false

        }).then((response)=>{
            expect(response.status).to.eq(400);
        });

    });
});