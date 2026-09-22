// =========================================================
// НАСТРОЙКИ — поменяйте под себя
// =========================================================
const BOT_USERNAME = "your_bot_username"; // имя бота без @, используется для запасной ссылки заказа
const CURRENCY = "$";                     // символ валюты, отображаемой в интерфейсе

// =========================================================
// ДАННЫЕ О ТОВАРАХ
// Замените этот массив своими товарами. У каждого товара:
// id, category, name, desc, price, image, specs (массив пар [название, значение])
// =========================================================
const PRODUCTS = [
  {
    id: 1,
    category: "Электроника",
    name: "Беспроводные наушники X1",
    desc: "Компактные TWS-наушники с шумоподавлением и чехлом для зарядки.",
    price: 24,
    image: "https://placehold.co/600x450/2481cc/ffffff?text=Наушники+X1",
    specs: [["Время работы", "6 часов + 24 ч (кейс)"], ["Bluetooth", "5.3"], ["Шумоподавление", "Есть"], ["Цвет", "Чёрный"]]
  },
  {
    id: 2,
    category: "Электроника",
    name: "Умные часы Fit Pro",
    desc: "Фитнес-трекер с пульсометром, уведомлениями и защитой от воды.",
    price: 32,
    image: "https://placehold.co/600x450/2481cc/ffffff?text=Fit+Pro",
    specs: [["Экран", "1.8\" AMOLED"], ["Батарея", "до 10 дней"], ["Защита", "IP68"], ["Совместимость", "iOS / Android"]]
  },
  {
    id: 3,
    category: "Дом и быт",
    name: "Увлажнитель воздуха Mist",
    desc: "Ультразвуковой увлажнитель на 3.5 л с подсветкой и таймером.",
    price: 27,
    image: "https://placehold.co/600x450/34a853/ffffff?text=Mist",
    specs: [["Объём бака", "3.5 л"], ["Уровень шума", "< 30 дБ"], ["Автоотключение", "Да"], ["Питание", "220В"]]
  },
  {
    id: 4,
    category: "Дом и быт",
    name: "Органайзер для кухни",
    desc: "Набор из 4 контейнеров для сыпучих продуктов с герметичными крышками.",
    price: 15,
    image: "https://placehold.co/600x450/34a853/ffffff?text=Органайзер",
    specs: [["Материал", "Пластик BPA-free"], ["В комплекте", "4 контейнера"], ["Объём", "0.5-1.2 л"]]
  },
  {
    id: 5,
    category: "Красота",
    name: "LED-маска для лица",
    desc: "Косметологическая маска с 7 режимами светотерапии.",
    price: 45,
    image: "https://placehold.co/600x450/e05780/ffffff?text=LED+Маска",
    specs: [["Режимов", "7"], ["Зарядка", "USB-C"], ["Время сеанса", "10-20 мин"]]
  },
  {
    id: 6,
    category: "Красота",
    name: "Массажёр для лица Ice Roller",
    desc: "Ледяной роллер для утреннего ухода и снятия отёков.",
    price: 9,
    image: "https://placehold.co/600x450/e05780/ffffff?text=Ice+Roller",
    specs: [["Материал", "Медицинский силикон + металл"], ["Уход", "Хранить в холодильнике"]]
  },
  {
    id: 7,
    category: "Аксессуары",
    name: "Чехол-бумажник для телефона",
    desc: "Кожаный чехол с отделениями для карт, подходит под большинство моделей.",
    price: 12,
    image: "https://placehold.co/600x450/8e44ad/ffffff?text=Чехол",
    specs: [["Материал", "Эко-кожа"], ["Карт-холдер", "до 3 карт"], ["Цвета", "Чёрный, коричневый"]]
  },
  {
    id: 8,
    category: "Аксессуары",
    name: "Рюкзак Urban 20L",
    desc: "Городской рюкзак с отделением для ноутбука 15\" и USB-портом.",
    price: 29,
    image: "https://placehold.co/600x450/8e44ad/ffffff?text=Рюкзак",
    specs: [["Объём", "20 л"], ["Ноутбук", "до 15\""], ["Материал", "Влагостойкий полиэстер"]]
  }
];

// =========================================================
// ИНИЦИАЛИЗАЦИЯ TELEGRAM WEB APP
// =========================================================
const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;

function applyTelegramTheme() {
  if (!tg) return;
  const p = tg.themeParams || {};
  const root = document.documentElement.style;
  const map = {
    bg_color: "--tg-theme-bg-color",
    secondary_bg_color: "--tg-theme-secondary-bg-color",
    text_color: "--tg-theme-text-color",
    hint_color: "--tg-theme-hint-color",
    link_color: "--tg-theme-link-color",
    button_color: "--tg-theme-button-color",
    button_text_color: "--tg-theme-button-text-color"
  };
  Object.keys(map).forEach((key) => {
    if (p[key]) root.setProperty(map[key], p[key]);
  });
  try {
    tg.setHeaderColor("secondary_bg_color");
    tg.setBackgroundColor(p.bg_color || "#ffffff");
  } catch (e) { /* методы недоступны в старых клиентах — ок */ }
}

if (tg) {
  tg.ready();
  tg.expand();
  applyTelegramTheme();
  tg.onEvent("themeChanged", applyTelegramTheme);
}

// =========================================================
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// =========================================================
let activeCategory = "Все";
let searchQuery = "";
let cart = {};          // { productId: qty }
let modalQty = 1;
let currentProductId = null;
let checkoutSource = null; // 'cart' | 'buyNow'

// =========================================================
// ЭЛЕМЕНТЫ DOM
// =========================================================
const el = {
  categories: document.getElementById("categories"),
  grid: document.getElementById("productGrid"),
  emptyState: document.getElementById("emptyState"),
  searchInput: document.getElementById("searchInput"),

  cartBar: document.getElementById("cartBar"),
  cartCount: document.getElementById("cartCount"),
  cartTotal: document.getElementById("cartTotal"),

  productModal: document.getElementById("productModal"),
  pmImage: document.getElementById("pmImage"),
  pmCategory: document.getElementById("pmCategory"),
  pmName: document.getElementById("pmName"),
  pmDesc: document.getElementById("pmDesc"),
  pmSpecs: document.getElementById("pmSpecs"),
  pmPrice: document.getElementById("pmPrice"),
  pmQty: document.getElementById("pmQty"),
  pmQtyMinus: document.getElementById("pmQtyMinus"),
  pmQtyPlus: document.getElementById("pmQtyPlus"),
  pmAddCart: document.getElementById("pmAddCart"),
  pmBuyNow: document.getElementById("pmBuyNow"),

  cartModal: document.getElementById("cartModal"),
  cartItems: document.getElementById("cartItems"),
  cartSummaryTotal: document.getElementById("cartSummaryTotal"),
  cartCheckoutBtn: document.getElementById("cartCheckoutBtn"),

  checkoutModal: document.getElementById("checkoutModal"),
  coName: document.getElementById("coName"),
  coPhone: document.getElementById("coPhone"),
  coComment: document.getElementById("coComment"),
  coSubmitBtn: document.getElementById("coSubmitBtn"),

  toast: document.getElementById("toast")
};

// =========================================================
// РЕНДЕР: КАТЕГОРИИ
// =========================================================
function renderCategories() {
  const categories = ["Все", ...new Set(PRODUCTS.map((p) => p.category))];
  el.categories.innerHTML = "";
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "chip" + (cat === activeCategory ? " active" : "");
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      activeCategory = cat;
      renderCategories();
      renderProducts();
    });
    el.categories.appendChild(btn);
  });
}

// =========================================================
// РЕНДЕР: СЕТКА ТОВАРОВ
// =========================================================
function getFilteredProducts() {
  return PRODUCTS.filter((p) => {
    const matchesCategory = activeCategory === "Все" || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
}

function renderProducts() {
  const list = getFilteredProducts();
  el.grid.innerHTML = "";
  el.emptyState.hidden = list.length > 0;

  list.forEach((p) => {
    const card = document.createElement("button");
    card.className = "card";
    card.innerHTML = `
      <img class="card__image" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="card__body">
        <p class="card__name">${p.name}</p>
        <p class="card__desc">${p.desc}</p>
        <p class="card__price">${p.price} ${CURRENCY}</p>
      </div>
    `;
    card.addEventListener("click", () => openProductModal(p.id));
    el.grid.appendChild(card);
  });
}

// =========================================================
// МОДАЛКА ТОВАРА
// =========================================================
function openProductModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  currentProductId = id;
  modalQty = 1;

  el.pmImage.src = p.image;
  el.pmImage.alt = p.name;
  el.pmCategory.textContent = p.category;
  el.pmName.textContent = p.name;
  el.pmDesc.textContent = p.desc;
  el.pmPrice.textContent = `${p.price} ${CURRENCY}`;
  el.pmQty.textContent = modalQty;

  el.pmSpecs.innerHTML = p.specs
    .map(([label, value]) => `<li><span>${label}</span><span>${value}</span></li>`)
    .join("");

  showModal(el.productModal);
}

el.pmQtyMinus.addEventListener("click", () => {
  modalQty = Math.max(1, modalQty - 1);
  el.pmQty.textContent = modalQty;
});
el.pmQtyPlus.addEventListener("click", () => {
  modalQty = Math.min(99, modalQty + 1);
  el.pmQty.textContent = modalQty;
});

el.pmAddCart.addEventListener("click", () => {
  addToCart(currentProductId, modalQty);
  hideModal(el.productModal);
  showToast("Добавлено в корзину");
});

el.pmBuyNow.addEventListener("click", () => {
  checkoutSource = "buyNow";
  hideModal(el.productModal);
  showModal(el.checkoutModal);
});

// =========================================================
// КОРЗИНА
// =========================================================
function addToCart(id, qty) {
  cart[id] = (cart[id] || 0) + qty;
  updateCartBar();
}

function removeFromCart(id) {
  delete cart[id];
  updateCartBar();
  renderCartItems();
}

function getCartEntries() {
  return Object.entries(cart).map(([id, qty]) => ({
    product: PRODUCTS.find((p) => p.id === Number(id)),
    qty
  }));
}

function getCartTotal() {
  return getCartEntries().reduce((sum, e) => sum + e.product.price * e.qty, 0);
}

function updateCartBar() {
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  el.cartBar.hidden = count === 0;
  el.cartCount.textContent = count;
  el.cartTotal.textContent = `${getCartTotal()} ${CURRENCY}`;
}

function renderCartItems() {
  const entries = getCartEntries();
  el.cartItems.innerHTML = "";
  entries.forEach(({ product, qty }) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <img class="cart-item__image" src="${product.image}" alt="${product.name}">
      <div class="cart-item__info">
        <p class="cart-item__name">${product.name}</p>
        <p class="cart-item__price">${qty} × ${product.price} ${CURRENCY}</p>
      </div>
      <button class="cart-item__remove" data-id="${product.id}">Удалить</button>
    `;
    row.querySelector(".cart-item__remove").addEventListener("click", () => removeFromCart(product.id));
    el.cartItems.appendChild(row);
  });
  el.cartSummaryTotal.textContent = `${getCartTotal()} ${CURRENCY}`;
}

el.cartBar.addEventListener("click", () => {
  renderCartItems();
  showModal(el.cartModal);
});

el.cartCheckoutBtn.addEventListener("click", () => {
  if (Object.keys(cart).length === 0) return;
  checkoutSource = "cart";
  hideModal(el.cartModal);
  showModal(el.checkoutModal);
});

// =========================================================
// ОФОРМЛЕНИЕ ЗАКАЗА
// =========================================================
if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
  el.coName.value = tg.initDataUnsafe.user.first_name || "";
}

el.coSubmitBtn.addEventListener("click", () => {
  const name = el.coName.value.trim();
  const phone = el.coPhone.value.trim();
  const comment = el.coComment.value.trim();

  if (!name || !phone) {
    showToast("Укажите имя и телефон");
    return;
  }

  const items = checkoutSource === "buyNow"
    ? [{ product: PRODUCTS.find((p) => p.id === currentProductId), qty: modalQty }]
    : getCartEntries();

  const total = items.reduce((sum, e) => sum + e.product.price * e.qty, 0);

  const orderPayload = {
    type: "order",
    customer: { name, phone, comment },
    items: items.map((e) => ({ id: e.product.id, name: e.product.name, qty: e.qty, price: e.product.price })),
    total
  };

  sendOrder(orderPayload);
});

function buildOrderText(payload) {
  const lines = payload.items.map((i) => `• ${i.name} — ${i.qty} × ${i.price} ${CURRENCY}`);
  return [
    "Новый заказ:",
    ...lines,
    `Итого: ${payload.total} ${CURRENCY}`,
    `Имя: ${payload.customer.name}`,
    `Телефон: ${payload.customer.phone}`,
    payload.customer.comment ? `Комментарий: ${payload.customer.comment}` : null
  ].filter(Boolean).join("\n");
}

function sendOrder(payload) {
  const text = buildOrderText(payload);

  if (tg && typeof tg.sendData === "function") {
    // Отправляем структурированные данные боту (сработает,
    // если мини-приложение открыто через кнопку с типом web_app).
    tg.sendData(JSON.stringify(payload));
    showToast("Заказ отправлен!");
    setTimeout(() => tg.close(), 600);
    return;
  }

  // Резервный вариант — если приложение открыто вне Telegram
  // (например, при тестировании в обычном браузере).
  const url = `https://t.me/${BOT_USERNAME}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
  showToast("Открываю Telegram для отправки заказа...");

  hideModal(el.checkoutModal);
  cart = {};
  updateCartBar();
}

// =========================================================
// МОДАЛЬНЫЕ ОКНА: ОБЩИЕ ФУНКЦИИ
// =========================================================
function showModal(modal) { modal.hidden = false; }
function hideModal(modal) { modal.hidden = true; }

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.hasAttribute("data-close")) {
      hideModal(overlay);
    }
  });
});

// =========================================================
// ТОСТ-УВЕДОМЛЕНИЯ
// =========================================================
let toastTimer = null;
function showToast(message) {
  el.toast.textContent = message;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.toast.hidden = true; }, 1800);
}

// =========================================================
// ПОИСК
// =========================================================
el.searchInput.addEventListener("input", (event) => {
  searchQuery = event.target.value;
  renderProducts();
});

// =========================================================
// СТАРТ
// =========================================================
renderCategories();
renderProducts();
updateCartBar();
