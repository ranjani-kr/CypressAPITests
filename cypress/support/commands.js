// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// -- This is user signup custom command
Cypress.Commands.add('userSignUp',(email,password) => {
    //Fetch endpoint information from the fixture 
    cy.fixture('resourceEndpoint.json').then((endpoints) =>{
    //Destructure to get method and url for the fixture
    const{method,url} = endpoints.auth.signUp;
   
    const uniqueEmail = `abc${Date.now()}@gmail.com`
        cy.request({
        method : method,
        url : url,
        body:{
            email : uniqueEmail,
            password : password,
              },
        }).then((response) => {
        return{
            statusCode : response.status,
            accessToken: response.body.data.session.access_token,
        };
        });
    });
});