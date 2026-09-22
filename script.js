// =========================================================
// НАСТРОЙКИ — поменяйте под себя
// =========================================================
const BOT_USERNAME = "your_bot_username"; // имя бота без @, используется для запасной ссылки заказа
const CURRENCY = "$";                     // символ валюты, отображаемой в интерфейсе

// =========================================================
// ДАННЫЕ О ТОВАРАХ
// Замените этот массив своими товарами. У каждого товара:
// id, category, name, desc, price, images (массив ссылок на фото, можно 1 или несколько),
// specs (массив пар [название, значение])
//
// Как добавить свои фото — см. README.md, раздел "Свои фото товаров".
// =========================================================
const PRODUCTS = [
  {
    id: 1,
    category: "Маски и трубки",
    name: "Маска для дайвинга Aqua Pro",
    desc: "Закалённое стекло, силиконовый обтюратор, низкий объём подмасочного пространства.",
    price: 35,
    images: [
      "https://placehold.co/600x450/0891b2/ffffff?text=Aqua+Pro",
      "https://placehold.co/600x450/0e7490/ffffff?text=Фото+2"
    ],
    specs: [["Стекло", "Закалённое"], ["Обтюратор", "Силикон"], ["Совместимость", "Для трубки любого типа"], ["Цвет", "Чёрный"]]
  },
  {
    id: 2,
    category: "Маски и трубки",
    name: "Трубка сухого типа Dry Snorkel",
    desc: "Клапан от воды сверху и продувочный клапан снизу — не глотаете воду на поверхности.",
    price: 18,
    images: [
      "https://placehold.co/600x450/0891b2/ffffff?text=Dry+Snorkel",
      "https://placehold.co/600x450/0e7490/ffffff?text=Фото+2"
    ],
    specs: [["Тип", "Сухой (dry top)"], ["Материал", "Силикон + пластик"], ["Крепление", "Универсальное"]]
  },
  {
    id: 3,
    category: "Ласты",
    name: "Ласты для дайвинга Fins X",
    desc: "Открытая пятка с регулируемым ремешком, жёсткая лопасть для мощного гребка.",
    price: 42,
    images: [
      "https://placehold.co/600x450/2563eb/ffffff?text=Fins+X",
      "https://placehold.co/600x450/1d4ed8/ffffff?text=Фото+2"
    ],
    specs: [["Тип пятки", "Открытая"], ["Жёсткость лопасти", "Средне-жёсткая"], ["Размеры", "38-46 (регулируемые)"]]
  },
  {
    id: 4,
    category: "Ласты",
    name: "Ласты для плавания Short Blade",
    desc: "Короткая лопасть — удобны для снорклинга и тренировок в бассейне.",
    price: 25,
    images: [
      "https://placehold.co/600x450/2563eb/ffffff?text=Short+Blade",
      "https://placehold.co/600x450/1d4ed8/ffffff?text=Фото+2"
    ],
    specs: [["Тип пятки", "Закрытая"], ["Длина лопасти", "Короткая"], ["Размеры", "36-45"]]
  },
  {
    id: 5,
    category: "Гидрокостюмы",
    name: "Гидрокостюм 3мм Wetsuit",
    desc: "Неопрен 3мм, проклеенные и обшитые швы, молния на спине.",
    price: 89,
    images: [
      "https://placehold.co/600x450/1e3a8a/ffffff?text=Wetsuit+3mm",
      "https://placehold.co/600x450/1e40af/ffffff?text=Фото+2"
    ],
    specs: [["Толщина неопрена", "3 мм"], ["Молния", "На спине"], ["Размеры", "S-XXL"], ["Температура воды", "от 20°C"]]
  },
  {
    id: 6,
    category: "Аксессуары",
    name: "Шапочка для плавания Silicone Cap",
    desc: "Плотный силикон, не тянет и не рвёт волосы, держит форму.",
    price: 8,
    images: [
      "https://placehold.co/600x450/0d9488/ffffff?text=Silicone+Cap",
      "https://placehold.co/600x450/0f766e/ffffff?text=Фото+2"
    ],
    specs: [["Материал", "Силикон"], ["Размер", "Универсальный"], ["Цвета", "Чёрный, синий, розовый"]]
  },
  {
    id: 7,
    category: "Аксессуары",
    name: "Очки для плавания Swim Goggles Pro",
    desc: "Антифог-покрытие, защита от УФ, мягкая силиконовая окантовка.",
    price: 14,
    images: [
      "https://placehold.co/600x450/0d9488/ffffff?text=Goggles+Pro",
      "https://placehold.co/600x450/0f766e/ffffff?text=Фото+2"
    ],
    specs: [["Покрытие", "Антифог"], ["Защита", "UV400"], ["Регулировка", "Есть"]]
  },
  {
    id: 8,
    category: "Аксессуары",
    name: "Гермомешок Dry Bag 10L",
    desc: "Непромокаемый мешок для телефона, документов и одежды на воде.",
    price: 20,
    images: [
      "https://placehold.co/600x450/0d9488/ffffff?text=Dry+Bag+10L",
      "https://placehold.co/600x450/0f766e/ffffff?text=Фото+2"
    ],
    specs: [["Объём", "10 л"], ["Материал", "Водонепроницаемый ПВХ"], ["Крепление", "Регулируемый ремень"]]
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
  pmGalleryTrack: document.getElementById("pmGalleryTrack"),
  pmGalleryDots: document.getElementById("pmGalleryDots"),
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
      <img class="card__image" src="${p.images[0]}" alt="${p.name}" loading="lazy">
      <div class="card__body">
        <p class="card__category">${p.category}</p>
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
function renderGallery(images) {
  el.pmGalleryTrack.innerHTML = images
    .map((src, i) => `<img class="modal__gallery-img" src="${src}" alt="Фото ${i + 1}">`)
    .join("");
  el.pmGalleryDots.innerHTML = images
    .map((_, i) => `<span class="dot${i === 0 ? " active" : ""}"></span>`)
    .join("");
  el.pmGalleryTrack.scrollLeft = 0;
  el.pmGalleryDots.style.display = images.length > 1 ? "flex" : "none";
}

// Подсвечиваем активную точку при свайпе галереи
el.pmGalleryTrack.addEventListener("scroll", () => {
  const track = el.pmGalleryTrack;
  if (!track.clientWidth) return;
  const index = Math.round(track.scrollLeft / track.clientWidth);
  el.pmGalleryDots.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
});

function openProductModal(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  currentProductId = id;
  modalQty = 1;

  renderGallery(p.images);
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
      <img class="cart-item__image" src="${product.images[0]}" alt="${product.name}">
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

// Убираем подсветку ошибки, как только начали печатать
[el.coName, el.coPhone].forEach((input) => {
  input.addEventListener("input", () => input.classList.remove("field-input--error"));
});

el.coSubmitBtn.addEventListener("click", () => {
  const name = el.coName.value.trim();
  const phone = el.coPhone.value.trim();
  const comment = el.coComment.value.trim();

  el.coName.classList.toggle("field-input--error", !name);
  el.coPhone.classList.toggle("field-input--error", !phone);

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
