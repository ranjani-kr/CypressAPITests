/// <reference types="cypress" /> 
describe('User SignUp Flow', () => {
    it('Successfully register a user and validates email,token_type and refresh_token', () => {
        //Generating a unique email for register flow
        const uniqueEmail = `abc${Date.now()}@gmail.com`;
      cy.request({
        method:"POST",
      
        url:"/api/auth/signup",
        body:{
            email : uniqueEmail,
            password : "couldIBeMoreFunny",
        },
    }).then((response) => {
        cy.log(response.body);
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.have.keys("user", "session");

        //Deep property assertions
        expect(response.body.data.user.email).to.eq(uniqueEmail);
        expect(response.body.data.session.token_type).to.eq("bearer");
        expect(response.body.data.session.refresh_token).to.not.be.empty;

      });
    });
});
