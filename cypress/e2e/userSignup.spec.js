/// <reference types="cypress" /> 
describe('User SignUp Flow', () => {
    it('Successfully register a user', () => {
      cy.request({
        method:"POST",
        url:"/api/auth/signup",
        body:{
            email : "chandler.fri@gmail.com",
            password : "couldIBeMoreFunny",

        },
    }).then((response) => {
        cy.log(response.body);
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.have.keys("user", "session");
      });
    });
});
