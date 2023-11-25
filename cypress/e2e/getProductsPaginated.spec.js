/// < reference types = "cypress " />
describe("Get product list by pagination",() => {
    it("verify the products by setting the pagination and limit parameter",() =>{
        const uniqueEmail = `abc${Date.now()}@gmail.com`;
        cy.request({
            method : "POST",
            url : "api/auth/signup",
            body:{
                    email :uniqueEmail,
                    password : "abcde12345"

            },
            
        }).then((response) => {
            const accessToken = response.body.data.session.access_token;
            cy.wrap(accessToken).as("accessToken");
        });

        cy.get("@accessToken").then((accessToken) => {
            cy.request({
                method : "GET",
                url :"/api/products/",
                headers:{
                    Authorization : `Bearer ${accessToken}`,
                },
                qs:{
                    page :1,
                    limit : 5,
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.length).to.eq(5);

            });
        });
    });

});