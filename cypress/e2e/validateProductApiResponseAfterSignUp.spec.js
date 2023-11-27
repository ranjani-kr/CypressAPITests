/// <reference types = "cypress" />
describe('throughly validate product api response after authentication',() =>{
    it('check on status,headers,authorization and duration of API call ',() =>{
    const uniqueEmail = `abc${Date.now()}@gmail.com`;
    cy.request({
        method:"POST",
        url: "/api/auth/signup",
        body: { 
            email: uniqueEmail,
            password: "abcde12345",
        },
    }).then((response)=>{
        const accessToken = response.body.data.session.access_token;
        cy.wrap(accessToken).as('accessToken');

    });
    cy.get('@accessToken').then((accessToken)=>{
        cy.request({
            method: "GET",
            url :"/api/products/",
            headers:{
                Authorization : `Bearer ${accessToken}`,
            },
        }).then((response) =>{
            //Ensure the response status and its text.
            expect(response.status).to.eq(200);
            expect(response.statusText).to.be.eq("OK");

            // Validate the content type from response headers
            cy.wrap(response.headers).its("content-type").should("eq", "application/json; charset=utf-8");

            // Ensure the API response time is acceptable
            expect(response.duration).to.be.lessThan(3000);

            // Check the sent authorization token in request headers
            expect(response.requestHeaders["Authorization"]).to.be.eq(`Bearer ${accessToken}`);
        });
    });

    });

});