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

let selectedProvinceCode = "";
let selectedProvinceName = "";
let allProvinces         = [];

/* ===================================================
   DOM REFS
=================================================== */
const slidesEl           = document.getElementById("slides");
const dotsEl             = document.getElementById("dots");
const thumbsEl           = document.getElementById("thumbs");
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
const districtSelect     = document.getElementById("district");
const wardSelect         = document.getElementById("ward");
const districtWardWrap   = document.getElementById("districtWardWrap");

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
   LƯU fbclid RAW
=================================================== */
(function () {
  const fbclid = getQueryParam("fbclid");
  if (fbclid) {
    sessionStorage.setItem("fbclid_raw", fbclid);
  }
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
   GALLERY
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
      slide.innerHTML = `<img src="${src}" alt="${label}" loading="${eager}" fetchpriority="${fp}" decoding="async" width="600" height="600" />`;
    }
    slidesEl.appendChild(slide);

    const capturedIndex = index;
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.addEventListener("click", () => goToSlide(capturedIndex));
    dotsEl.appendChild(dot);

    const thumbSrc = isVideo
      ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='62' height='62'%3E%3Crect width='62' height='62' fill='%23eef2f7'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='%23aaa'%3E%E2%96%B6%3C/text%3E%3C/svg%3E"
      : src;

    const thumb = document.createElement("img");
    thumb.className = "thumb";
    thumb.src       = thumbSrc;
    thumb.alt       = label;
    thumb.loading   = "lazy";
    thumb.decoding  = "async";
    thumb.width     = 62;
    thumb.height    = 62;
    thumb.addEventListener("click", () => goToSlide(capturedIndex));
    thumbsEl.appendChild(thumb);
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
  goToSlide(0);
}

function updateSlider() {
  slidesEl.style.transform = `translateX(-${currentSlide * 100}%)`;
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
  document.querySelectorAll("#thumbs .thumb").forEach((thumb, i) => {
    thumb.classList.toggle("active", i === currentSlide);
  });
  const active = document.querySelectorAll("#thumbs .thumb")[currentSlide];
  if (active) active.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
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
   CART — localStorage (key theo slug SP)
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

function addCurrentSelectionToCart() {
  loadCartItems();
  const existingIndex = cartItems.findIndex(item => item.product_id === PRODUCT.id);
  if (existingIndex > -1) {
    cartItems[existingIndex].quantity += quantity;
    cartItems[existingIndex].total = cartItems[existingIndex].quantity * PRODUCT.price;
  } else {
    cartItems.push({
      product_id:   PRODUCT.id,
      product_name: PRODUCT.name,
      quantity:     quantity,
      price:        PRODUCT.price,
      total:        PRODUCT.price * quantity
    });
  }
  saveCartItems();
}

function getActiveItems() {
  return checkoutMode === "buynow" ? buyNowItems : cartItems;
}

function getActiveSubTotal() {
  return getActiveItems().reduce((sum, item) => sum + item.total, 0);
}

function getActiveGrandTotal() {
  return getActiveSubTotal();
}

/* ===================================================
   RENDER CART SUMMARY
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

  cartSummaryList.innerHTML = activeItems.map((item, idx) => `
    <div class="cart-item">
      <div class="cart-item-top">${item.product_name}</div>
      <div class="cart-item-controls">
        <button class="cart-qty-btn" data-action="minus" data-idx="${idx}">−</button>
        <span class="cart-qty-display">${item.quantity}</span>
        <button class="cart-qty-btn" data-action="plus" data-idx="${idx}">+</button>
        <button class="cart-remove-btn" data-action="remove" data-idx="${idx}">🗑 Xoá</button>
      </div>
      <div class="cart-item-price">${formatPrice(item.total)}</div>
    </div>
  `).join("");

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

      if (checkoutMode === "cart") {
        saveCartItems();
      }

      renderCartSummary();
    });
  });
}

function updateSubmitBtnPrice() {
  const total = getActiveGrandTotal();
  if (!submitBtn.disabled || total > 0) {
    submitBtn.innerHTML = `🔒 XÁC NHẬN ĐẶT HÀNG · ${formatPrice(total)}`;
  }
}

/* ===================================================
   OPEN CHECKOUT — InitiateCheckout
=================================================== */
function openCheckout() {
  renderCartSummary();
  checkFormValidity();

  const eid = genEventId();

  if (typeof fbq !== "undefined") {
    fbq('track', 'InitiateCheckout', {
      content_name: PRODUCT.name,
      content_ids:  [PRODUCT.id],
      content_type: 'product',
      value:        getActiveGrandTotal(),
      currency:     PRODUCT.currency
    }, {
      eventID:     eid,
      external_id: EXTERNAL_ID
    });
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
   CTA EVENTS
=================================================== */

/* Thêm vào giỏ */
inlineAddToCartBtn.addEventListener("click", () => {
  addCurrentSelectionToCart();

  const eid = genEventId();

  if (typeof fbq !== "undefined") {
    fbq('track', 'AddToCart', {
      content_name: PRODUCT.name,
      content_ids:  [PRODUCT.id],
      content_type: 'product',
      value:        PRODUCT.price * quantity,
      currency:     PRODUCT.currency
    }, {
      eventID:     eid,
      external_id: EXTERNAL_ID
    });
  }

  sendToGAS({
    ...buildBasePayload({ add_to_cart_event_id: eid }),
    event_type:         "add_to_cart",
    value:              PRODUCT.price * quantity,
    external_id:        EXTERNAL_ID,
    external_id_hashed: false
  });

  showToast("✓ Đã thêm vào giỏ hàng");
});

/* Giỏ hàng */
goToCartBtn.addEventListener("click", () => {
  loadCartItems();
  if (!cartItems.length) {
    showToast("Giỏ hàng trống");
    return;
  }
  checkoutMode = "cart";
  openCheckout();
});

/* Mua ngay (bottom bar) */
buyNowBtn.addEventListener("click", () => {
  checkoutMode = "buynow";
  buyNowItems = [{
    product_id:   PRODUCT.id,
    product_name: PRODUCT.name,
    quantity:     quantity,
    price:        PRODUCT.price,
    total:        PRODUCT.price * quantity
  }];
  openCheckout();
});

/* Mua ngay (inline) */
inlineBuyNowBtn.addEventListener("click", () => {
  checkoutMode = "buynow";
  buyNowItems = [{
    product_id:   PRODUCT.id,
    product_name: PRODUCT.name,
    quantity:     quantity,
    price:        PRODUCT.price,
    total:        PRODUCT.price * quantity
  }];
  openCheckout();
});

/* ===================================================
   COUNTDOWN
=================================================== */
let countdownSeconds = 15 * 60;
const countdownEl    = document.getElementById("countdown");

setInterval(() => {
  const m = Math.floor(countdownSeconds / 60);
  const s = countdownSeconds % 60;
  countdownEl.textContent = `${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
  if (countdownSeconds > 0) countdownSeconds--;
}, 1000);

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
  } else if (raw.length < 10) {
    clearFieldError("phone", "phoneError");
  } else {
    clearFieldError("phone", "phoneError");
  }

  checkFormValidity();
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
  const pairs = [
    ["fullName", "fullNameError"],
    ["phone", "phoneError"],
    ["provinceDisplay", "provinceError"],
    ["district", "districtError"],
    ["ward", "wardError"],
    ["address", "addressError"]
  ];
  pairs.forEach(([fid, eid]) => clearFieldError(fid, eid));
  document.getElementById("provinceDisplay").classList.remove("input-error");
}

/* ===================================================
   Check form validity
=================================================== */
function getPhoneRaw() {
  return phoneInput.value.replace(/\D/g, "");
}

function isFormValid() {
  const fullName     = document.getElementById("fullName").value.trim();
  const phoneRaw     = getPhoneRaw();
  const address      = document.getElementById("address").value.trim();
  const provinceName = selectedProvinceName;
  const districtVal  = districtSelect.value;
  const wardVal      = wardSelect.value;

  const phoneRegex = /^(0[35789])[0-9]{8}$/;

  if (!fullName) return false;
  if (!phoneRegex.test(phoneRaw)) return false;
  if (!provinceName) return false;
  if (!districtVal) return false;
  if (!wardVal) return false;
  if (!address) return false;

  return true;
}

function checkFormValidity() {
  submitBtn.disabled = !isFormValid();
}

document.getElementById("fullName").addEventListener("input", checkFormValidity);
document.getElementById("address").addEventListener("input", checkFormValidity);
districtSelect.addEventListener("change", checkFormValidity);
wardSelect.addEventListener("change", checkFormValidity);

/* ===================================================
   SEARCHABLE PROVINCE DROPDOWN
=================================================== */
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function renderProvinceList(list) {
  const container = document.getElementById("provinceList");
  if (!list.length) {
    container.innerHTML = '<div class="searchable-option no-result">Không tìm thấy tỉnh phù hợp</div>';
    return;
  }
  container.innerHTML = list.map(p =>
    `<div class="searchable-option" data-code="${p.code}" data-name="${p.name}">${p.name}</div>`
  ).join("");

  container.querySelectorAll(".searchable-option:not(.no-result)").forEach(opt => {
    opt.addEventListener("click", () => {
      selectProvince(opt.dataset.code, opt.dataset.name);
    });
  });
}

function filterProvinces() {
  const keyword = document.getElementById("provinceSearch").value.trim();
  if (!keyword) {
    renderProvinceList(allProvinces);
    return;
  }
  const normalized = removeDiacritics(keyword);
  const result = allProvinces.filter(p => {
    const fullName = removeDiacritics(p.name);
    const shortName = fullName.replace(/^(tinh |thanh pho |tp\. |tp )/i, "").trim();
    return fullName.startsWith(normalized) || shortName.startsWith(normalized);
  });

  renderProvinceList(result);
}

function toggleProvinceDropdown() {
  const dropdown = document.getElementById("provinceDropdown");
  const arrow    = document.getElementById("provinceArrow");
  const display  = document.getElementById("provinceDisplay");
  const isOpen   = dropdown.classList.contains("open");

  if (isOpen) {
    closeProvinceDropdown();
  } else {
    dropdown.classList.add("open");
    arrow.classList.add("open");
    display.classList.add("open");

    if (allProvinces.length === 0) {
      document.getElementById("provinceList").innerHTML =
        '<div class="searchable-option no-result">Đang tải danh sách tỉnh...</div>';
      loadProvinces().then(() => renderProvinceList(allProvinces));
    } else {
      renderProvinceList(allProvinces);
    }

    setTimeout(() => document.getElementById("provinceSearch").focus(), 50);
  }
}

function closeProvinceDropdown() {
  document.getElementById("provinceDropdown").classList.remove("open");
  document.getElementById("provinceArrow").classList.remove("open");
  document.getElementById("provinceDisplay").classList.remove("open");
  document.getElementById("provinceSearch").value = "";
}

function selectProvince(code, name) {
  selectedProvinceCode = code;
  selectedProvinceName = name;
  document.getElementById("provinceCode").value = code;
  document.getElementById("provinceName").value  = name;

  const display = document.getElementById("provinceDisplay");
  display.textContent = name;
  display.classList.remove("placeholder");
  closeProvinceDropdown();

  districtWardWrap.classList.add("show");

  districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
  districtSelect.disabled  = true;
  wardSelect.innerHTML     = '<option value="">-- Chọn Xã/Phường --</option>';
  wardSelect.disabled      = true;

  loadDistricts(code);
  checkFormValidity();
}

document.addEventListener("click", function(e) {
  const wrap = document.getElementById("provinceSelectWrap");
  if (wrap && !wrap.contains(e.target)) closeProvinceDropdown();
});

/* ===================================================
   LOAD PROVINCES
=================================================== */
async function loadProvinces() {
  try {
    const res  = await fetch("https://provinces.open-api.vn/api/?depth=1");
    const data = await res.json();
    data.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    allProvinces = data.map(p => ({ code: p.code, name: p.name }));
  } catch (err) {
    console.warn("Không tải được danh sách tỉnh:", err);
    allProvinces = [];
  }
}

/* ===================================================
   CASCADE DROPDOWN — DISTRICT & WARD
=================================================== */
async function loadDistricts(provinceCode) {
  try {
    const res  = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await res.json();
    (data.districts || [])
      .sort((a, b) => a.name.localeCompare(b.name, "vi"))
      .forEach(d => {
        const opt = document.createElement("option");
        opt.value       = d.code;
        opt.textContent = d.name;
        districtSelect.appendChild(opt);
      });
    districtSelect.disabled = false;
  } catch (err) {
    console.warn("Không tải được danh sách huyện:", err);
  }
}

districtSelect.addEventListener("change", async () => {
  wardSelect.innerHTML = '<option value="">-- Chọn Xã/Phường --</option>';
  wardSelect.disabled  = true;

  const code = districtSelect.value;
  if (!code) return;

  try {
    const res  = await fetch(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
    const data = await res.json();
    (data.wards || [])
      .sort((a, b) => a.name.localeCompare(b.name, "vi"))
      .forEach(w => {
        const opt = document.createElement("option");
        opt.value       = w.code;
        opt.textContent = w.name;
        wardSelect.appendChild(opt);
      });
    wardSelect.disabled = false;
  } catch (err) {
    console.warn("Không tải được danh sách xã:", err);
  }
});

/* ===================================================
   ORDER FORM SUBMIT — Purchase
=================================================== */
document.getElementById("orderForm").addEventListener("submit", async e => {
  e.preventDefault();
  clearAllFieldErrors();

  try {
    const fullName     = document.getElementById("fullName").value.trim();
    const phoneRaw     = getPhoneRaw();
    const address      = document.getElementById("address").value.trim();
    const orderNote    = document.getElementById("orderNote").value.trim();
    const wardEl       = document.getElementById("ward");
    const districtEl   = document.getElementById("district");
    const wardName     = wardEl.options[wardEl.selectedIndex]?.text     || "";
    const districtName = districtEl.options[districtEl.selectedIndex]?.text || "";
    const provinceName = selectedProvinceName;

    let hasError = false;

    if (!fullName) {
      showFieldError("fullName", "fullNameError", "Vui lòng nhập họ tên");
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

    if (!provinceName) {
      document.getElementById("provinceDisplay").classList.add("input-error");
      showFieldError("provinceDisplay", "provinceError", "Vui lòng chọn tỉnh/thành phố");
      hasError = true;
    }

    if (!districtEl.value || districtName === "-- Chọn Quận/Huyện --") {
      showFieldError("district", "districtError", "Vui lòng chọn quận/huyện");
      hasError = true;
    }

    if (!wardEl.value || wardName === "-- Chọn Xã/Phường --") {
      showFieldError("ward", "wardError", "Vui lòng chọn xã/phường");
      hasError = true;
    }

    if (!address) {
      showFieldError("address", "addressError", "Vui lòng nhập địa chỉ chi tiết");
      hasError = true;
    }

    if (hasError) return;

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

    const payload = {
      ...buildBasePayload({ purchase_event_id: purchaseEventId }),
      event_type:         "purchase",
      items:              activeItems,
      quantity:           activeItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal:           getActiveSubTotal(),
      total:              finalGrandTotal,
      value:              finalGrandTotal,
      hashed_phone:       hashedPhone,
      external_id:        EXTERNAL_ID,
      external_id_hashed: false,
      note:               orderNote,
      customer: {
        full_name: fullName,
        phone:     phoneRaw,
        address,
        ward:      wardName,
        district:  districtName,
        province:  provinceName
      }
    };

    document.getElementById("orderForm").reset();

    selectedProvinceCode = "";
    selectedProvinceName = "";
    document.getElementById("provinceCode").value = "";
    document.getElementById("provinceName").value  = "";
    const display = document.getElementById("provinceDisplay");
    display.textContent = "-- Chọn Tỉnh/Thành Phố --";
    display.classList.add("placeholder");

    districtSelect.innerHTML = '<option value="">-- Chọn Quận/Huyện --</option>';
    districtSelect.disabled  = true;
    wardSelect.innerHTML     = '<option value="">-- Chọn Xã/Phường --</option>';
    wardSelect.disabled      = true;
    districtWardWrap.classList.remove("show");

    quantity = 1;
    updateQtyDisplay();

    if (checkoutMode === "cart") {
      localStorage.removeItem(CART_KEY);
      cartItems = [];
    } else {
      buyNowItems = [];
    }

    renderCartSummary();
    hideModal();
    openThankModal();

    submitBtn.disabled    = false;
    submitBtn.innerHTML   = `🔒 XÁC NHẬN ĐẶT HÀNG · ${formatPrice(PRODUCT.price)}`;

    setTimeout(() => {
      fetch(GAS_URL, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
      }).catch(() => {});

      if (typeof fbq !== "undefined") {
        fbq('track', 'Purchase', {
          content_name: PRODUCT.name,
          content_ids:  [PRODUCT.id],
          content_type: 'product',
          value:        finalGrandTotal,
          currency:     PRODUCT.currency
        }, {
          eventID:     purchaseEventId,
          external_id: EXTERNAL_ID
        });
      }

    }, 0);

  } catch (err) {
    console.error("Submit error:", err);
    submitBtn.disabled  = false;
    submitBtn.innerHTML = `🔒 XÁC NHẬN ĐẶT HÀNG · ${formatPrice(PRODUCT.price)}`;
    statusMessage.style.color = "red";
    statusMessage.textContent = "Có lỗi xảy ra, vui lòng thử lại.";
  }
});

/* ===================================================
   REVIEWS
=================================================== */
function renderStars(stars) {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

function renderReviewMedia(media) {
  if (!media || !media.length) return "";
  return `
    <div class="review-media">
      ${media.map(item => {
        const isVideo = item.toLowerCase().includes(".mp4");
        return isVideo
          ? `<div class="review-media-item" data-type="video" data-src="${item}" style="position:relative; cursor:pointer;">
              <video playsinline preload="metadata" muted style="width:100%; height:100%; object-fit:cover; border-radius:8px; pointer-events:none;">
                <source src="${item}" type="video/mp4">
              </video>
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;background:rgba(0,0,0,0.2);border-radius:8px;">▶</div>
            </div>`
          : `<img class="review-media-item" data-type="image" data-src="${item}" src="${item}" loading="lazy" decoding="async" style="cursor:pointer;" />`;
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
          ${renderReviewMedia(review.media)}
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
    const type = target.dataset.type;
    const src  = target.dataset.src;
    if (!type || !src) return;

    lightboxContent.querySelectorAll("img, video").forEach(el => el.remove());

    let mediaEl;
    if (type === "video") {
      mediaEl             = document.createElement("video");
      mediaEl.src         = src;
      mediaEl.controls    = true;
      mediaEl.autoplay    = true;
      mediaEl.playsInline = true;
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

  closeBtn.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
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
   KHỞI CHẠY
=================================================== */
(function init() {
  loadCartItems();
  buildFullGallery();
  renderReviews();
  setupReviewMediaLightbox();
  renderCartSummary();
  updateQtyDisplay();
})();
