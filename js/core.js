/* ===================================================
   core.js — Logic dùng chung cho mọi layout
   Phụ thuộc: PRODUCT_CONFIG, SHARED_CONFIG
   Layout JS phải render DOM TRƯỚC khi core.js chạy
=================================================== */

/* ===================================================
   PRODUCT REF
=================================================== */
const PRODUCT = {
  id:        PRODUCT_CONFIG.id,
  name:      PRODUCT_CONFIG.name,
  price:     PRODUCT_CONFIG.price,
  currency:  PRODUCT_CONFIG.currency,
  sheetname: PRODUCT_CONFIG.sheetName
};

const GAS_URL              = SHARED_CONFIG.gasUrl;
const PRODUCT_EXTRA_IMAGES = PRODUCT_CONFIG.images;
const PRODUCT_VIDEOS       = PRODUCT_CONFIG.videos;
const REVIEWS              = PRODUCT_CONFIG.reviews.items;

/* ===================================================
   DETECT: SP có biến thể màu không?
=================================================== */
const HAS_COLOR_VARIANT = window.__variantPopup && window.__variantPopup.hasColorVariant;
const HAS_COMBO_POPUP   = window.__comboPopup ? true : false;

/* ===================================================
   FACEBOOK PIXEL — init + PageView + ViewContent
=================================================== */
const FB_PIXEL_ID = SHARED_CONFIG.fbPixelId;

const EXTERNAL_ID = (function () {
  let id = localStorage.getItem("nino_eid");
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    localStorage.setItem("nino_eid", id);
  }
  return id;
})();

!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', FB_PIXEL_ID);
fbq('track', 'PageView');

fbq('track', 'ViewContent', {
  content_name:     PRODUCT_CONFIG.name,
  content_category: PRODUCT_CONFIG.category,
  content_ids:      [PRODUCT_CONFIG.id],
  content_type:     'product',
  value:            PRODUCT_CONFIG.price,
  currency:         PRODUCT_CONFIG.currency
}, {
  external_id: EXTERNAL_ID
});

/* ===================================================
   STATE
=================================================== */
let quantity       = 1;
let currentSlide   = 0;
let currentGallery = [];
let cartItems      = [];
let clientIp       = null;

let checkoutMode   = "cart";
let buyNowItems    = [];

let vpPendingAction = null;

/* ===================================================
   DOM REFS
=================================================== */
const slidesEl           = document.getElementById("slides");
const dotsEl             = document.getElementById("dots");
const thumbsEl           = document.getElementById("thumbs") || document.createElement("div");
const slider             = document.getElementById("slider");
const orderModal         = document.getElementById("orderModal");
const thankModal         = document.getElementById("thankModal");
const goToCartBtn        = document.getElementById("goToCartBtn");
const buyNowBtn          = document.getElementById("buyNowBtn");
const inlineAddToCartBtn = document.getElementById("inlineAddToCartBtn");
const inlineBuyNowBtn    = document.getElementById("inlineBuyNowBtn");
const closeModal         = document.getElementById("closeModal");
const statusMessage      = document.getElementById("statusMessage");
const toastEl            = document.getElementById("toast");
const submitBtn          = document.getElementById("submitBtn");
const thankCloseBtn      = document.getElementById("thankCloseBtn");
const cartBadge          = document.getElementById("cartBadge");

/* ===================================================
   SHA256
=================================================== */
async function sha256(str) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(str.trim().toLowerCase())
  );
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

/* ===================================================
   UTILS
=================================================== */
function genEventId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function formatPrice(num) {
  return num.toLocaleString("vi-VN") + "đ";
}

let toastTimer = null;
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
}

function updateQtyDisplay() {
  document.getElementById("quantity").value = quantity;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + "=" + value + "; expires=" + expires + "; path=/";
}

/* ===================================================
   CART BADGE
=================================================== */
function updateCartBadge() {
  loadCartItems();
  const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  if (!cartBadge) return;
  if (total > 0) {
    cartBadge.textContent = total > 99 ? "99+" : total;
    cartBadge.classList.add("show");
  } else {
    cartBadge.classList.remove("show");
  }

  const vpBadge = document.getElementById("vpCartBadge");
  const cpBadge = document.getElementById("cpCartBadge");
  if (vpBadge) {
    if (total > 0) { vpBadge.textContent = total > 99 ? "99+" : total; vpBadge.classList.add("show"); }
    else { vpBadge.classList.remove("show"); }
  }
  if (cpBadge) {
    if (total > 0) { cpBadge.textContent = total > 99 ? "99+" : total; cpBadge.classList.add("show"); }
    else { cpBadge.classList.remove("show"); }
  }
}

/* ===================================================
   LƯU fbclid RAW
=================================================== */
(function () {
  const fbclid = getQueryParam("fbclid");
  if (fbclid) sessionStorage.setItem("fbclid_raw", fbclid);
})();

/* ===================================================
   LẤY CLIENT IP
=================================================== */
fetch("https://api.ipify.org?format=json")
  .then(r => r.json())
  .then(d => { clientIp = d.ip; })
  .catch(() => {});

/* ===================================================
   BUILD BASE PAYLOAD
=================================================== */
function buildBasePayload(eventIdObj) {
  const _p = new URLSearchParams(window.location.search);
  return {
    sheet_name:       PRODUCT.sheetname,
    product_id:       PRODUCT.id,
    product_name:     PRODUCT.name,
    price:            PRODUCT.price,
    value:            PRODUCT.price,
    currency:         PRODUCT.currency,
    event_source_url: window.location.href,
    user_agent:       navigator.userAgent,
    client_ip:        clientIp || null,
    fbp:              getCookie("_fbp") || null,
    fbc:              getCookie("_fbc") || null,
    fbclid:           getQueryParam("fbclid") || null,
    utm_source:       _p.get("utm_source")   || "",
    utm_medium:       _p.get("utm_medium")   || "",
    utm_campaign:     _p.get("utm_campaign") || "",
    utm_content:      _p.get("utm_content")  || "",
    ...eventIdObj
  };
}

/* ===================================================
   GỬI LÊN GAS
=================================================== */
function sendToGAS(payload) {
  fetch(GAS_URL, {
    method:  "POST",
    mode:    "no-cors",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload)
  }).catch(() => {});
}

/* ===================================================
   GỬI BÁO LỖI HỆ THỐNG
=================================================== */
function sendErrorReport(errorMessage, customerData, itemsData, total) {
  const payload = {
    event_type:    "error_report",
    error_message: errorMessage,
    customer:      customerData || {},
    items:         itemsData   || [],
    total:         total       || 0,
    note:          (customerData && customerData.note) ? customerData.note : ""
  };
  fetch(GAS_URL, {
    method:  "POST",
    mode:    "no-cors",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(payload)
  }).catch(() => {});
}

/* ===================================================
   GALLERY (trang chính)
=================================================== */
function buildFullGallery() {
  slidesEl.innerHTML = "";
  dotsEl.innerHTML   = "";
  thumbsEl.innerHTML = "";
  currentGallery     = [];
  let index = 0;

  function addSlide(src, label, isVideo) {
    currentGallery.push(src);
    const slide = document.createElement("div");
    slide.className = "slide";
    if (isVideo) {
      slide.innerHTML = `<video controls playsinline preload="metadata"><source src="${src}" type="video/mp4" /></video>`;
    } else {
      const eager = index === 0 ? "eager" : "lazy";
      const fp    = index === 0 ? "high"  : "low";
      slide.innerHTML = `<img src="${src}" alt="${label}" loading="${eager}" fetchpriority="${fp}" decoding="async" width="600" />`;
    }
    slidesEl.appendChild(slide);

    const capturedIndex = index;
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.addEventListener("click", () => goToSlide(capturedIndex));
    dotsEl.appendChild(dot);
    index++;
  }

  PRODUCT_EXTRA_IMAGES.forEach(src => addSlide(src, "product", false));
  PRODUCT_VIDEOS.forEach(src => addSlide(src, "video", true));

  if (index === 0) {
    addSlide(
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect width='500' height='500' fill='%23eef2f7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='16' fill='%23aaa'%3EẢnh sản phẩm%3C/text%3E%3C/svg%3E",
      "placeholder", false
    );
  }

  dotsEl.style.display = currentGallery.length <= 1 ? "none" : "";
  goToSlide(0);
}

function updateSlider() {
  slidesEl.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll("#dots .dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

function goToSlide(idx) {
  currentSlide = idx;
  updateSlider();
}

/* SWIPE */
let startX = 0, startY = 0, moveX = 0, moveY = 0;
let isDragging = false, isHorizontal = null;

slider.addEventListener("touchstart", e => {
  startX = moveX = e.touches[0].clientX;
  startY = moveY = e.touches[0].clientY;
  isDragging = true;
  isHorizontal = null;
}, { passive: true });

slider.addEventListener("touchmove", e => {
  if (!isDragging) return;
  moveX = e.touches[0].clientX;
  moveY = e.touches[0].clientY;
  if (isHorizontal === null) {
    const diffX = Math.abs(moveX - startX);
    const diffY = Math.abs(moveY - startY);
    if (diffX > 5 || diffY > 5) isHorizontal = diffX >= diffY;
  }
  if (isHorizontal === true) e.preventDefault();
}, { passive: false });

slider.addEventListener("touchend", () => {
  if (!isDragging) return;
  if (isHorizontal === true) {
    const diff = startX - moveX;
    if      (diff >  50 && currentSlide < currentGallery.length - 1) currentSlide++;
    else if (diff < -50 && currentSlide > 0)                          currentSlide--;
    updateSlider();
  }
  isDragging = false;
  isHorizontal = null;
  startX = 0; startY = 0; moveX = 0; moveY = 0;
});

/* ===================================================
   VARIANT / COMBO HELPERS
=================================================== */
function getSelectedVariants() {
  if (HAS_COLOR_VARIANT && window.__variantPopup) {
    return window.__variantPopup.getSelectedVariants();
  }
  const result = {};
  document.querySelectorAll(".variant-group").forEach(group => {
    const type = group.dataset.type;
    const active = group.querySelector(".variant-option.active");
    if (active) result[type] = active.dataset.value;
  });
  return result;
}

function getSelectedCombo() {
  const active = document.querySelector(".combo-option.active");
  if (!active) return null;
  return {
    index:   parseInt(active.dataset.index),
    name:    active.querySelector(".combo-name")?.textContent || "",
    price:   parseInt(active.dataset.price),
    shipFee: parseInt(active.dataset.shipfee || "0")
  };
}

function getCurrentPrice() {
  const combo = getSelectedCombo();
  return combo ? combo.price : PRODUCT.price;
}

function updatePriceDisplay() {
  const priceEl    = document.querySelector(".price");
  const oldPriceEl = document.querySelector(".old-price");
  const badgeEl    = document.querySelector(".badge-discount");
  const combo      = getSelectedCombo();
  if (priceEl) priceEl.textContent = formatPrice(getCurrentPrice());
  if (combo) {
    if (oldPriceEl) oldPriceEl.style.display = "none";
    if (badgeEl)    badgeEl.style.display    = "none";
  } else {
    if (oldPriceEl) oldPriceEl.style.display = "";
    if (badgeEl)    badgeEl.style.display    = "";
  }
}

/* ===================================================
   QTY
=================================================== */
document.getElementById("minusQty").addEventListener("click", () => {
  if (quantity > 1) { quantity--; updateQtyDisplay(); }
});
document.getElementById("plusQty").addEventListener("click", () => {
  quantity++; updateQtyDisplay();
});
document.getElementById("quantity").addEventListener("input", e => {
  const val = parseInt(e.target.value);
  quantity  = (!isNaN(val) && val > 0) ? val : 1;
  updateQtyDisplay();
});

/* ===================================================
   MODAL — ORDER
=================================================== */
function openModal() {
  orderModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function hideModal() {
  orderModal.classList.remove("show");
  document.body.style.overflow = "auto";
}

closeModal.addEventListener("click", hideModal);
orderModal.addEventListener("click", e => { if (e.target === orderModal) hideModal(); });

/* ===================================================
   MODAL — THANK
=================================================== */
function openThankModal() {
  thankModal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function hideThankModal() {
  thankModal.classList.remove("show");
  document.body.style.overflow = "auto";
}

thankCloseBtn.addEventListener("click", hideThankModal);
thankModal.addEventListener("click", e => { if (e.target === thankModal) hideThankModal(); });

/* ===================================================
   CART — localStorage
=================================================== */
const CART_KEY = "nino_cart_" + PRODUCT_CONFIG.slug;

function loadCartItems() {
  const saved = localStorage.getItem(CART_KEY);
  if (saved) {
    try { cartItems = JSON.parse(saved) || []; }
    catch (_) { cartItems = []; }
  } else {
    cartItems = [];
  }
}

function saveCartItems() {
  localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
}

function buildCartItemKey(productId, variants, combo) {
  let key = productId;
  if (variants && Object.keys(variants).length) {
    key += "|" + Object.entries(variants).sort((a,b) => a[0].localeCompare(b[0])).map(([k,v]) => k + ":" + v).join(",");
  }
  if (combo) key += "|combo:" + combo.index;
  return key;
}

function addCurrentSelectionToCart() {
  loadCartItems();
  const variants  = getSelectedVariants();
  const combo     = getSelectedCombo();
  const unitPrice = getCurrentPrice();
  const itemKey   = buildCartItemKey(PRODUCT.id, variants, combo);

  const existingIndex = cartItems.findIndex(item => item._key === itemKey);
  if (existingIndex > -1) {
    cartItems[existingIndex].quantity += quantity;
    cartItems[existingIndex].total = cartItems[existingIndex].quantity * unitPrice;
  } else {
    const item = {
      _key:         itemKey,
      product_id:   PRODUCT.id,
      product_name: PRODUCT_CONFIG.displayName || PRODUCT.name,
      quantity:     quantity,
      price:        unitPrice,
      total:        unitPrice * quantity,
      shipFee:      combo ? (combo.shipFee || 0) : 0
    };
    if (Object.keys(variants).length) item.variants = variants;
    if (combo)                         item.combo    = combo.name;
    cartItems.push(item);
  }
  saveCartItems();
}

function getActiveItems() {
  return checkoutMode === "buynow" ? buyNowItems : cartItems;
}

function getActiveSubTotal() {
  return getActiveItems().reduce((sum, item) => sum + item.total, 0);
}

function getActiveShipFee() {
  const items = getActiveItems();
  if (!items.length) return 0;
  let maxShip = 0;
  items.forEach(item => { const fee = item.shipFee || 0; if (fee > maxShip) maxShip = fee; });
  return maxShip;
}

function getActiveGrandTotal() {
  return getActiveSubTotal() + getActiveShipFee();
}

/* ===================================================
   THUMBNAIL HELPER
   Ưu tiên: ảnh color option của màu đang chọn.
   Fallback: ảnh đầu PRODUCT_CONFIG.images.
=================================================== */
function getThumbnailForItem(item) {
  const variants = PRODUCT_CONFIG.variants || [];
  const colorVariant = variants.find(v => v.type === "color");

  /* Có color variant và item có chọn màu → dùng ảnh color option */
  if (colorVariant && item.variants && item.variants.color) {
    const colorName = item.variants.color;
    const colorOpt  = colorVariant.options.find(o => o.name === colorName);
    if (colorOpt && colorOpt.image) return colorOpt.image;
  }

  /* Fallback: ảnh đầu tiên của SP */
  if (PRODUCT_CONFIG.images && PRODUCT_CONFIG.images.length) {
    return PRODUCT_CONFIG.images[0];
  }

  return "";
}

/* ===================================================
   RENDER CART SUMMARY — COMPACT + THUMBNAIL
=================================================== */
function renderCartSummary() {
  const cartSummaryList = document.getElementById("cartSummaryList");
  const grandTotalEl    = document.getElementById("summaryGrandTotal");
  const activeItems     = getActiveItems();

  if (!activeItems.length) {
    cartSummaryList.innerHTML = `<div style="color:#aaa; padding:8px 0; font-size:13.5px;">Chưa có sản phẩm trong giỏ hàng.</div>`;
    grandTotalEl.textContent  = formatPrice(0);
    updateSubmitBtnPrice();
    return;
  }

  cartSummaryList.innerHTML = activeItems.map((item, idx) => {
    const MAX_NAME  = 32;
    const rawName   = item.product_name || "";
    const shortName = rawName.length > MAX_NAME ? rawName.slice(0, MAX_NAME) + "…" : rawName;

    const metaParts = [];
    if (item.variants) Object.values(item.variants).forEach(v => metaParts.push(v));
    if (item.combo)    metaParts.push(item.combo);
    const metaStr = metaParts.join(" · ");

    const thumb = getThumbnailForItem(item);
    const thumbHtml = thumb
      ? `<img class="cart-item-thumb" src="${thumb}" alt="${shortName}" loading="lazy" decoding="async" />`
      : `<div class="cart-item-thumb" style="display:flex;align-items:center;justify-content:center;font-size:18px;">🛍</div>`;

    return `
    <div class="cart-item">
      ${thumbHtml}
      <div class="cart-item-body">
        <div class="cart-item-name" title="${rawName}">${shortName}</div>
        ${metaStr ? `<div class="cart-item-meta">${metaStr}</div>` : ""}
        <div class="cart-item-controls">
          <button class="cart-qty-btn" data-action="minus" data-idx="${idx}">−</button>
          <span class="cart-qty-display">${item.quantity}</span>
          <button class="cart-qty-btn" data-action="plus" data-idx="${idx}">+</button>
          <button class="cart-remove-btn" data-action="remove" data-idx="${idx}">🗑 Xoá</button>
        </div>
      </div>
      <div class="cart-item-price">${formatPrice(item.total)}</div>
    </div>`;
  }).join("");

  const shipFee     = getActiveShipFee();
  const freeshipRow = document.querySelector(".order-totals-row.freeship");
  if (freeshipRow) {
    if (shipFee > 0) {
      freeshipRow.querySelector("span:first-child").textContent = "🚚 Phí vận chuyển";
      freeshipRow.querySelector("span:last-child").textContent  = formatPrice(shipFee);
    } else {
      freeshipRow.querySelector("span:first-child").textContent = "🚚 Miễn phí vận chuyển";
      freeshipRow.querySelector("span:last-child").textContent  = "0đ";
    }
  }

  grandTotalEl.textContent = formatPrice(getActiveGrandTotal());
  updateSubmitBtnPrice();

  cartSummaryList.querySelectorAll("[data-action]").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      const idx    = parseInt(btn.dataset.idx);
      const items  = getActiveItems();

      if (action === "minus") {
        if (items[idx].quantity > 1) {
          items[idx].quantity--;
          items[idx].total = items[idx].quantity * items[idx].price;
        } else {
          items.splice(idx, 1);
        }
      } else if (action === "plus") {
        items[idx].quantity++;
        items[idx].total = items[idx].quantity * items[idx].price;
      } else if (action === "remove") {
        items.splice(idx, 1);
      }

      if (checkoutMode === "cart") saveCartItems();
      renderCartSummary();
      updateCartBadge();
    });
  });
}

function updateSubmitBtnPrice() {
  submitBtn.innerHTML = `
    <span class="submit-btn-main">🔒 XÁC NHẬN ĐẶT HÀNG</span>
    <span class="submit-btn-sub">THANH TOÁN KHI NHẬN HÀNG</span>
  `;
}

/* ===================================================
   OPEN CHECKOUT — InitiateCheckout
=================================================== */
function openCheckout() {
  renderCartSummary();

  const eid = genEventId();

  if (typeof fbq !== "undefined") {
    fbq('track', 'InitiateCheckout', {
      content_name: PRODUCT.name,
      content_ids:  [PRODUCT.id],
      content_type: 'product',
      value:        getActiveGrandTotal(),
      currency:     PRODUCT.currency
    }, { eventID: eid, external_id: EXTERNAL_ID });
  }

  sendToGAS({
    ...buildBasePayload({ initiate_checkout_event_id: eid }),
    event_type:         "initiate_checkout",
    value:              getActiveGrandTotal(),
    external_id:        EXTERNAL_ID,
    external_id_hashed: false
  });

  openModal();
}

/* ===================================================
   HELPER: Thêm vào giỏ
=================================================== */
function doAddToCart(btnEl) {
  addCurrentSelectionToCart();
  updateCartBadge();

  const eid       = genEventId();
  const unitPrice = getCurrentPrice();

  if (typeof fbq !== "undefined") {
    fbq('track', 'AddToCart', {
      content_name: PRODUCT.name,
      content_ids:  [PRODUCT.id],
      content_type: 'product',
      value:        unitPrice * quantity,
      currency:     PRODUCT.currency
    }, { eventID: eid, external_id: EXTERNAL_ID });
  }

  sendToGAS({
    ...buildBasePayload({ add_to_cart_event_id: eid }),
    event_type:         "add_to_cart",
    value:              unitPrice * quantity,
    external_id:        EXTERNAL_ID,
    external_id_hashed: false
  });

  showToast("✓ Đã thêm vào giỏ hàng");

  if (btnEl) {
    const original = btnEl.textContent;
    btnEl.textContent = "✓ Đã thêm";
    btnEl.classList.add("added");
    setTimeout(() => {
      btnEl.textContent = original;
      btnEl.classList.remove("added");
    }, 1500);
  }
}

/* ===================================================
   HELPER: Mua ngay trong popup
=================================================== */
function doPopupBuyNow() {
  checkoutMode = "buynow";
  const variants  = getSelectedVariants();
  const combo     = getSelectedCombo();
  const unitPrice = getCurrentPrice();
  const item = {
    product_id:   PRODUCT.id,
    product_name: PRODUCT_CONFIG.displayName || PRODUCT.name,
    quantity:     quantity,
    price:        unitPrice,
    total:        unitPrice * quantity,
    shipFee:      combo ? (combo.shipFee || 0) : 0
  };
  if (Object.keys(variants).length) item.variants = variants;
  if (combo)                         item.combo    = combo.name;
  buyNowItems = [item];
  openCheckout();
}

/* ===================================================
   HELPER: Mua ngay ngoài trang
=================================================== */
function doBuyNow() {
  checkoutMode = "buynow";
  const variants  = getSelectedVariants();
  const combo     = getSelectedCombo();
  const unitPrice = getCurrentPrice();
  const item = {
    product_id:   PRODUCT.id,
    product_name: PRODUCT_CONFIG.displayName || PRODUCT.name,
    quantity:     quantity,
    price:        unitPrice,
    total:        unitPrice * quantity,
    shipFee:      combo ? (combo.shipFee || 0) : 0
  };
  if (Object.keys(variants).length) item.variants = variants;
  if (combo)                         item.combo    = combo.name;
  buyNowItems = [item];
  openCheckout();
}

/* ===================================================
   CTA EVENTS — ngoài trang
=================================================== */
inlineAddToCartBtn.addEventListener("click", () => {
  if (HAS_COLOR_VARIANT)    window.__variantPopup.open();
  else if (HAS_COMBO_POPUP) window.__comboPopup.open();
  else                      doAddToCart(inlineAddToCartBtn);
});

goToCartBtn.addEventListener("click", () => {
  loadCartItems();
  if (!cartItems.length) { showToast("Giỏ hàng trống"); return; }
  checkoutMode = "cart";
  openCheckout();
});

buyNowBtn.addEventListener("click", () => {
  if (HAS_COLOR_VARIANT)    window.__variantPopup.open();
  else if (HAS_COMBO_POPUP) window.__comboPopup.open();
  else                      doBuyNow();
});

inlineBuyNowBtn.addEventListener("click", () => {
  if (HAS_COLOR_VARIANT)    window.__variantPopup.open();
  else if (HAS_COMBO_POPUP) window.__comboPopup.open();
  else                      doBuyNow();
});

const midCtaBtn = document.getElementById("midCtaBtn");
if (midCtaBtn) {
  midCtaBtn.addEventListener("click", () => {
    if (HAS_COLOR_VARIANT)    window.__variantPopup.open();
    else if (HAS_COMBO_POPUP) window.__comboPopup.open();
    else                      doBuyNow();
  });
}

/* ===================================================
   VARIANT POPUP — CTA BUTTONS
=================================================== */
if (HAS_COLOR_VARIANT) {
  const vpAddBtn = document.getElementById("vpAddToCartBtn");
  if (vpAddBtn) vpAddBtn.addEventListener("click", () => doAddToCart(vpAddBtn));

  const vpGoToCartBtn = document.getElementById("vpGoToCartBtn");
  if (vpGoToCartBtn) {
    vpGoToCartBtn.addEventListener("click", () => {
      window.__variantPopup.close();
      loadCartItems();
      if (!cartItems.length) { showToast("Giỏ hàng trống"); return; }
      checkoutMode = "cart";
      openCheckout();
    });
  }

  const vpBuyNowBtn = document.getElementById("vpBuyNowBtn");
  if (vpBuyNowBtn) {
    vpBuyNowBtn.addEventListener("click", () => {
      window.__variantPopup.close();
      doPopupBuyNow();
    });
  }
}

/* ===================================================
   COMBO POPUP — CTA BUTTONS
=================================================== */
if (HAS_COMBO_POPUP) {
  const cpAddBtn = document.getElementById("cpAddToCartBtn");
  if (cpAddBtn) cpAddBtn.addEventListener("click", () => doAddToCart(cpAddBtn));

  const cpGoToCartBtn = document.getElementById("cpGoToCartBtn");
  if (cpGoToCartBtn) {
    cpGoToCartBtn.addEventListener("click", () => {
      window.__comboPopup.close();
      loadCartItems();
      if (!cartItems.length) { showToast("Giỏ hàng trống"); return; }
      checkoutMode = "cart";
      openCheckout();
    });
  }

  const cpBuyNowBtn = document.getElementById("cpBuyNowBtn");
  if (cpBuyNowBtn) {
    cpBuyNowBtn.addEventListener("click", () => {
      window.__comboPopup.close();
      doPopupBuyNow();
    });
  }
}

/* ===================================================
   Phone auto-format
=================================================== */
const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function () {
  let raw = this.value.replace(/\D/g, "");
  if (raw.length > 10) raw = raw.slice(0, 10);
  let formatted = raw;
  if (raw.length > 4 && raw.length <= 7) {
    formatted = raw.slice(0, 4) + " " + raw.slice(4);
  } else if (raw.length > 7) {
    formatted = raw.slice(0, 4) + " " + raw.slice(4, 7) + " " + raw.slice(7);
  }
  this.value = formatted;
  const phoneRegex = /^(0[35789])[0-9]{8}$/;
  if (raw.length === 0) {
    clearFieldError("phone", "phoneError");
  } else if (raw.length === 10 && !phoneRegex.test(raw)) {
    showFieldError("phone", "phoneError", "Số điện thoại không hợp lệ");
  } else {
    clearFieldError("phone", "phoneError");
  }
});

/* ===================================================
   Inline validation helpers
=================================================== */
function showFieldError(fieldId, errorId, msg) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.add("input-error");
  if (error) { error.textContent = msg; error.classList.add("show"); }
}

function clearFieldError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field) field.classList.remove("input-error");
  if (error) { error.textContent = ""; error.classList.remove("show"); }
}

function clearAllFieldErrors() {
  [
    ["address",  "addressError"],
    ["fullName", "fullNameError"],
    ["phone",    "phoneError"]
  ].forEach(([fid, eid]) => clearFieldError(fid, eid));
}

function scrollToFirstError() {
  const firstError = document.querySelector(".field-error.show");
  if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ===================================================
   ORDER FORM SUBMIT — Purchase
=================================================== */
document.getElementById("orderForm").addEventListener("submit", async e => {
  e.preventDefault();
  clearAllFieldErrors();

  try {
    const fullName  = document.getElementById("fullName").value.trim();
    const phoneRaw  = getPhoneRaw();
    const address   = document.getElementById("address").value.trim();
    const orderNote = document.getElementById("orderNote").value.trim();

    let hasError = false;

    if (!address) {
      showFieldError("address", "addressError", "Vui lòng nhập địa chỉ nhận hàng");
      hasError = true;
    }

    if (!fullName) {
      showFieldError("fullName", "fullNameError", "Vui lòng nhập tên người nhận");
      hasError = true;
    }

    const phoneRegex = /^(0[35789])[0-9]{8}$/;
    if (!phoneRaw) {
      showFieldError("phone", "phoneError", "Vui lòng nhập số điện thoại");
      hasError = true;
    } else if (!phoneRegex.test(phoneRaw)) {
      showFieldError("phone", "phoneError", "Số điện thoại không hợp lệ");
      hasError = true;
    }

    if (hasError) { scrollToFirstError(); return; }

    const activeItems = getActiveItems();
    if (!activeItems.length) {
      statusMessage.style.color = "red";
      statusMessage.textContent = "Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi đặt hàng.";
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = "Đang gửi...";
    statusMessage.textContent = "";

    const purchaseEventId = genEventId();
    const hashedPhone     = await sha256(phoneRaw);
    const finalGrandTotal = getActiveGrandTotal();

    const customerData = {
      full_name: fullName,
      phone:     phoneRaw,
      address:   address
    };

    const payloadItems = activeItems.map(item => {
      const clean = { ...item };
      delete clean._key;
      if (clean.variants) {
        if (clean.variants.color) clean.color = clean.variants.color;
        if (clean.variants.size)  clean.size  = clean.variants.size;
        delete clean.variants;
      }
      return clean;
    });

    const payload = {
      ...buildBasePayload({ purchase_event_id: purchaseEventId }),
      event_type:         "purchase",
      items:              payloadItems,
      quantity:           activeItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal:           getActiveSubTotal(),
      total:              finalGrandTotal,
      value:              finalGrandTotal,
      hashed_phone:       hashedPhone,
      external_id:        EXTERNAL_ID,
      external_id_hashed: false,
      note:               orderNote,
      customer:           customerData
    };

    /* Reset form trước khi gửi */
    document.getElementById("orderForm").reset();

    /* Đóng ghi chú nếu đang mở */
    const noteToggle   = document.getElementById("noteToggleBtn");
    const noteCollapse = document.getElementById("noteCollapse");
    if (noteToggle)   noteToggle.classList.remove("open");
    if (noteCollapse) noteCollapse.classList.remove("open");

    quantity = 1;
    updateQtyDisplay();

    if (checkoutMode === "cart") {
      localStorage.removeItem(CART_KEY);
      cartItems = [];
    } else {
      buyNowItems = [];
    }

    renderCartSummary();
    updateCartBadge();
    hideModal();
    openThankModal();

    submitBtn.disabled = false;
    updateSubmitBtnPrice();

    setTimeout(() => {
      fetch(GAS_URL, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
      }).catch(fetchErr => {
        sendErrorReport("Fetch GAS thất bại: " + fetchErr.toString(), customerData, payloadItems, finalGrandTotal);
      });

      if (typeof fbq !== "undefined") {
        fbq('track', 'Purchase', {
          content_name: PRODUCT.name,
          content_ids:  [PRODUCT.id],
          content_type: 'product',
          value:        finalGrandTotal,
          currency:     PRODUCT.currency
        }, { eventID: purchaseEventId, external_id: EXTERNAL_ID });
      }
    }, 0);

  } catch (err) {
    console.error("Submit error:", err);
    submitBtn.disabled  = false;
    updateSubmitBtnPrice();
    statusMessage.style.color = "red";
    statusMessage.textContent = "Có lỗi xảy ra, vui lòng thử lại.";

    const customerSnap = {
      full_name: document.getElementById("fullName")?.value?.trim() || "",
      phone:     getPhoneRaw(),
      address:   document.getElementById("address")?.value?.trim()  || ""
    };
    sendErrorReport("Exception trong submit handler: " + err.toString(), customerSnap, getActiveItems(), getActiveGrandTotal());
  }
});

/* ===================================================
   REVIEWS
=================================================== */
function renderStars(stars) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

function renderReviewMedia(media, mediaFull) {
  if (!media || !media.length) return "";
  return `
    <div class="review-media">
      ${media.map((item, idx) => {
        if (typeof item === "object" && item.type === "video") {
          return `<div class="review-media-item lazy-video-wrap" data-type="video" data-src="${item.src}" style="position:relative; cursor:pointer;">
              <img src="${item.poster}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;background:rgba(0,0,0,0.25);border-radius:8px;">▶</div>
            </div>`;
        }
        const str = typeof item === "string" ? item : "";
        if (!str) return "";
        const isVideo = str.toLowerCase().includes(".mp4");
        return isVideo
          ? `<div class="review-media-item lazy-video-wrap" data-type="video" data-src="${str}" style="position:relative; cursor:pointer;">
              <div style="width:100%;height:100%;background:#eee;border-radius:8px;display:flex;align-items:center;justify-content:center;color:#999;font-size:22px;">▶</div>
            </div>`
          : `<img class="review-media-item" data-type="image" data-src="${str}" data-full="${(mediaFull && mediaFull[idx]) ? mediaFull[idx] : str}" src="${str}" loading="lazy" decoding="async" style="cursor:pointer;" />`;
      }).join("")}
    </div>
  `;
}

function renderReviews() {
  const reviewList = document.getElementById("reviewList");
  if (!reviewList) return;
  reviewList.innerHTML = REVIEWS.map(review => `
    <div class="review-item">
      <div class="review-top">
        <img class="review-avatar" src="${review.avatar}" alt="${review.name}" loading="lazy" decoding="async" />
        <div class="review-main">
          <div class="review-name">${review.name}</div>
          <div class="review-stars">${renderStars(review.stars)}</div>
          <div class="review-meta">${review.date}</div>
          <span class="review-classify">${review.classify}</span>
          <div style="font-size:12px; color:#777; margin-bottom:8px;">
            Chính xác: ${review.match} &nbsp;·&nbsp; Chất lượng: ${review.material}
          </div>
          <div class="review-content">${review.content}</div>
          ${renderReviewMedia(review.media, review.mediaFull)}
          <div class="review-like">👍 ${review.likes}</div>
        </div>
      </div>
    </div>
  `).join("");
}

/* ===================================================
   MEDIA LIGHTBOX
=================================================== */
function setupReviewMediaLightbox() {
  const lightbox        = document.getElementById("mediaLightbox");
  const lightboxContent = document.getElementById("mediaLightboxContent");
  const closeBtn        = document.getElementById("closeMediaLightbox");

  document.addEventListener("click", e => {
    const target = e.target.closest(".review-media-item");
    if (!target) return;
    e.stopPropagation();
    const type = target.dataset.type;
    const src  = target.dataset.full || target.dataset.src;
    if (!type || !src) return;
    lightboxContent.querySelectorAll("img, video").forEach(el => el.remove());
    let mediaEl;
    if (type === "video") {
      mediaEl             = document.createElement("video");
      mediaEl.src         = src;
      mediaEl.controls    = true;
      mediaEl.autoplay    = true;
      mediaEl.playsInline = true;
      mediaEl.style.cssText = "max-width:100%; max-height:80vh; border-radius:8px;";
    } else {
      mediaEl     = document.createElement("img");
      mediaEl.src = src;
    }
    lightboxContent.appendChild(mediaEl);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
  });

  function closeLightbox() {
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
    const video = lightboxContent.querySelector("video");
    if (video) { video.pause(); video.currentTime = 0; }
    lightboxContent.querySelectorAll("img, video").forEach(el => el.remove());
  }

  closeBtn.addEventListener("click", e => { e.stopPropagation(); closeLightbox(); });
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  lightboxContent.addEventListener("click", e => e.stopPropagation());
}

/* ===================================================
   INIT — ViewContent GAS
=================================================== */
(function initViewContent() {
  const eid = genEventId();
  sendToGAS({
    ...buildBasePayload({ view_content_event_id: eid }),
    event_type:         "view_content",
    value:              PRODUCT.price,
    external_id:        EXTERNAL_ID,
    external_id_hashed: false
  });
})();

/* ===================================================
   LAZY VIDEOS
=================================================== */
function initLazyVideos() {
  document.querySelectorAll(".lazy-video-wrap").forEach(wrap => {
    if (wrap.dataset.bound) return;
    if (wrap.closest(".review-media")) return;
    wrap.dataset.bound = "1";
    wrap.addEventListener("click", function (e) {
      e.stopPropagation();
      const src = this.dataset.src;
      if (!src) return;
      const video = document.createElement("video");
      video.src         = src;
      video.controls    = true;
      video.autoplay    = true;
      video.playsInline = true;
      video.style.cssText = "width:100%;height:100%;object-fit:cover;border-radius:8px;";
      this.innerHTML = "";
      this.appendChild(video);
      this.classList.remove("lazy-video-wrap");
      this.style.cursor = "default";
    });
  });
}

function getPhoneRaw() {
  return phoneInput.value.replace(/\D/g, "");
}

/* ===================================================
   SHARED LIVE NOTIF ENGINE
   window.__liveNotif — dùng chung cho mọi nơi
=================================================== */
(function initLiveNotifEngine() {
  const MAX_HISTORY = 20;
  const history     = [];
  const subscribers = [];

  const firstNames = [
    "An","Anh","Bảo","Bích","Châu","Chi","Cường","Dung","Dương","Đạt",
    "Đức","Giang","Hà","Hải","Hằng","Hiếu","Hoa","Hoàng","Hùng","Hương",
    "Khoa","Khánh","Lan","Linh","Long","Mai","Minh","My","Nam","Nga",
    "Ngân","Nghĩa","Ngọc","Nhung","Như","Nhi","Phong","Phúc","Phương","Quân",
    "Quỳnh","Sơn","Tâm","Thảo","Thanh","Thắng","Thư","Tiến","Toàn","Trang",
    "Trung","Tuấn","Tùng","Tuyết","Uyên","Vân","Việt","Xuân","Yến","Hạnh"
  ];
  const lastNames = [
    "Nguyễn","Trần","Lê","Phạm","Hoàng","Huỳnh","Phan","Vũ","Võ","Đặng",
    "Bùi","Đỗ","Hồ","Ngô","Dương","Lý","Đinh","Tạ","Trịnh","Lương"
  ];
  const midNames = [
    "Văn","Thị","Minh","Quốc","Đức","Hữu","Thành","Trọng","Xuân","Ngọc"
  ];

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function getRandomVariantLabel() {
    const variants = PRODUCT_CONFIG.variants || [];
    const parts = [];
    variants.forEach(v => {
      if (v.options && v.options.length) {
        const opt = pick(v.options);
        const name = typeof opt === "object" ? opt.name : opt;
        /* Rút gọn tên size nếu quá dài */
        const short = name.length > 20 ? name.slice(0, 20) + "…" : name;
        parts.push(short);
      }
    });
    return parts.join(" – ");
  }

  function getProductShortName() {
    const name = PRODUCT_CONFIG.shortName || PRODUCT_CONFIG.name || "sản phẩm";
    return name.length > 18 ? name.slice(0, 18) + "…" : name;
  }

  function buildEntry() {
    const last      = pick(lastNames);
    const mid       = pick(midNames);
    const first     = pick(firstNames);
    const maskedMid = mid.slice(0, 1) + "**";
    const name      = `${last} ${maskedMid} ${first}`;
    const variant   = getRandomVariantLabel();
    const product   = getProductShortName();
    const detail    = variant ? `${product} – ${variant}` : product;
    return {
      name:      name,
      shortText: `${name} vừa đặt hàng`,
      detail:    detail,
      ts:        Date.now()
    };
  }

  function formatTimeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60)  return `${diff} giây trước`;
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    return `${Math.floor(diff / 3600)} giờ trước`;
  }

  function rnd(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function broadcast(entry) {
    subscribers.forEach(fn => fn(entry));
  }

  function loop() {
    const entry = buildEntry();
    history.unshift(entry);
    if (history.length > MAX_HISTORY) history.pop();
    broadcast(entry);
    setTimeout(loop, rnd(5000, 15000));
  }

  /* Khởi động sau delay ngẫu nhiên */
  setTimeout(loop, rnd(2000, 5000));

  window.__liveNotif = {
    subscribe:     function(fn) { subscribers.push(fn); },
    getHistory:    function() { return history; },
    formatTimeAgo: formatTimeAgo
  };
})();

/* ===================================================
   MODAL LIVE NOTIFICATION — subscribe engine
=================================================== */
function initModalLiveNotif() {
  const inner  = document.getElementById("modalLiveNotifInner");
  const textEl = document.getElementById("modalLiveNotifText");
  if (!inner || !textEl) return;

  /* Subscribe nhận entry mới từ engine */
  window.__liveNotif.subscribe(function(entry) {
    /* Fade out + slide up */
    inner.style.transition = "transform 0.5s ease, opacity 0.5s ease";
    inner.style.transform  = "translateY(-6px)";
    inner.style.opacity    = "0";

    setTimeout(function() {
      textEl.textContent = entry.shortText;

      inner.style.transition = "none";
      inner.style.transform  = "translateY(6px)";
      inner.style.opacity    = "0";

      void inner.offsetHeight;

      inner.style.transition = "transform 0.6s ease, opacity 0.6s ease";
      inner.style.transform  = "translateY(0)";
      inner.style.opacity    = "1";
    }, 520);
  });

  /* Hiển thị ngay nếu đã có lịch sử */
  const existing = window.__liveNotif.getHistory();
  if (existing.length) {
    textEl.textContent    = existing[0].shortText;
    inner.style.opacity   = "1";
    inner.style.transform = "translateY(0)";
  }

  /* ── Click mở popup lịch sử ── */
  const notifEl = document.getElementById("modalLiveNotif");
  if (!notifEl) return;

  notifEl.addEventListener("click", function() {
    openNotifHistory();
  });
}

/* ===================================================
   NOTIF HISTORY POPUP
=================================================== */
function openNotifHistory() {
  const overlay  = document.getElementById("notifHistoryOverlay");
  const list     = document.getElementById("notifHistoryList");
  const closeBtn = document.getElementById("notifHistoryClose");
  if (!overlay || !list) return;

  const historyData = window.__liveNotif.getHistory();

  if (!historyData.length) {
    list.innerHTML = `<div style="padding:20px 16px; color:#aaa; font-size:13px; text-align:center;">Chưa có dữ liệu.</div>`;
  } else {
    list.innerHTML = historyData.map(function(entry) {
      return `
        <div class="notif-history-item">
          <span class="notif-history-icon">🛍</span>
          <div class="notif-history-body">
            <div class="notif-history-name">${entry.name}</div>
            <div class="notif-history-detail">${entry.detail}</div>
          </div>
          <div class="notif-history-time">${window.__liveNotif.formatTimeAgo(entry.ts)}</div>
        </div>
      `;
    }).join("");
  }

  overlay.classList.add("show");
  document.body.style.overflow = "hidden";

  function close() {
    overlay.classList.remove("show");
    document.body.style.overflow = "auto";
  }

  closeBtn.onclick          = close;
  overlay.onclick           = function(e) { if (e.target === overlay) close(); };
}

/* ===================================================
   KHỞI CHẠY
=================================================== */
(function init() {
  loadCartItems();
  buildFullGallery();
  renderReviews();
  setupReviewMediaLightbox();
  initLazyVideos();
  renderCartSummary();
  updateQtyDisplay();
  updateCartBadge();
  initModalLiveNotif();

  document.querySelectorAll(".combo-option").forEach(btn => {
    btn.addEventListener("click", () => updatePriceDisplay());
  });
})();
