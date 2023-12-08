/// <reference types = "cypress"/>
describe("Update user profile ",() =>{
    it ('Using Fixtures to pass parameters in the profile request',() => {

        const uniqueEmail = `abc${Date.now()}@gmail.com`
        cy.fixture("profileData.json").as("profileData");
        cy.request({
            method : "POST",
            url : "/api/auth/signup",
            
            body:{
                email : uniqueEmail,
                password : "asdwerwe12",
            },
        }).then((response)=> {
            expect(response.status).to.eq(201);
            const accessToken = response.body.data.session.access_token;
            cy.wrap(accessToken).as("accessToken");

        });

    

        Cypress.Promise.all([cy.get("@accessToken"),cy.get("@profileData")]).then(([accessToken,profileData]) => {
            cy.request({
                method : "POST",
                url : "/api/profile",
                headers: {
                    Authorization : `Bearer ${accessToken}`,
                },
                body: {
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    address: profileData.address,
                    mobile_number: profileData.mobile_number,
                },
               
            }).then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.first_name).to.be.eq(profileData.first_name);
            });

            cy.request({
                method : "PATCH",
                url : "/api/profile",
                headers:{
                    Authorization :`Bearer ${accessToken}`,
                },
                body:{
                    first_name : "Phebe",
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.first_name).to.be.eq("Phebe");
                expect(response.body.last_name).to.be.eq(profileData.last_name);
            });
        
        });

    });

});

