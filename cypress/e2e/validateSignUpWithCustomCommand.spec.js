///<reference types ="cypress" />

//const { result } = require("cypress/types/lodash")

describe('verifies the user signup process using custom command',() => {
    it('validates the signup process',() => {
        cy.userSignUp('example2@test.com', 'testPassword123').then((result) => {
            expect(result.statusCode).to.eq(201);
            expect(result.accessToken).to.exist;
        });

    });
});
