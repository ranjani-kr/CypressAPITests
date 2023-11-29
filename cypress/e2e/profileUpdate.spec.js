///<reference types = "cypress"/>
describe('User profile operations with Patch and Fixtures',() => {
    it('creates and updates user profile using fixtures',() => {
        const uniqueEmail = `abcd${Date.now()}@gmail.com`;

       // Aliasing the profileData fixture
       cy.fixture("profileData.json").as("profileData");

        cy.request({
            method :"POST",
            url : "api/auth/signup",
            body : {
                email : uniqueEmail,
                password : "sdewdf123w12",
            },
        }).then((response) => {
            expect(response.status).to.eq(201);
            const accessToken = response.body.data.session.access_token;
            cy.wrap(accessToken).as("accessToken");
            cy.log("@accessToken");
        });

        Cypress.Promise.all([cy.get("@accessToken"), cy.get("@profileData")]).then(([accessToken, profileData]) => {
            cy.request({
                method: "POST",
                url: "/api/profile",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                                // Replacing the hard coded data with data fetched using the fixtures in cypress
                body: {
                    first_name: profileData.first_name,
                    last_name: profileData.last_name,
                    address: profileData.address,
                    mobile_number: profileData.mobile_number,
                },
            }).then((response) => {
                expect(response.status).to.be.eq(201);
                expect(response.body.first_name).to.be.eq(profileData.first_name);
                expect(response.body.last_name).to.be.eq(profileData.last_name);
                expect(response.body.mobile_number).to.be.eq(profileData.mobile_number);
            });

            cy.request({
                method: "PATCH",
                url: "/api/profile",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: {
                    first_name: "Kane",
                    last_name: "Jennier",
                },
            }).then((response) => {
                expect(response.status).to.be.eq(200);
                expect(response.body.first_name).to.be.eq("Kane"); // First name is updated
                expect(response.body.last_name).to.be.eq("Jennier"); // Last name is updated
                expect(response.body.mobile_number).to.be.eq(profileData.mobile_number); // But mobile number is intact
            });

        });

    });

});