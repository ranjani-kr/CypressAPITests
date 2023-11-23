/// <reference types="cypress" /> 
describe('API Testing with Cypress', () => {
    it('Fetches and logs the status code from an API call', () => {
      cy.request('/').then((response) => {
        cy.log(`Status Code: ${response.status}`);
      });
    });
});
