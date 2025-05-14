const form = document.querySelector("form");
const nameInput = document.querySelector(".name");
const phoneInput = document.querySelector(".phone");
const confirmPhoneInput = document.querySelector(".cPhone");

let listCart = [];
function checkCart(){
        var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
        if(cookieValue){
            listCart = JSON.parse(cookieValue.split('=')[1]);
        }
}
function validateName() {
    const nameField = document.querySelector(".name-field");
    if (nameInput.value.length < 3) {
      nameField.classList.add("invalid");
      nameField.classList.remove("valid");
    } else {
      nameField.classList.remove("invalid");
      nameField.classList.add("valid");
    }
  }
  function validatePhone(input) {
    const phoneField = document.querySelector(".phone-field");
    
    // Remove non-numeric characters
    input.value = input.value.replace(/\D/g, "");
    
    // Limit input to 10 digits
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  
    // Check if the input is exactly 10 digits
    if (input.value.length === 10) {
      phoneField.classList.remove("invalid");
      phoneField.classList.add("valid");
    } else {
      phoneField.classList.add("invalid");
      phoneField.classList.remove("valid");
    }
  }

  function validateConfirmPhone(input) {
    const confirmPhoneField = document.querySelector(".confirm-phone");
    const phoneInput = document.querySelector(".phone").value;
  
    // Remove non-numeric characters
    input.value = input.value.replace(/\D/g, "");
  
    // Limit input to 10 digits
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }
  
    // Check if confirm phone matches original phone
    if (input.value === phoneInput && input.value.length === 10) {
      confirmPhoneField.classList.remove("invalid");
      confirmPhoneField.classList.add("valid");
    } else {
      confirmPhoneField.classList.add("invalid");
      confirmPhoneField.classList.remove("valid");
    }
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    validateName(nameInput);
    validatePhone(phoneInput);
    validateConfirmPhone(confirmPhoneInput);
  
    const nameField = document.querySelector(".name-field");
    const phoneField = document.querySelector(".phone-field");
    const confirmPhoneField = document.querySelector(".confirm-phone");
  
    if (
      nameField.classList.contains("valid") &&
      phoneField.classList.contains("valid") &&
      confirmPhoneField.classList.contains("valid")
    ) {
      const orderData = {
        name: nameInput.value,
        phone: phoneInput.value,
        tableNumber: document.querySelector('.tableNumber').value, 
        items: listCart,
        totalPrice: parseFloat(document.querySelector('.totalPrice').innerText.replace('₹', ''))
      };
  
      try {
        console.log("Sending order data:", orderData); // Log order data being sent
        const response = await fetch('https://self-order-backend-jfv9.onrender.com/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });
  
        const responseData = await response.json();
        console.log("Response data:", responseData); // Log the response data for debugging
  
        if (response.ok) {
          alert("Order Placed Successfully✅");
        } else {
          alert("Failed to place order❌");
        }
      } catch (error) {
        console.error("Error:", error); // Log the error for debugging
        alert("Error: " + error.message);
      }
    }
  });
  
checkCart();
addCartToHTML();
function addCartToHTML() {
    let listCartHTML = document.querySelector('.returnCart .list');
    listCartHTML.innerHTML = '';

    let totalQuantityHTML = document.querySelector('.totalQuantity');
    let totalPriceHTML = document.querySelector('.totalPrice');
    let totalQuantity = 0;
    let totalPrice = 0;

    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = `
                    <img src="https://self-order-backend-jfv9.onrender.com${product.image}" alt="${product.name}">
                    <div class="info">
                        <div class="name">${product.name}</div>
                        <div class="price">₹${product.price}/1 product</div>
                    </div>
                    <div class="quantity">${product.quantity}</div>
                    <div class="returnPrice">₹${product.price * product.quantity}</div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity += product.quantity;
                totalPrice += product.price * product.quantity;
            }
        });
    }
    totalQuantityHTML.innerText = totalQuantity;
    totalPriceHTML.innerText = '₹' + totalPrice;
}