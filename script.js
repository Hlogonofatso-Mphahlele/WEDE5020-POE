//================================================
//  WEDE5020 POE PART 3 JavaScript Implementation
//================================================




"use strict";

// For the form to wait til the HTML file is loaded before accessing its form elements
document.addEventListener("DOMContentLoaded", function(){

    /*To find the search field and search area*/
  const productSearch = document.querySelector("#product-search");
  const searchMessage = document.querySelector("#search-message");
  const productCards = document.querySelectorAll(".products-card");

  //Finding product sections
  const productCards = document.querySelectorAll(".products-card");
  
  // Setting up to find existing elements only
  if (productSearch && searchMessage && productCards.length > 0){

    productSearch.addEventListener("input", function() {
        //must read the search text and convert it to small letters
        //And remove spaces at the start and end
        // and replace repeated spaces with a single space
        const searchText = productSearch.value.toLowerCase().trim().replace(/\s+/g, " ");

        // TO keep track of how many product seactions match
        let numberOfMatches = 0;

        //Checks each product section individually
        productCards.forEach(function (card){

            /*Reads all the text inside this card as well as the hidden details*/
            const cardText = card.textContent.toLowerCase();

            // Evaluates if the cards conatins the searhed text
            const cardMatches = cardText.includes(searchText);

            // Hides card that dont match and ony shows ones that do
            card.hidden = !cardMatches;

            // TO count every matching product in the product section
            if(cardMatches) {
                numberOfMatches = numberOfMatches + 1;
            }
        });

        // Shows the number of matching sections
        if(searchText === ""){
            searchMessage.textContent = "Showing all " + numberOfMatches + " product categories";
        } else if (numberOfMatches === 0){
            searchMessage.textContent = "No product category matches ur search";
        } else {
            searchMessage.textContent = numberOfMatches + " product categor" + (numberOfMatches === 1 ? "y found." : "ies found");
        }
        
    });


    /*Showing and Hiding Details Features*/

    // used to find all buttons  that control product details.
    const accordionButtons = document.querySelectorAll(".accordion-button");

    // adding click features to buttons
    accordionButtons.forEach(function (button){
        button.addEventListener("click", function(){

            // finds the deatils section controlled by a certain button
            const detailsID = button.getAttribute("aria-controls");
            const details = document.getElementById(detailsID);

            if (!details){
                return;
            }

            //Checks if deatils are currenty hidden
            const areDetailsHidden = details.hidden;

            // tpggles the hidden state of deatils
            details.hidden = !details.hidden;

            //Updates the accessibility attribute
            button.setAttribute("aria-expanded", String(details.hidden));

            // Changes the buttons text to match the current state
            if(details.hidden){
                button.textContent = button.textContent.replace("Hide ", "Show ");
            } else {
                button.textContent = button.textContent("Show ", "Hide");
            }
        });
    });

       /*Feature 3: Product images*/
    
       // findis the dialog, enlarged pictures and close buttons
       const imageLightbox = document.querySelector("#image-lightbox");
       const enlargedImage = document.querySelector("#lightbox-image");
       const closeLightboxButton = document.querySelector("#close-lightbox");

       //finds evry product iimage that must open in the lightbox
       const productImages = document.querySelectorAll(".lightbox-image");

       // Sets up the ightbox if its HTML elements exist
        if(imageLightbox && enlargedImage && closeLightboxButton) {


            //adds a clicking event for every product image clicked
            productImages.forEach(function (productImage){
                productImage.addEventListener("click", function(){

                    //copies the clicked images src and alt text
                    enlargedImage.src = productImage.currentSrc || productImage.src;
                    enlargedImage.alt = productImage.alt;

                    //opens the dialog as a modal wndow
                    imageLightbox.showModal();
                });
            });

            //closes the ligtbox when the close buttom is clicked
            closeLightboxButton.addEventListener("click", function(){
                imageLightbox.close();
            });

            
            //clears the enlarged images after the dialog box closes
            imageLightbox.addEventListener("close", function(){
                enlargedImage.src = "";
            });

        }

        
    /*===========================================================
                    Enquiry Form Validation And AJAX
    =============================================================*/

    //Getting the enquiry forms products and its feedback elements

    const enquiryForm = document.getElementById("enquiry-form");
    const enquiryErrors = document.getElementById("enquiry-errors");
    const enquiryResponse = document.getElementById("enquiry-response");

    
 if (enquiryForm && enquiryErrors && enquiryResponse) {
        //setting todays date as the earliest choosable date
    
        //Getting the requested event date so that past dates cant be entered
        const occassionDate = document.getElementById("occassionDate");

        if(occassionDate) {
        const today = new Date(); 
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
        
        //puts the date in a yyyy mm dd format
        occassionDate.min = year + "/" + month "/" + day; 

    }

    // For showing enquiry errros and dispalying the field that needs to be fixed
    function showEnquiryError(addMessage, field) {
        enquiryErrors.textContent = addMessage;
        enquiryResponse.textContent = "";

        if(field){
            field.focus();
        }
    }

    //Validating the enquiry form for when users submit
    enquiryForm.addEventListener("submit", async function (event){
        //Prevents the form from submitting during AJAX evaluation
        event.preventDefault();

        enquiryErrors.textContent = "";
        enquiryResponse.textContent = "";

        // Getting the enquiry forms element fields
        const fullName = document.getElementById("fullName");
        const phoneNumber = document.getElementById("phoneNumber");
        const email = document.getElementById("email");
        const enquiryType = document.getElementById("enquiryType");
        const products = document.getElementById("products");
        const quantity = document.getElementById("quantity");
        const addMessage = document.getElementById("addMessage");

        //checks the enquiry forms broweser required fields and input types
        if(!enquiryForm.checkValidity()){
            enquiryForm.reportValididty();
            return;
        }
        
        //Checking if users have entered their full names
        if(fullName.value.trim().length < 3){
            showEnquiryError("Please enter your full name.", fullName);
            return;
        }
        // checking if the phone number is in a valid SA format and accpets numbers in RSA's format
        const validNumberFormat = phoneNumber.value.replace(/[()\s-]/g, "");
        const is phoneNumberValid = /^(\+27|0)[6-8][0-9]{8}$/.test(validNumberFormat);

        if (!phoneNumber.isValid.valid){
            showEnquiryError("Please enter a valid cell phone number (must be in a South African cell number format +27 and be followd by 9 numbers) ", phoneNumber);
            return;
        }
        // Chicking if the email address is in a valid format
        if(!email.isValid.valid){
            showEnquiryError("Please enter a valid email address", email);
            return;
        }
        // Checking if users have chosen a enquiry category
        if(enquiryType.value === ""){
            showEnquiryError("Please select any type of enquiry u want", enquiryType); 
            return;
        }
        //Making sure that a product has been chosen
        if(products.value === ""){
            showEnquiryError("Please select a product", products);
            return;
        }

        //ensuring that the quantity of products ordered are between 1 and 100 and are a whole number
        if(!Number.isInteger(quantityValue)
            || quantityValue < 1 || quantityValue > 100) {
            
          showEnquiryError("Please enter the number of products you want (must be between 1 and 100)", quantity);
          return;      
        }

        //To reject a requested date ealier than the current day making an enquiry
        if (occassionDate.value !== "" && occassionDate.value < occassionDate.min){
            showEnquiryError("Dont enter a date ealier than today; either enter today's date or a future date", occassionDate);
            return;
        }

        //Users must enter an understandable additional message thats easy to understand
        if(addMessage.value.trim().length < 10){
            showEnquiryError("Please enter a valid understandable message with more than 10 charecters", addMessage);
            return;
        }

        // Users must enter a delivery address when they choose the delivery option
        if(deliveryMethod.value === "deliver" && deliveryLocation) {
            showEnquiryError("Please enter your delivery address.");
            return;
        }

        //subits valudated form detalis to Netlify using ajax
        const formData = new FormData(enquiryForm);
        const encodedData = new URLSearchParams(formData).toString();

        try {
            const response = await fetch(enquiryForm.action, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/x-www-form-urlcoded"
                };
                body: encodedData
            });

            if(response.ok)}{
                enquiryResponse.textContent= "Thank you. Your enquiry has bess subitted successfully. " + "The bakery will confirm with pricing and availability.";
                enquiryForm.reset();
            } else {
                showEnquiryError("Your enquiry could not be submitted. Please tr again.");
            }
        } catch(error) {
            showEnquiryError("A network error occurred. Please check ur connection n try again");
          }

        // Clears the feedback response when users reset the form
        enquiryForm.addEventListener("reset", function(){
            enquiryErrors.textContent = "";
            enquiryResponse.textContent = "";
        });
        
    });


    //============================================
    // Contact Form JavaScript Validation Form And AJAX
    //===========================================


    //Getting the genearl contact forrmm and its feedback elements
    const contactForm = document.getElementById("contact-form");
    const contactError = document.getElementById("contact-error");
    const contactResponse = document.getElementById("contact-response");

    if(contactForm && contactError && contactResponse){
    // To show contact form erros and highlight relevant fields that must be fixed
    function showContactFormErrors(Message, field){
        contactError.textContent = Message;
        contactResponse.textContent = "";

        if (field){
            field.focus();

        }
    }

    // Validating the general contact form b4 opening the email application
    contactForm.addEventListener("submit", async function (event){
        
        //Prevents the page form exiting during AJAX submission evaluation
        event.preventDefault();

        contactError.textContent = "";
        contactResponse.textContent = "";

        // Getting the contact form fields
        const Name = document.getElementById("Name");
        const cellPhone = document.getElementById("cellPhone");
        const Email = document.getElementById("Email");
        const mesType = document.getElementById("mesType");
        const Message = document.getElementById("Message");


        // Checks the required fields and browser input types
        if(!contactForm.checkValidity()){
            contactForm.reportValididty();
            return;
        }

        //To check if visitors entered their full names
        if (Name.value.trim().length < 3){
            event.preventDefault();
            showContactFormErrors("Please enter ur full name", Name);
            return;
        }

        // Checking if the cellphone number format is valid n accepts numbers in RSA format
        const validNumberFormat = cellPhone.value.replace(/[()\s-]/g, "");
        const isCellNumValid = /^(\+27|0)[6-8][0-9]{8}$/.test(isCellNumValid);

        if (!cellPhone.isValid.valid){
            event.preventDefault();
            showContactFormErrors("Please enter a valid cellphone number ", cellPhone);
            return;
        }
        // To check if the email address is valid
        if (!Email.isValid.valid){
            event.preventDefault();
            showContactFormErrors("Please ente a valid email address", Email);
            return;
        }
        // For users to select one type of enquiry they wanna do
        if (mesType.value === ""){
            event.preventDefault();
            showContactFormErrors("Please select a type of enquiry for ur message", mesType);
            return;
        }
        // for users to enter valid meaningful understandable message
        if  (Message.value.trim().length < 10){
            event.preventDefault();
            showContactFormErrors("Please enter a valid meaningful understanding message with more than 10 charecters", Message);
            return;
        }

        // if the forms details are valid it can now be submitted using AJAX
        const formData = new FormData(contactForm);
        const encodedData = new URLSearchParams(formData).toString();

        try {
            const response = await fetch (contactForm.action, {
                method: "POST",
                headers: {
                    "Contect-Type": "appliaction/x-www-form-urlencoded"
                },
                body: encodedData
            });

            if(response.ok){
                contactResponse.textContent = "Thank you. Your message has been submitted successfully";
                contactForm.reset();
            } else {
                showContactFormErrors("Your message couldn;t be submitted. try again");
            }

        } catch (error) {
            showContactFormErrors ("A network error has occurred. Please check ur connection n try again");
          }
         
    });

    // Clear the contact's forms errors when users reset the form
    contactForm.addEventListener("reset", function(){
        contactError.textContent = "";
        contactResponse.textContent = "";
    });
}


  
  










