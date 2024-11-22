document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderProducts() {
        fetch("php/products.php")
            .then((res) => res.json())
            .then((products) => {
                const gallery = document.getElementById("product-gallery");
                gallery.innerHTML = "";
                products.forEach((product) => {
                    const card = document.createElement("div");
                    card.className = "product-card";
                    card.innerHTML = `
                        <img src="images/${product.imagen}" alt="${product.producto}">
                        <h3>${product.producto}</h3>
                        <p>${product.descripcion}</p>
                        <p>Precio: $${product.precio}</p>
                        Cuantos:<input class="numero-max-3" type="number" id="cant${product.id}" min="0" value="1">
                        <button class="boton-carrito" data-id="${product.id}" data-price="${product.precio}" data-name="${product.producto}">Añadir al carrito</button>
                        `;
                    gallery.appendChild(card);
                });
                attachAddToCartListeners();
            });
    }

    function attachAddToCartListeners() {
        document.querySelectorAll(".product-card button").forEach((button) => {
            button.addEventListener("click", function () {
                const id = this.dataset.id;
                const name = this.dataset.name;
                const price = parseFloat(this.dataset.price);
                const quantity = parseInt(document.getElementById(`cant${id}`).value) || 1;

                const product = cart.find((item) => item.id === id);
                if (product) {
                    product.quantity += quantity;
                } else {
                    cart.push({ id, name, price, quantity });
                }

                localStorage.setItem("cart", JSON.stringify(cart));
                alert("Producto añadido al carrito");
            });
        });
    }

    function renderCart() {
        const cartItems = document.getElementById("cart-items");
        const cartTotal = document.getElementById("cart-total");

        cartItems.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <h3>${item.name}</h3>
                <p>Cantidad: ${item.quantity}</p>
                <p>Precio total: $${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-btn" data-index="${index}">Eliminar</button>
            `;
            cartItems.appendChild(cartItem);
        });

        cartTotal.textContent = total.toFixed(2);

        attachRemoveListeners();
    }

    function attachRemoveListeners() {
        document.querySelectorAll(".remove-btn").forEach((button) => {
            button.addEventListener("click", function () {
                const index = parseInt(this.dataset.index);
                cart.splice(index, 1);
                localStorage.setItem("cart", JSON.stringify(cart));
                renderCart();
            });
        });
    }

    function handleCheckout() {
        document.getElementById("checkout-btn").addEventListener("click", function () {
            if (cart.length === 0) {
                alert("El carrito está vacío");
                return;
            }

            fetch("php/carrito.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cart),
            })
                .then((res) => res.json())
                .then((response) => {
                    if (response.success) {
                        alert("Compra finalizada con éxito");
                        localStorage.removeItem("cart");
                        location.reload();
                    } else {
                        alert("Hubo un problema al procesar la compra");
                    }
                });
        });
    }

    if (document.getElementById("product-gallery")) {
        renderProducts();
    }

    if (document.getElementById("cart-items")) {
        renderCart();
        handleCheckout();
    }
});
