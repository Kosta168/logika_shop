document.addEventListener("DOMContentLoaded", () => {
    const CART_KEY = "cart";

    // ---- Модель/збереження ----
    let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

    const saveCart = () => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    };

    const cartCounterEl = document.getElementById("cart-count");

    const updateCartCount = () => {
        if (cartCounterEl) {
            const totalQuantity = cart.reduce(
                (sum, item) => sum + (item.qty || 1),
                0
            );

            cartCounterEl.textContent = totalQuantity;
        }
    };

    updateCartCount();


    // ---- Додавання товарів ----
    const buyButtons = document.querySelectorAll(".buy-btn");

    if (buyButtons.length) {

        buyButtons.forEach(button => {

            button.addEventListener("click", () => {

                const card = button.closest(".phone-card");

                if (!card) return;

                const name =
                    card.querySelector(".phone-name")?.textContent?.trim()
                    || "Товар";

                const priceText =
                    card.querySelector(".phone-price")?.textContent?.trim()
                    || "0 грн";

                const img =
                    card.querySelector("img")?.getAttribute("src")
                    || "";

                const price =
                    parseInt(priceText.replace(/\D/g, "")) || 0;


                // ---- Перевіряємо, чи товар уже є в кошику ----
                const existIdx = cart.findIndex(
                    item => item.name === name && item.price === price
                );


                // Якщо товар уже є — збільшуємо кількість
                if (existIdx !== -1) {

                    cart[existIdx].qty =
                        (cart[existIdx].qty || 1) + 1;

                } else {

                    // Якщо товару немає — додаємо його
                    cart.push({
                        name: name,
                        price: price,
                        priceText: priceText,
                        img: img,
                        qty: 1
                    });
                }


                // Зберігаємо кошик
                saveCart();

                // Оновлюємо кількість біля кошика
                updateCartCount();
            });

        });
    }


    // ---- Відмалювання кошика ----
    const cartItemsContainer =
        document.getElementById("cart-items");

    const cartTotalEl =
        document.getElementById("cart-total");

    const checkoutBtn =
        document.getElementById("checkout-btn");


    // ---- Форматування ціни ----
    const formatUAH = n =>
        n.toLocaleString("uk-UA") + " грн";


    // ---- Функція відображення кошика ----
    function renderCart() {

        if (!cartItemsContainer || !cartTotalEl) return;


        // Очищаємо старий вміст
        cartItemsContainer.innerHTML = "";


        // Якщо кошик порожній
        if (!cart.length) {

            cartItemsContainer.innerHTML =
                "<p>Ваш кошик порожній 🛒</p>";

            cartTotalEl.textContent =
                "Загальна сума: 0 грн";

            return;
        }


        // Загальна сума
        let total = 0;


        // Перебираємо товари
        cart.forEach((item, index) => {

            const qty = item.qty || 1;


            // Рахуємо загальну суму
            total += (item.price || 0) * qty;


            // Створюємо блок товару
            const row =
                document.createElement("div");


            row.className = "cart-item";

            row.style.display = "flex";
            row.style.alignItems = "center";
            row.style.justifyContent = "space-between";
            row.style.gap = "10px";
            row.style.marginBottom = "12px";


            // Створюємо HTML товару
            row.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px; text-align:left;">

                    ${item.img ? `
                        <img
                            src="${item.img}"
                            alt=""
                            style="width:56px;height:56px;border-radius:10px;object-fit:cover;"
                        >
                    ` : ""}

                    <div>
                        <div>
                            <strong>${item.name}</strong>
                        </div>

                        <div>
                            ${item.priceText || formatUAH(item.price || 0)}
                        </div>
                    </div>

                </div>


                <div style="display:flex; align-items:center; gap:8px;">

                    <button
                        class="btn qty-dec"
                        data-index="${index}"
                    >
                        −
                    </button>


                    <span>${qty}</span>


                    <button
                        class="btn qty-inc"
                        data-index="${index}"
                    >
                        +
                    </button>


                    <button
                        class="btn remove-btn"
                        data-index="${index}"
                    >
                        Видалити
                    </button>

                </div>
            `;


            // Додаємо товар у кошик на сторінці
            cartItemsContainer.appendChild(row);

        });


        // Показуємо загальну суму
        cartTotalEl.textContent =
            "Загальна сума: " + formatUAH(total);


        // ---- Кнопка "Видалити" ----
        cartItemsContainer
            .querySelectorAll(".remove-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    const i =
                        +btn.dataset.index;


                    // Видаляємо товар
                    cart.splice(i, 1);


                    // Зберігаємо
                    saveCart();


                    // Оновлюємо лічильник
                    updateCartCount();


                    // Оновлюємо кошик
                    renderCart();

                });

            });


        // ---- Кнопка "+" ----
        cartItemsContainer
            .querySelectorAll(".qty-inc")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    const i =
                        +btn.dataset.index;


                    // Збільшуємо кількість
                    cart[i].qty =
                        (cart[i].qty || 1) + 1;


                    // Зберігаємо
                    saveCart();


                    // Оновлюємо лічильник
                    updateCartCount();


                    // Оновлюємо кошик
                    renderCart();

                });

            });


        // ---- Кнопка "−" ----
        cartItemsContainer
            .querySelectorAll(".qty-dec")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    const i =
                        +btn.dataset.index;


                    // Зменшуємо кількість
                    cart[i].qty =
                        Math.max(
                            1,
                            (cart[i].qty || 1) - 1
                        );


                    // Зберігаємо
                    saveCart();


                    // Оновлюємо лічильник
                    updateCartCount();


                    // Оновлюємо кошик
                    renderCart();

                });

            });

    }


    // ---- Запускаємо відображення кошика ----
    renderCart();


    // ---- Модальне вікно оформлення замовлення ----
    if (checkoutBtn) {

        const modal =
            document.getElementById("checkout-modal");

        const closeModal =
            document.getElementById("close-modal");

        const orderForm =
            document.getElementById("order-form");


        // ---- Відкриття модального вікна ----
        checkoutBtn.addEventListener("click", () => {

            if (!cart.length) {

                alert("Ваш кошик порожній!");

                return;
            }


            modal.style.display = "flex";

        });


        // ---- Закриття модального вікна ----
        closeModal.addEventListener("click", () => {

            modal.style.display = "none";

        });


        // ---- Закриття при натисканні на фон ----
        window.addEventListener("click", (e) => {

            if (e.target === modal) {

                modal.style.display = "none";

            }

        });


        // ---- Відправлення форми ----
        orderForm.addEventListener("submit", (e) => {

            e.preventDefault();


            // Отримуємо дані
            const firstName =
                document
                    .getElementById("firstName")
                    .value
                    .trim();


            const lastName =
                document
                    .getElementById("lastName")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            const delivery =
                document
                    .getElementById("delivery")
                    .value;


            // Перевіряємо поля
            if (
                !firstName ||
                !lastName ||
                !address ||
                !delivery
            ) {

                alert(
                    "Будь ласка, заповніть усі поля!"
                );

                return;
            }


            // Повідомлення про замовлення
            alert(
                `Дякуємо за замовлення, ${firstName} ${lastName}!

Адреса: ${address}

Доставка: ${
    delivery === "nova"
        ? "Нова пошта"
        : "Укрпошта"
}`
            );


            // ---- Очищаємо кошик ----
            cart = [];


            // Зберігаємо порожній кошик
            saveCart();


            // Оновлюємо лічильник
            updateCartCount();


            // Оновлюємо кошик
            renderCart();


            // Закриваємо модальне вікно
            modal.style.display = "none";


            // Очищаємо форму
            orderForm.reset();

        });

    }

});