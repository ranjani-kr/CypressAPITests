///<reference types= "cypress"/>
("verify the product details",()=>{
    ("verify the product details by productId",() => {
        const uniqueEmail = `abc${Date.now()}@gmail.com`;

        // Signup API call to create a new user
        cy.request({
            method : "POST",
            url : "/api/auth/signup",
            body:{
                email : uniqueEmail,
                password : "123avssdcf",
                
            },
    }).then((response)=> {
        const accessToken = response.body.data.session.access_token;
        cy.wrap(accessToken).as.apply('accessToken');
    });

    // Product API call to get the list of products and alias the first product
    cy.get('@accessToken').then((accessToken) => {
        cy.request({
            method : "GET",
            url : "/api/products",
            headers:{
                    Authorization : `Bearer $@accessToken`,
            },

        }).then((response)=> {
            expect(response.body).to.not.null;
            cy.wrap(response.body[0]).as("product");
        })
    // Fetch product info using the product ID from the aliased product
    cypress.promise.all([cy.get('@accessToken'),cy.get('@product')]).then(([accessToken,productId])=>{
        cy.request({
            method : "GET",
            url : `/api/products/${product["id"]}`,
            headers:{
                Authorization : `Bearer $@accessToken`,
            },
                    
        }).then((response)=>{
            expect(response.body.id).to.eq(product.id);
        });



    });


    });

    });

});