/// <reference types="cypress" />
describe('Get product lists',() =>{
    it('Retrieve data after successful login using alias ',()=> {
        const uniqueEMAIL = `abcd${Date.now()}@gmail.com`;
        cy.request({
            method:"POST",
            url :"/api/auth/signup",
            body:{
                email:uniqueEMAIL,
                password:"abcd12345",
            },
        }).as('signupRequest');
        cy.get('@signupRequest').then((response) => {
            const accessToken = response.body.data.session.access_token;
            cy.request({
                method:"GET",
                url:"/api/products/",
                headers:{
                    Authorization: `Bearer ${accessToken}`,
                },
                
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    

    });
});