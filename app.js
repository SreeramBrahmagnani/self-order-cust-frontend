let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

iconCart.addEventListener('click', function(){
    if(cart.style.right == '-100%'){
        cart.style.right = '0';
        container.style.transform = 'translateX(-400px)';
    }else{
        cart.style.right = '-100%';
        container.style.transform = 'translateX(0)';
    }
})
close.addEventListener('click', function (){
    cart.style.right = '-100%';
    container.style.transform = 'translateX(0)';
})


let products = null;

// Fetch data from the backend

fetch('https://self-order-backend-jfv9.onrender.com/api/products')
  .then(response => response.json())
  .then(data => {
    products = data;
    addDataToHTML();
  });

// Show products in the list
function addDataToHTML() {
  let listProductHTML = document.querySelector('.listProduct');
  listProductHTML.innerHTML = '';

  if (products != null) {
    // Filter products to only include enabled items
    const enabledProducts = products.filter(product => product.enabled);

    enabledProducts.forEach(product => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');
      newProduct.innerHTML = `
        <img src="https://self-order-backend-jfv9.onrender.com${product.image}" alt="${product.name}">
        <h2>${product.name}</h2>
        <div class="price">₹${product.price}</div>
        <button onclick="addCart(${product.id})">Add To Cart</button>`;
      listProductHTML.appendChild(newProduct);
    });
  }
}

//use cookie so the cart doesn't get lost on refresh page


let listCart = [];
function checkCart(){
    var cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('listCart='));
    if (cookieValue) {
        listCart = JSON.parse(cookieValue.split('=')[1]);
        console.log("Cart loaded from cookies:", listCart); // Debugging: Log the cart data from cookies
    } else {
        listCart = [];
    }
}
checkCart();
function addCart($idProduct) {
    let productsCopy = JSON.parse(JSON.stringify(products));
    // If this product is not in the cart
    if (!listCart[$idProduct]) {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    } else {
        // If this product is already in the cart, increase the quantity
        listCart[$idProduct].quantity++;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    addCartToHTML();
}
addCartToHTML();

function addCartToHTML() {
    console.log("listCart data:", listCart); // Debugging: Log the cart data
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalAmountHTML = document.querySelector('.totalAmount');
    let totalQuantity = 0;
    let totalAmount = 0;

    if (listCart) {
        listCart.forEach(product => {
            if (product) {
                let newCart = document.createElement('div');
                newCart.classList.add('item');
                newCart.innerHTML = `
                <img src="https://self-order-backend-jfv9.onrender.com${product.image}" alt="${product.name}">
                    <div class="content">
                        <div class="name">${product.name}</div>
                        <div class="price">₹${product.price} / 1 product</div>
                    </div>
                    <div class="quantity">
                        <button onclick="changeQuantity(${product.id}, '-')">-</button>
                        <span class="value">${product.quantity}</span>
                        <button onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity += product.quantity;
                totalAmount += product.price * product.quantity;
            }
        });
    }
    totalHTML.innerText = totalQuantity;
    totalAmountHTML.innerText = `Total Amount: ₹${totalAmount}`;
}

// Add event listener to checkout button
document.querySelector('#checkout-link').addEventListener('click', function(event) {
    // Filter out null values from listCart
    const nonNullCartItems = listCart.filter(item => item !== null);

    if (nonNullCartItems.length === 0) {
        event.preventDefault();
        alert("Cart is empty");
    }
});

function changeQuantity($idProduct, $type){
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            // if quantity <= 0 then remove product in cart
            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;
    }
    // save new data in cookie
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    // reload html view cart
    addCartToHTML();
}

const socket = io("https://self-order-backend-jfv9.onrender.com");
socket.on("menuUpdated", () => {
    // Show custom notification
    const notif = document.getElementById("menu-update-notification");
    notif.style.display = "block";
    // Optionally, add a fade-in effect
    notif.style.opacity = "2";
    // Reload after 2 seconds
    setTimeout(() => {
        window.location.reload();
    }, 3000);
});
