/* =====================================================
   NOOR & BARAKAH RESIN ARTS
   MAIN JAVASCRIPT
   JSON SERVER + AXIOS
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const API_URL = "http://localhost:3000";

/* =====================================================
   NAVIGATION
===================================================== */

function goToProducts() {
    window.location.href = "products.html";
}

function goToLogin() {
    window.location.href = "auth.html";
}

function goToRegister() {
    window.location.href = "auth.html#register";
}

function goToCart() {
    window.location.href = "cart.html";
}


/* =====================================================
   SOCIAL LINKS
===================================================== */

function openWhatsApp() {
    window.open(
        "https://wa.me/918712252055",
        "_blank"
    );
}

function openInstagram() {
    window.open(
        "https://www.instagram.com/noor_and_barakah__/",
        "_blank"
    );
}


/* =====================================================
   AUTH FORM SWITCH
===================================================== */

function showRegister() {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && registerForm) {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}


function showLogin() {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && registerForm) {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
    }
}
async function displayMyOrders() {
    const container = document.getElementById("ordersContainer");

    if (!container) return;

    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        container.innerHTML = `
            <p>Please login to view your orders.</p>
            <button onclick="window.location.href='auth.html'">
                Login
            </button>
        `;
        return;
    }

    try {
        const response = await axios.get(`${API_URL}/orders`);

        const orders = response.data.filter(
            order => String(order.userId) === String(user.id)
        );

        if (orders.length === 0) {
            container.innerHTML = `
                <p>You haven't placed any orders yet.</p>
                <button onclick="goToProducts()">
                    Start Shopping
                </button>
            `;
            return;
        }

        container.innerHTML = orders.map(order => `
            <div class="order-card">

                <h3>Order #${order.id}</h3>

                <p>
                    <strong>Date:</strong> ${order.date}
                </p>

                <p>
                    <strong>Status:</strong> ${order.status}
                </p>

                <div class="order-items">

                    ${order.items.map(item => `
                        <div class="order-item">

                            <img src="${item.image}" alt="${item.name}">

                            <div>
                                <strong>${item.name}</strong>
                                <p>
                                    ₹${item.price} × ${item.quantity}
                                </p>
                            </div>

                        </div>
                    `).join("")}

                </div>

                <h3>Total: ₹${order.total}</h3>

            </div>
        `).join("");

    } catch (error) {
        console.error("Orders Error:", error);

        container.innerHTML = `
            <p>Unable to load your orders.</p>
        `;
    }
}

/* =====================================================
   OPEN REGISTER AUTOMATICALLY
===================================================== */

if (window.location.hash === "#register") {

    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    if (loginForm && registerForm) {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}


/* =====================================================
   REGISTER USER
===================================================== */

async function registerUser() {

    const nameElement = document.getElementById("name");
    const customerIdElement = document.getElementById("customerId");
    const phoneElement = document.getElementById("phone");
    const passwordElement = document.getElementById("password");
    const addressElement = document.getElementById("address");

    if (
        !nameElement ||
        !customerIdElement ||
        !phoneElement ||
        !passwordElement ||
        !addressElement
    ) {
        alert("Registration form not found.");
        return;
    }

    const name = nameElement.value.trim();
    const customerId = customerIdElement.value.trim();
    const phone = phoneElement.value.trim();
    const password = passwordElement.value.trim();
    const address = addressElement.value.trim();


    /* VALIDATION */

    if (!name || !customerId || !phone || !password || !address) {
        alert("Please fill all fields.");
        return;
    }


    try {

        /* CHECK CUSTOMER ID */

        const checkResponse = await axios.get(
            `${API_URL}/users?customerId=${encodeURIComponent(customerId)}`
        );

        if (checkResponse.data.length > 0) {
            alert("Customer ID already exists. Please use another ID.");
            return;
        }


        /* CREATE USER */

        const newUser = {

            name: name,

            customerId: customerId,

            phone: phone,

            password: password,

            address: address

        };


        await axios.post(
            `${API_URL}/users`,
            newUser
        );


        alert("Registration successful!");


        /* CLEAR FORM */

        nameElement.value = "";
        customerIdElement.value = "";
        phoneElement.value = "";
        passwordElement.value = "";
        addressElement.value = "";


        /* SHOW LOGIN */

        showLogin();


        /* PUT CUSTOMER ID INTO LOGIN */

        const loginCustomerId =
            document.getElementById("loginCustomerId");

        if (loginCustomerId) {
            loginCustomerId.value = customerId;
        }


    } catch (error) {

        console.error("Registration Error:", error);

        alert(
            "Registration failed. Make sure JSON Server is running."
        );
    }
}


/* =====================================================
   LOGIN USER
===================================================== */
async function loginUser() {
    alert("Login function started");

    const customerId = document.getElementById("loginCustomerId").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!customerId || !password) {
        alert("Please enter Customer ID and Password");
        return;
    }

    try {
        const response = await axios.get(`${API_URL}/users`);

        const user = response.data.find(function (u) {
            return u.customerId === customerId &&
                   u.password === password;
        });

        if (!user) {
            alert("Invalid Customer ID or Password");
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(user));
        localStorage.setItem("isLoggedIn", "true");

        alert("Login successful!");

        window.location.href = "index.html";

    } catch (error) {
        console.error(error);
        alert("Cannot connect to JSON Server");
    }
}
/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    localStorage.removeItem("isLoggedIn");

    localStorage.removeItem("currentUser");

    alert("Logged out successfully.");

    window.location.href = "index.html";
}


/* =====================================================
   PRODUCT DISPLAY
   LOAD PRODUCTS FROM JSON SERVER
===================================================== */

async function displayProducts() {

    const container =
        document.getElementById("productContainer");


    if (!container) {
        return;
    }


    try {

        /* GET PRODUCTS */

        const response = await axios.get(
            `${API_URL}/products`
        );


        let products = response.data;


        /* SEARCH */

        const searchInput =
            document.getElementById("searchInput");


        const searchText =
            searchInput
                ? searchInput.value.toLowerCase().trim()
                : "";


        /* CATEGORY */

        const filterCategory =
            document.getElementById("filterCategory");


        const category =
            filterCategory
                ? filterCategory.value
                : "all";


        /* SORT */

        const sortPrice =
            document.getElementById("sortPrice");


        const sort =
            sortPrice
                ? sortPrice.value
                : "default";


        /* FILTER */

        let filteredProducts =
            products.filter(function (product) {

                const matchesSearch =
                    String(product.name)
                        .toLowerCase()
                        .includes(searchText);


                const matchesCategory =
                    category === "all" ||
                    product.category === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            });


        /* SORT LOW TO HIGH */

        if (sort === "low") {

            filteredProducts.sort(
                function (a, b) {
                    return a.price - b.price;
                }
            );

        }


        /* SORT HIGH TO LOW */

        if (sort === "high") {

            filteredProducts.sort(
                function (a, b) {
                    return b.price - a.price;
                }
            );

        }


        /* CLEAR CONTAINER */

        container.innerHTML = "";


        /* NO PRODUCTS */

        if (filteredProducts.length === 0) {

            container.innerHTML =
                "<p>No products found.</p>";

            return;
        }


        /* DISPLAY PRODUCTS */

        filteredProducts.forEach(function (product) {

            container.innerHTML += `

                <div class="product-card">

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <div class="product-info">

                        <h3>
                            ${product.name}
                        </h3>

                        <p class="product-price">
                            ₹${product.price}
                        </p>

                        <p class="stock">
                            Stock: ${product.stock}
                        </p>

                        <button
                            class="add-cart-btn"
                            onclick="openProductDetails(${product.id})"
                        >
                            View Details
                        </button>

                    </div>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Error loading products:",
            error
        );


        container.innerHTML =
            "<p>Unable to load products.</p>";
    }
}


/* =====================================================
   PRODUCT DETAILS PAGE
===================================================== */

async function openProductDetails(productId) {

    window.location.href =
        "products-details.html?id=" + productId;
}


async function showProductDetails() {

    const container = document.getElementById("productDetails");

    if (!container) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    console.log("Product ID:", productId);

    if (!productId) {
        container.innerHTML = "<h2>Product not found.</h2>";
        return;
    }

    try {

        const response = await axios.get(
            `${API_URL}/products/${productId}`
        );

        const product = response.data;

        console.log("Product:", product);

        quantity = 1;

        container.innerHTML = `

            <div class="product-details-box">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="product-details-info">

                    <h1>${product.name}</h1>

                    <p class="details-price">
                        ₹${product.price}
                    </p>

                    <p class="details-stock">
                        Available Stock: ${product.stock}
                    </p>

                    <p class="details-description">
                        Beautiful handmade resin product
                        created with care and attention to detail.
                    </p>

                    <div class="quantity-box">

                        <button onclick="decreaseQuantity()">
                            −
                        </button>

                        <span id="quantity">
                            1
                        </span>

                        <button onclick="increaseQuantity()">
                            +
                        </button>

                    </div>

                    <button
                        class="details-cart-btn"
                        onclick="addToCart(${product.id})"
                    >
                        Add to Cart
                    </button>

                </div>

            </div>

        `;

    } catch (error) {

        console.error("Product Details Error:", error);

        container.innerHTML = `
            <h2>Product not found.</h2>
            <p>Unable to load this product.</p>
        `;
    }
}

/* =====================================================
   PRODUCT QUANTITY
===================================================== */

let quantity = 1;


function increaseQuantity() {

    quantity++;


    const quantityElement =
        document.getElementById("quantity");


    if (quantityElement) {

        quantityElement.textContent =
            quantity;
    }
}


function decreaseQuantity() {

    if (quantity > 1) {

        quantity--;
    }


    const quantityElement =
        document.getElementById("quantity");


    if (quantityElement) {

        quantityElement.textContent =
            quantity;
    }
}


/* =====================================================
   ADD TO CART
   GET PRODUCT FROM JSON SERVER
===================================================== */

async function addToCart(productId) {

    try {

        /* GET PRODUCT */

        const response =
            await axios.get(
                `${API_URL}/products/${productId}`
            );


        const product =
            response.data;


        /* GET CART */

        let cart =
            JSON.parse(
                localStorage.getItem("cart")
            ) || [];


        /* CHECK EXISTING PRODUCT */

        const existingItem =
            cart.find(
                item => item.id == product.id
            );


        if (existingItem) {

            const newQuantity =
                existingItem.quantity + quantity;


            /* STOCK CHECK */

            if (newQuantity > product.stock) {

                alert(
                    "You cannot add more than available stock."
                );

                return;
            }


            existingItem.quantity =
                newQuantity;

        }

        else {

            /* STOCK CHECK */

            if (quantity > product.stock) {

                alert(
                    "Not enough stock available."
                );

                return;
            }


            cart.push({

                id: product.id,

                name: product.name,

                price: product.price,

                image: product.image,

                quantity: quantity

            });

        }


        /* SAVE CART */

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        alert(
            product.name +
            " added to cart!"
        );


        /* RESET */

        quantity = 1;


        /* GO CART */

        window.location.href =
            "cart.html";


    } catch (error) {

        console.error(
            "Add to Cart Error:",
            error
        );


        alert(
            "Unable to add product to cart."
        );
    }
}


/* =====================================================
   DISPLAY CART
===================================================== */

function displayCart() {

    const container =
        document.getElementById(
            "cartContainer"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!container || !totalElement) {

        return;
    }


    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    container.innerHTML = "";


    let total = 0;


    /* EMPTY CART */

    if (cart.length === 0) {

        container.innerHTML =
            "<p>Your cart is empty.</p>";

        totalElement.textContent =
            "0";

        return;
    }


    /* DISPLAY CART */

    cart.forEach(function (item) {

        total +=
            Number(item.price) *
            Number(item.quantity);


        container.innerHTML += `

            <div class="cart-item">

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="cart-item-info">

                    <h3>
                        ${item.name}
                    </h3>

                    <p class="cart-item-price">
                        ₹${item.price}
                    </p>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity(${item.id}, -1)"
                        >
                            −
                        </button>

                        <span>
                            ${item.quantity}
                        </span>

                        <button
                            onclick="changeQuantity(${item.id}, 1)"
                        >
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-btn"
                    onclick="removeFromCart(${item.id})"
                >
                    Remove
                </button>

            </div>

        `;

    });


    totalElement.textContent =
        total;
}


/* =====================================================
   CHANGE CART QUANTITY
===================================================== */

function changeQuantity(productId, change) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    const item =
        cart.find(
            item => item.id == productId
        );


    if (!item) {
        return;
    }


    item.quantity += change;


    /* REMOVE WHEN ZERO */

    if (item.quantity <= 0) {

        cart =
            cart.filter(
                item => item.id != productId
            );
    }


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();
}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(productId) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    cart =
        cart.filter(
            item => item.id != productId
        );


    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    displayCart();
}


/* =====================================================
   PLACE ORDER
===================================================== */

async function placeOrder() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];


    /* EMPTY CART */

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }


    /* CHECK LOGIN */

    const currentUser =
        JSON.parse(
            localStorage.getItem(
                "currentUser"
            )
        );


    if (!currentUser) {

        alert(
            "Please login before placing an order."
        );


        window.location.href =
            "auth.html";


        return;
    }


    /* CALCULATE TOTAL */

    const total =
        cart.reduce(
            function (sum, item) {

                return (
                    sum +
                    Number(item.price) *
                    Number(item.quantity)
                );

            },
            0
        );


    /* CREATE ORDER */

    const order = {

        userId:
            currentUser.id,

        customerName:
            currentUser.name,

        customerId:
            currentUser.customerId,

        phone:
            currentUser.phone,

        address:
            currentUser.address,

        items:
            cart,

        total:
            total,

        date:
            new Date().toLocaleString(),

        status:
            "Placed"

    };


    try {

        await axios.post(
            `${API_URL}/orders`,
            order
        );


        alert(
            "Order placed successfully!"
        );


        /* CLEAR CART */

        localStorage.removeItem(
            "cart"
        );


        /* HOME */

        window.location.href =
            "index.html";


    } catch (error) {

        console.error(
            "Order Error:",
            error
        );


        alert(
            "Failed to place order."
        );
    }
}


/* =====================================================
   PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* PRODUCTS PAGE */

        if (
            document.getElementById(
                "productContainer"
            )
        ) {

            displayProducts();
        }


        /* PRODUCT DETAILS PAGE */

        if (
            document.getElementById(
                "productDetails"
            )
        ) {

            showProductDetails();
        }


        /* CART PAGE */

        if (
            document.getElementById(
                "cartContainer"
            )
        ) {

            displayCart();
        }


        /* REGISTER HASH */

        if (
            window.location.hash ===
            "#register"
        ) {

            showRegister();
        }

    }
);
function updateNavbar() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const greeting = document.getElementById("userGreeting");
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const logoutLink = document.getElementById("logoutLink");

    if (user) {

        if (greeting) {
            greeting.textContent =
                `Hi, ${user.name.split(" ")[0]} 👋`;
        }

        if (loginLink) loginLink.style.display = "none";
        if (registerLink) registerLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "inline";

    } else {

        if (greeting) {
            greeting.textContent = "";
        }

        if (loginLink) loginLink.style.display = "inline";
        if (registerLink) registerLink.style.display = "inline";
        if (logoutLink) logoutLink.style.display = "none";
    }
}
async function displayMyOrders() {

    const container =
        document.getElementById("ordersContainer");

    if (!container) return;

    const user =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
        container.innerHTML = `
            <p>Please login to view your orders.</p>
            <button onclick="window.location.href='auth.html'">
                Login
            </button>
        `;
        return;
    }

    container.innerHTML = "<p>Loading orders...</p>";

    try {

        const response =
            await axios.get(`${API_URL}/orders`);

        const orders =
            response.data.filter(order =>
                String(order.userId) === String(user.id)
            );

        if (orders.length === 0) {

            container.innerHTML = `
                <p>You haven't placed any orders yet.</p>

                <button onclick="goToProducts()">
                    Start Shopping
                </button>
            `;

            return;
        }

        container.innerHTML =
            orders.map(order => `

                <div class="order-card">

                    <h3>Order #${order.id}</h3>

                    <p>
                        <strong>Date:</strong>
                        ${order.date}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${order.status}
                    </p>

                    <div class="order-items">

                        ${order.items.map(item => `

                            <div class="order-item">

                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                    width="100"
                                >

                                <div>
                                    <strong>
                                        ${item.name}
                                    </strong>

                                    <p>
                                        ₹${item.price}
                                        × ${item.quantity}
                                    </p>
                                </div>

                            </div>

                        `).join("")}

                    </div>

                    <h3>
                        Total: ₹${order.total}
                    </h3>

                </div>

            `).join("");

    } catch (error) {

        console.error("Orders Error:", error);

        container.innerHTML = `
            <p>Unable to load orders.</p>
        `;
    }
}

function sendCustomOrder() {

    const name = document.getElementById("customName").value;
    const product = document.getElementById("customProduct").value;
    const color = document.getElementById("customColor").value;
    const quantity = document.getElementById("customQuantity").value;
    const details = document.getElementById("customDetails").value;

    if (!name || !product || !quantity) {
        alert("Please fill Name, Product and Quantity.");
        return;
    }

    const message =
        `Hii, I want to place a custom order from Noor & Barakah.%0A%0A` +
        `Name: ${name}%0A` +
        `Product: ${product}%0A` +
        `Color: ${color || "Not specified"}%0A` +
        `Quantity: ${quantity}%0A` +
        `Design Details: ${details || "Not specified"}`;

    const whatsappURL =
        `https://wa.me/918712252055?text=${message}`;

    window.open(whatsappURL, "_blank");
}
function sendCustomOrder() {

    const details = document.getElementById("customDetails").value.trim();

    if (!details) {
        alert("Please tell us about your customized product idea.");
        return;
    }

    const message =
        `Hii, I want a customized product from Noor & Barakah.%0A%0A` +
        `My idea / requirements:%0A${encodeURIComponent(details)}%0A%0A` +
        `I also have a reference image/design to share with you.`;

    const whatsappURL =
        `https://wa.me/918712252055?text=${message}`;

    window.open(whatsappURL, "_blank");
}
document.addEventListener("DOMContentLoaded", function () {

    updateNavbar();

    if (document.getElementById("productContainer")) {
        displayProducts();
    }

    if (document.getElementById("productDetails")) {
        showProductDetails();
    }

    if (document.getElementById("cartContainer")) {
        displayCart();
    }

    if (document.getElementById("ordersContainer")) {
        displayMyOrders();
    }

});
document.addEventListener("DOMContentLoaded", function () {
    updateNavbar();
    displayMyOrders();
});