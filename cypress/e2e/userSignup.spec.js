/// <reference types="cypress" /> 
describe('User SignUp Flow', () => {
    it('Successfully register a user and validates multiple data points in API response using aliases', () => {
        //Generating a unique email for register flow
        const uniqueEmail = `abc${Date.now()}@gmail.com`;
      cy.request({
        method:"POST",
      
        url:"/api/auth/signup",
        body:{
            email : uniqueEmail,
            password : "couldIBeMoreFunny",
        },
    }).as('signupRequest');
    cy.get('@signupRequest').then((response) => {
        const responseData = response.body.data;
        cy.log(response.body);
        expect(response.status).to.eq(201);
        expect(response.body).to.have.property("data");
        expect(response.body.data).to.have.keys("user", "session");

        //Deep property assertions
        expect(response.body.data.user.email).to.eq(uniqueEmail);
        expect(response.body.data.session.token_type).to.eq("bearer");
        expect(response.body.data.session.refresh_token).to.not.be.empty;

        //Validates multiple data points in API response using aliases
        expect(responseData.user.id).to.eq(responseData.session.user.id);
        expect(responseData.user.email).to.eq(response.body.data.session.user.email);
        expect(response.body.data.user.role).to.eq("authenticated");
        expect(response.body.data.user.aud).to.eq("authenticated");
        expect(responseData.user.app_metadata.provider).to.eq("email");
        expect(responseData.user.identities[0].provider).to.eq("email");
        expect(responseData.session.expires_in).to.eq(3600);
        expect(responseData.user.identities[0].created_at).to.not.be.empty;
        expect(responseData.user.identities[0].updated_at).to.not.be.empty;
        expect(responseData.user.created_at).to.not.be.empty;;
        expect(responseData.user.updated_at).to.not.be.empty;;
        expect(responseData.user.email).to.eq(uniqueEmail);
      });
    });
});
