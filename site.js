/*
===========
JavaScript
===========
*/

// SERVICES
// Array of services
const services = [
    {
      name: "Your Cat Vacay",
      description: "A cozy stay for your cat with a trusted sitter 🏡✨",
      price: 200,
      unit: "SEK/day",
      image: "photos/Cat Villager Lolly Vacay.webp" // Photo of the service
    },
    {
      name: "Daily Check-Ins",
      description: "Two quick visits to feed, play, and cuddle your cat 🐾",
      price: 150,
      unit: "SEK/day",
      image: "photos/Cat villagers home.jpg" // Photo of the service
    },
    {
      name: "Premium Cat Spa",
      description: "Pamper your cat with grooming and relaxation 🛁✨",
      price: 300,
      unit: "SEK/session",
      image: "photos/Cat villagers spa.webp" // Photo of the service
    }
  ];
  
  const serviceContainer = document.querySelector(".row");
  
  // Populate the services dynamically
  services.forEach(service => {
    const serviceHTML = `
      <div class="col-md-4 mb-4">
        <div class="card service-card shadow">
          <div class="card-body">
            <h4 class="card-title">${service.name}</h4>
            <p class="card-text">${service.description}</p>
            <p class="service-price">Price: <strong>${service.price} ${service.unit}</strong></p>
            <input type="number" min="1" value="1" class="form-control quantity-input mb-3" 
                   data-service="${service.name}" data-price="${service.price}">
            <button class="btn add-to-cart-btn" data-service="${service.name}" data-price="${service.price}">
              Add to Cart
            </button>
            <button class="btn btn-danger remove-from-cart-btn mt-2" data-service="${service.name}" 
                    data-price="${service.price}" style="display:none;">
              Remove from Cart
            </button>
            <img src="${service.image}" alt="${service.name}" class="service-image mt-3">
          </div>
        </div>
      </div>
    `;
  
    serviceContainer.insertAdjacentHTML("beforeend", serviceHTML);
});
  

// CART
let cart = [];
let totalPrice = 0;
// Add to Cart
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        const serviceCard = button.closest('.service-card');
        const serviceName = serviceCard.querySelector('.card-title').innerText;
        const servicePrice = parseFloat(button.dataset.price);
        const quantityInput = serviceCard.querySelector('.quantity-input');
        const quantity = parseInt(quantityInput.value) || 1;

        if (quantity > 0) {
            // Check if the item already exists in the cart
            const existingItem = cart.find(item => item.name === serviceName);

            if (existingItem) {
                // Update quantity and total for the existing item
                existingItem.quantity += quantity;
                existingItem.total += servicePrice * quantity;
            } else {
                // Add new item to the cart
                cart.push({
                    name: serviceName,
                    price: servicePrice,
                    quantity: quantity,
                    total: servicePrice * quantity
                });
            }

            // Update the total price
            totalPrice += servicePrice * quantity;

            // Add a custom class to highlight the service card (only for the clicked card)
            serviceCard.classList.add('added-to-cart');

            updateCartUI();
        } else {
            alert('Please enter a valid quantity.');
        }
    });
});

// Reset background color of all service cards after checkout
function resetCartUI() {
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.classList.remove('added-to-cart');
    });
}

// Checkout functionality
document.getElementById('checkout-btn').addEventListener('click', function() {
    if (cart.length > 0) {
        fakePaymentProcess();
    } else {
        alert('Your cart is empty. Please add some services first.');
    }
});

// Fake Payment Process
function fakePaymentProcess() {
    const paymentMessage = document.getElementById('payment-message');

    paymentMessage.textContent = 'Processing payment...';

    setTimeout(() => {
        // Simulate a successful payment after 2 seconds
        paymentMessage.textContent = `Payment completed PURRRfectly! Thank you for choosing us to care for your cat! 🐾`;

        // Clear cart after successful payment
        cart = [];
        totalPrice = 0;

        // Update cart and total display
        updateCartUI();

        // Reset background color of all service cards after checkout
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.classList.remove('added-to-cart');
        });
    }, 2000);
}

function updateCartUI() {
    const cartList = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    // Clear the current cart display
    cartList.innerHTML = '';

    // Populate the cart with updated items
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            ${item.quantity} x ${item.name} <span>${item.total} SEK</span>
            <button class="btn btn-danger btn-sm remove-btn" data-index="${index}">Remove</button>
        `;
        cartList.appendChild(listItem);
    });

    // Update the total price display
    totalPriceElement.textContent = `Total: ${totalPrice} SEK`;

    // Remove buttons 
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', () => {
            const index = button.getAttribute('data-index');
            removeOneFromCart(index);
        });
    });

    updateServiceCardHighlights();
}

function updateServiceCardHighlights() {
    const serviceCards = document.querySelectorAll('.service-card');

    // Loop through each service card and check if it's in the cart
    serviceCards.forEach(card => {
        const serviceName = card.querySelector('.card-title').innerText;
        const itemInCart = cart.find(item => item.name === serviceName);

        // If item exists in cart and quantity is > than 0, highlight the card
        if (itemInCart && itemInCart.quantity > 0) {
            card.classList.add('added-to-cart');
        } else {
            card.classList.remove('added-to-cart');
        }
    });
}

// Function to remove one unit of an item from the cart
function removeOneFromCart(index) {
    const itemToRemove = cart[index];
    const serviceName = itemToRemove.name;
    const servicePrice = itemToRemove.price;

    // If quantity is > than 1, decrease quantity and update total
    if (itemToRemove.quantity > 1) {
        itemToRemove.quantity -= 1;
        itemToRemove.total -= servicePrice;
    } else {
        // If quantity is 1, remove the item completely
        cart.splice(index, 1);
    }

    totalPrice -= servicePrice;

    updateCartUI();
}

// DONATION PROCESS (similar to Swish)
document.querySelector(".btn-donate-modal").addEventListener("click", function() {
    var donationAmount = document.getElementById("donationAmount").value;
    if (donationAmount >= 10) {
        
        document.getElementById("payment-message").innerHTML = `Thank you for your donation of ${donationAmount} SEK! Your support is greatly appreciated. 🙏`;

        setTimeout(function() {
            var modal = bootstrap.Modal.getInstance(document.getElementById("donationModal"));
            modal.hide();
        }, 2000);
    } else {
        alert("Please enter a valid donation amount (minimum 10 SEK).");
    }
});