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

/* ===================================================
   SEO / OPEN GRAPH
=================================================== */
function setMeta(selector, value) {
  const el = document.querySelector(selector);
  if (el && value) el.setAttribute("content", value);
}

function updateSeoMeta() {
  const seo = PRODUCT_CONFIG.seo || {};

  const title = seo.title || PRODUCT_CONFIG.name || "";
  const description = seo.description || PRODUCT_CONFIG.description || "";
  const image = seo.ogImage || (PRODUCT_CONFIG.images && PRODUCT_CONFIG.images[0]) || "";
  const url = window.location.href;

  document.title = title;

  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', image);
  setMeta('meta[property="og:url"]', url);

  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);
  setMeta('meta[name="twitter:image"]', image);
}

updateSeoMeta();

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

const viewContentEventId = generateEventId();

fbq('track', 'ViewContent', {
  content_name: PRODUCT_CONFIG.name,
  content_category: PRODUCT_CONFIG.category,
  content_ids: [PRODUCT_CONFIG.id],
  content_type: 'product',
  value: PRODUCT_CONFIG.price,
  currency: PRODUCT_CONFIG.currency
}, {
  eventID: viewContentEventId,
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
let waterBottleUpsellLoadPromise = null;

function ensureWaterBottleUpsellLoaded() {
  if (window.NinoWaterBottleUpsell) {
    return Promise.resolve(true);
  }

  if (waterBottleUpsellLoadPromise) {
    return waterBottleUpsellLoadPromise;
  }

  waterBottleUpsellLoadPromise = new Promise(resolve => {
    const existingScript = document.querySelector('script[data-nino-upsell="water-bottle"]');

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(!!window.NinoWaterBottleUpsell), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "/js/water-bottle-upsell.js?v=3";
    script.async = true;
    script.dataset.ninoUpsell = "water-bottle";

    script.onload = () => resolve(!!window.NinoWaterBottleUpsell);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

  return waterBottleUpsellLoadPromise;
}

/* ===================================================
   DISCOUNT — MÃ GIẢM GIÁ + NGUỒN ĐƠN
=================================================== */
const DISCOUNT_CONFIG = window.DISCOUNT_CODES || {};
const ORDER_SOURCE_CONFIG = window.ORDER_SOURCES || {};

let appliedDiscountCode = "";
let appliedDiscountAmount = 0;
let appliedDiscountSource = "";
let discountFromUrl = false;
let detectedOrderSource = "";
let nino2PopupTimer = null;
let checkoutOpenedOnce = false;
let nino2PopupShown = false;
let nino2PopupDismissed = false;
let urlDiscountPopupShown = false;
let urlDiscountPopupTimer = null;

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
   CHECKOUT ADDRESS — Tỉnh / Huyện / Xã | Số nhà
=================================================== */
const checkoutAddressField   = document.getElementById("checkoutAddressField");
const checkoutLocationDisplay = document.getElementById("checkoutLocationDisplay");
const checkoutLocationText   = document.getElementById("checkoutLocationText");
const checkoutLocationMenu   = document.getElementById("checkoutLocationMenu");
const streetAddressInput     = document.getElementById("streetAddress");
const checkoutFullAddressPreview = document.getElementById("checkoutFullAddressPreview");

const addressInput  = document.getElementById("address");
const provinceInput = document.getElementById("province");
const districtInput = document.getElementById("district");
const wardInput     = document.getElementById("ward");

let checkoutProvincesData = [];
let checkoutProvinceLoadStatus = "idle"; // idle | loading | success | error
let checkoutProvinceLoadPromise = null;

let selectedProvince = null;
let selectedDistrict = null;
let selectedWard = null;

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

function generateClientOrderId() {
  const now = new Date();

  return "DH"
    + now.getFullYear().toString().slice(-2)
    + String(now.getMonth() + 1).padStart(2, "0")
    + String(now.getDate()).padStart(2, "0")
    + String(now.getHours()).padStart(2, "0")
    + String(now.getMinutes()).padStart(2, "0")
    + String(now.getSeconds()).padStart(2, "0");
}

function formatPrice(num) {
  return num.toLocaleString("vi-VN") + "đ";
}

function normalizeDiscountCode(code) {
  return String(code || "").trim().toLowerCase();
}

function getDiscountConfig(code) {
  const normalizedCode = normalizeDiscountCode(code);
  const cfg = DISCOUNT_CONFIG[normalizedCode] || null;

  if (!cfg) return null;
  if (cfg.enabled !== true) return null;

  return cfg;
}

function isDiscountEnabled(code) {
  return !!getDiscountConfig(code);
}

function getDisplayDiscountCode(code) {
  return String(code || "").trim().toUpperCase();
}

function normalizeOrderSource(source) {
  return String(source || "").trim().toLowerCase();
}

function getUrlParts() {
  const params = new URLSearchParams(window.location.search);

  const rawFromQuery = params.get("p") || "";
  const rawFromPath = (window.location.pathname || "")
    .replace(/^\/+|\/+$/g, "");

  const rawRoute = rawFromQuery || rawFromPath;
  const cleanRoute = decodeURIComponent(rawRoute);

  const parts = cleanRoute
    .split("+")
    .map(p => p.trim())
    .filter(Boolean);

  return {
    productSlug: parts[0] || "",
    discountCode: parts[1] || "",
    orderSource: parts[2] || ""
  };
}

function detectOrderSourceFromUrl() {
  const source = normalizeOrderSource(getUrlParts().orderSource);

  if (!source) return "";

  if (ORDER_SOURCE_CONFIG[source]) {
    return source;
  }

  return "";
}

function getDiscountBaseAmount() {
  const subtotal = Number(getActiveSubTotal() || 0);

  if (subtotal > 0) {
    return subtotal;
  }

  return Number(getCurrentPrice() || 0);
}

function calculateDiscountAmount(code, subtotal) {
  const cfg = getDiscountConfig(code);
  if (!cfg) return 0;

  const safeSubtotal = Math.max(0, Number(subtotal || 0));

  if (cfg.type === "fixed") {
    return Math.min(cfg.value, safeSubtotal);
  }

  if (cfg.type === "percent") {
    return Math.floor(safeSubtotal * cfg.value / 100);
  }

  return 0;
}

function applyDiscountCode(code, source) {
  const normalizedCode = normalizeDiscountCode(code);
  const cfg = getDiscountConfig(normalizedCode);

  if (!cfg) {
    return { success: false, message: "Mã giảm giá không hợp lệ." };
  }

  const discountBase = getDiscountBaseAmount();
  const discountAmount = calculateDiscountAmount(normalizedCode, discountBase);

  appliedDiscountCode = getDisplayDiscountCode(normalizedCode);
  appliedDiscountAmount = discountAmount;
  appliedDiscountSource = source || "manual";

  if (appliedDiscountSource === "url") {
    discountFromUrl = true;
  }

  syncDiscountInputs();
  renderDiscountUI();

  return {
    success: true,
    code: normalizedCode,
    amount: discountAmount
  };
}

function clearDiscountCode() {
  appliedDiscountCode = "";
  appliedDiscountAmount = 0;
  appliedDiscountSource = "";
  discountFromUrl = false;

  syncDiscountInputs();
  renderDiscountUI();
}

function getActiveDiscountAmount() {
  if (!appliedDiscountCode) return 0;

  const discountBase = getDiscountBaseAmount();
  appliedDiscountAmount = calculateDiscountAmount(appliedDiscountCode, discountBase);

  return appliedDiscountAmount;
}

function syncDiscountInputs() {
  document.querySelectorAll("[data-discount-input]").forEach(input => {
    input.value = appliedDiscountCode || "";
  });
}

function renderDiscountUI() {
  const discountAmount = getActiveDiscountAmount();

  document.querySelectorAll("[data-discount-code-text]").forEach(el => {
    el.textContent = appliedDiscountCode || "";
  });

  document.querySelectorAll("[data-discount-amount-text]").forEach(el => {
    el.textContent = discountAmount > 0 ? "-" + formatPrice(discountAmount) : "";
  });

  document.querySelectorAll("[data-discount-row]").forEach(el => {
    el.style.display = discountAmount > 0 ? "" : "none";
  });

  document.querySelectorAll("[data-price-after-discount]").forEach(el => {
    const priceAfterDiscount = Math.max(0, getCurrentPrice() - discountAmount);
    el.textContent = formatPrice(priceAfterDiscount);
  });
}

function detectDiscountCodeFromUrl() {
  return normalizeDiscountCode(getUrlParts().discountCode);
}

function initDiscountFromUrl() {
  const codeFromUrl = detectDiscountCodeFromUrl();

  if (!codeFromUrl) return;

  const result = applyDiscountCode(codeFromUrl, "url");

  if (result.success) {
    discountFromUrl = true;
  }
}

function showUrlDiscountPopup() {
  if (!isDiscountEnabled("nino3")) return;
  if (!appliedDiscountCode || appliedDiscountCode !== "NINO3") return;
  if (document.getElementById("urlDiscountPopupOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "urlDiscountPopupOverlay";
  overlay.className = "discount-gift-overlay";
  overlay.innerHTML = `
    <div class="discount-gift-popup">
      <div class="discount-gift-badge">🎁 Ưu đãi hôm nay</div>
      <div class="discount-gift-title">
        Bạn nhận được mã giảm giá
        <span class="discount-money">💵 30.000đ</span>
      </div>
      <div class="discount-gift-desc">
        Mã giảm giá này chỉ có hiệu lực trong hôm nay.
      </div>
      <div class="discount-gift-code">NINO3</div>
      <div class="discount-gift-actions">
        <button type="button" class="discount-gift-btn discount-gift-use" id="urlDiscountUseBtn">
          Sử dụng mã
        </button>
        <button type="button" class="discount-gift-btn discount-gift-ok" id="urlDiscountOkBtn">
          OK
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  function closePopup() {
    overlay.classList.remove("show");
    document.body.style.overflow = "auto";

    setTimeout(() => {
      overlay.remove();
    }, 180);
  }

  const useBtn = document.getElementById("urlDiscountUseBtn");
  const okBtn = document.getElementById("urlDiscountOkBtn");

  useBtn.addEventListener("click", () => {
    applyDiscountCode("NINO3", "url");
    closePopup();

    if (window.__variantPopup && typeof window.__variantPopup.open === "function") {
      setTimeout(() => {
        window.__variantPopup.open();
      }, 220);
    }
  });

  okBtn.addEventListener("click", () => {
    applyDiscountCode("NINO3", "url");
    closePopup();
  });

  overlay.addEventListener("click", e => {
    if (e.target === overlay) {
      closePopup();
    }
  });
}

function maybeShowUrlDiscountPopup() {
  if (!isDiscountEnabled("nino3")) return;
  if (!discountFromUrl) return;
  if (appliedDiscountCode !== "NINO3") return;
  if (urlDiscountPopupShown) return;
  if (document.getElementById("urlDiscountPopupOverlay")) return;

  urlDiscountPopupShown = true;
  showUrlDiscountPopup();
}

function startUrlDiscountPopupTimer() {
  if (!isDiscountEnabled("nino3")) return;
  if (!discountFromUrl) return;
  if (appliedDiscountCode !== "NINO3") return;
  if (urlDiscountPopupShown) return;

  if (urlDiscountPopupTimer) {
    clearTimeout(urlDiscountPopupTimer);
  }

  urlDiscountPopupTimer = setTimeout(() => {
    maybeShowUrlDiscountPopup();
  }, 2000);
}

function initUrlDiscountPopupOnPriceSection() {
  if (!isDiscountEnabled("nino3")) return;
  const reviewSection = document.querySelector(".review-section");
  if (!reviewSection) return;

  function checkReviewReached() {
    if (!discountFromUrl) return;
    if (appliedDiscountCode !== "NINO3") return;
    if (urlDiscountPopupShown) return;

    const rect = reviewSection.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.85;

    if (rect.top <= triggerPoint) {
      maybeShowUrlDiscountPopup();
      window.removeEventListener("scroll", checkReviewReached);
    }
  }

  window.addEventListener("scroll", checkReviewReached, { passive: true });
  checkReviewReached();
}

function startNino2GiftTimer() {
  if (!isDiscountEnabled("nino2")) return;
  if (discountFromUrl) return;
  if (appliedDiscountCode) return;
  if (nino2PopupShown) return;
  if (nino2PopupDismissed) return;

  if (nino2PopupTimer) {
    clearTimeout(nino2PopupTimer);
  }

  nino2PopupTimer = setTimeout(() => {
    if (discountFromUrl) return;
    if (appliedDiscountCode) return;
    if (nino2PopupShown) return;
    if (nino2PopupDismissed) return;

    const orderModal = document.getElementById("orderModal");
    const isCheckoutOpen = orderModal && orderModal.classList.contains("show");

    if (isCheckoutOpen) return;

    showNino2GiftPopup();
  }, 10000);
}

function stopNino2GiftTimer() {
  if (nino2PopupTimer) {
    clearTimeout(nino2PopupTimer);
    nino2PopupTimer = null;
  }
}

function showNino2GiftPopup(source) {
  if (!isDiscountEnabled("nino2")) return;
  if (discountFromUrl) return;
  if (appliedDiscountCode) return;
  if (nino2PopupShown) return;
  if (nino2PopupDismissed) return;
  if (document.getElementById("nino2GiftPopupOverlay")) return;

  nino2PopupShown = true;

  const overlay = document.createElement("div");
  overlay.id = "nino2GiftPopupOverlay";
  overlay.className = "discount-gift-overlay";
  overlay.innerHTML = `
    <div class="discount-gift-popup discount-gift-popup-small">
      <button type="button" class="discount-gift-close" id="nino2GiftCloseBtn">×</button>
      <div class="discount-gift-badge">⚡ Ưu đãi vừa mở khóa</div>
      <div class="discount-gift-title">
        Giảm ngay
        <span class="discount-money">💵 20.000đ</span>
        cho đơn hôm nay
      </div>
      <div class="discount-gift-desc">
        Chỉ còn 
        <span class="discount-slot-count" id="nino2SlotCount">27</span>
        suất áp dụng trong hôm nay. Dùng mã này trước khi rời trang.
      </div>
      <div class="discount-gift-code">NINO2</div>
      <div class="discount-gift-actions">
        <button type="button" class="discount-gift-btn discount-gift-use" id="nino2GiftUseBtn">
          Sử dụng mã
        </button>
        <button type="button" class="discount-gift-btn discount-gift-ok" id="nino2GiftCancelBtn">
          Hủy
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    overlay.classList.add("show");
  });

  function animateSlotCountTo(newValue) {
    const countEl = document.getElementById("nino2SlotCount");
    if (!countEl) return;

    countEl.classList.add("is-changing");

    setTimeout(() => {
      countEl.textContent = String(newValue);
      countEl.classList.remove("is-changing");
      countEl.classList.add("is-changed");
    }, 220);
  }

  let nino2SlotCount = 27;

  setTimeout(() => {
    nino2SlotCount = 25;
    animateSlotCountTo(nino2SlotCount);

    const slotInterval = setInterval(() => {
      if (!document.getElementById("nino2GiftPopupOverlay")) {
        clearInterval(slotInterval);
        return;
      }

      if (nino2SlotCount <= 18) {
        clearInterval(slotInterval);
        return;
      }

      nino2SlotCount -= 1;
      animateSlotCountTo(nino2SlotCount);
    }, 4000);
  }, 1500);

  function closePopup(markDismissed) {
    overlay.classList.remove("show");
    document.body.style.overflow = "auto";

    if (markDismissed) {
      nino2PopupDismissed = true;
    }

    setTimeout(() => {
      overlay.remove();
    }, 180);
  }

  const useBtn = document.getElementById("nino2GiftUseBtn");
  const cancelBtn = document.getElementById("nino2GiftCancelBtn");
  const closeBtn = document.getElementById("nino2GiftCloseBtn");

  useBtn.addEventListener("click", () => {
    applyDiscountCode("NINO2", "gift_popup");
    syncDiscountInputs();
    renderDiscountUI();
    renderCartSummary();
    updateSubmitBtnPrice();

    document.querySelectorAll("[data-discount-message]").forEach(el => {
      el.textContent = "Đã áp dụng mã giảm giá.";
      el.classList.remove("is-error");
      el.classList.add("is-success");
    });

    closePopup(false);

    if (source === "checkout_exit") {
      setTimeout(() => {
        const orderModal = document.getElementById("orderModal");

        if (orderModal) {
          orderModal.classList.add("show");
          document.body.style.overflow = "hidden";
          renderCartSummary();
          updateSubmitBtnPrice();
        }
      }, 220);
    }
  });

  cancelBtn.addEventListener("click", () => {
    closePopup(true);
  });

  closeBtn.addEventListener("click", () => {
    closePopup(true);
  });

  
}

function showNino2GiftPopupOnCheckoutExit() {
  if (!isDiscountEnabled("nino2")) return;
  if (discountFromUrl) return;
  if (appliedDiscountCode) return;
  if (document.getElementById("nino2GiftPopupOverlay")) return;

  nino2PopupDismissed = false;
  nino2PopupShown = false;

  showNino2GiftPopup("checkout_exit");
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

function isValidFbc(value) {
  if (!value || typeof value !== "string") return false;

  const fbc = value.trim();

  // Format chuẩn: fb.1.[timestamp_ms].[fbclid]
  const match = /^fb\.1\.(\d{13})\.(.+)$/.exec(fbc);

  if (!match) return false;

  const timestamp = Number(match[1]);
  const fbclid = match[2];

  if (!Number.isFinite(timestamp)) return false;
  if (!fbclid || fbclid.trim() === "") return false;

  return true;
}

function buildFbcFromFbclid() {
  const fbclid = getQueryParam("fbclid");

  if (!fbclid) return null;

  // Giữ nguyên fbclid, không lowercase, không cắt chuỗi
  return "fb.1." + Date.now() + "." + fbclid;
}

function getValidFbc() {
  const cookieFbc = getCookie("_fbc");

  if (isValidFbc(cookieFbc)) {
    return cookieFbc.trim();
  }

  if (!cookieFbc) {
    const generatedFbc = buildFbcFromFbclid();

    if (isValidFbc(generatedFbc)) {
      return generatedFbc;
    }
  }

  return null;
}

function generateEventId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
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
  const displayTotal = total > 99 ? "99+" : total;

  /* Bottom bar cart button */
  if (goToCartBtn) {
    goToCartBtn.classList.toggle("show", total > 0);
  }

  if (cartBadge) {
    if (total > 0) {
      cartBadge.textContent = displayTotal;
      cartBadge.classList.add("show");
    } else {
      cartBadge.textContent = "";
      cartBadge.classList.remove("show");
    }
  }

  /* Variant popup cart badge */
  const vpBadge = document.getElementById("vpCartBadge");
  if (vpBadge) {
    if (total > 0) {
      vpBadge.textContent = displayTotal;
      vpBadge.classList.add("show");
    } else {
      vpBadge.textContent = "";
      vpBadge.classList.remove("show");
    }
  }

  /* Combo popup cart badge */
  const cpBadge = document.getElementById("cpCartBadge");
  if (cpBadge) {
    if (total > 0) {
      cpBadge.textContent = displayTotal;
      cpBadge.classList.add("show");
    } else {
      cpBadge.textContent = "";
      cpBadge.classList.remove("show");
    }
  }
}

/* ===================================================
   LƯU fbclid RAW
=================================================== */
(function () {
  const fbclid = getQueryParam("fbclid");
  if (fbclid) sessionStorage.setItem("fbclid_raw", fbclid);
})();


initDiscountFromUrl();
detectedOrderSource = detectOrderSourceFromUrl();
/* ===================================================
   LẤY CLIENT IP
=================================================== */
fetch("https://api.ipify.org?format=json")
  .then(r => r.json())
  .then(d => { clientIp = d.ip; })
  .catch(() => {})
  .finally(() => {
    sendViewContentToGAS();
  });

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
    fbc:              getValidFbc(),
    fbclid:           getQueryParam("fbclid") || null,
    utm_source:       _p.get("utm_source")   || "",
    utm_medium:       _p.get("utm_medium")   || "",
    utm_campaign:     _p.get("utm_campaign") || "",
    utm_content:      _p.get("utm_content")  || "",
    order_source:     detectedOrderSource || "",
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
  if (
    PRODUCT_CONFIG &&
    PRODUCT_CONFIG.selectedVariants &&
    Object.keys(PRODUCT_CONFIG.selectedVariants).length
  ) {
    return PRODUCT_CONFIG.selectedVariants;
  }

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
const CHECKOUT_CUSTOMER_KEY = "nino_checkout_customer";

function getCheckoutCustomerDraft() {
  try {
    return JSON.parse(localStorage.getItem(CHECKOUT_CUSTOMER_KEY)) || {};
  } catch (_) {
    return {};
  }
}

function saveCheckoutCustomerDraft() {
  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const streetInput = document.getElementById("streetAddress");

  const data = {
    full_name: fullNameInput ? fullNameInput.value.trim() : "",
    phone: phoneInput ? phoneInput.value.trim() : "",
    province: selectedProvince ? selectedProvince.name : "",
    district: selectedDistrict ? selectedDistrict.name : "",
    ward: selectedWard ? selectedWard.name : "",
    street_address: streetInput ? streetInput.value.trim() : ""
  };

  localStorage.setItem(CHECKOUT_CUSTOMER_KEY, JSON.stringify(data));
}

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
  const subtotal = getActiveSubTotal();
  const shipFee = getActiveShipFee();
  const discountAmount = getActiveDiscountAmount();

  return Math.max(0, subtotal + shipFee - discountAmount);
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

  const cartDiscountAmountForItems = getActiveDiscountAmount();
  const cartSubtotalForItems = activeItems.reduce((sum, item) => {
    return sum + Number(item.total || 0);
  }, 0);

  let remainingDiscountForItems = cartDiscountAmountForItems;

  cartSummaryList.innerHTML = activeItems.map((item, idx) => {
    const MAX_NAME  = 32;
    const rawName   = item.product_name || "";
    const shortName = rawName.length > MAX_NAME ? rawName.slice(0, MAX_NAME) + "…" : rawName;

    const metaParts = [];
    let extraBagText = "";

    if (item.variants) {
      if (item.variants.color) metaParts.push(item.variants.color);
      if (item.variants.size) metaParts.push(item.variants.size);

      if (item.variants.extra_bag_color) {
        extraBagText = "Túi học thêm màu " + item.variants.extra_bag_color;
      }
    }

    if (item.combo) metaParts.push(item.combo);

    const metaStr = metaParts.join(" · ");

    const thumb = getThumbnailForItem(item);
    const thumbHtml = thumb
      ? `<img class="cart-item-thumb" src="${thumb}" alt="${shortName}" loading="lazy" decoding="async" />`
      : `<div class="cart-item-thumb" style="display:flex;align-items:center;justify-content:center;font-size:18px;">🛍</div>`;
    let itemDiscountAmount = 0;

    if (cartDiscountAmountForItems > 0 && cartSubtotalForItems > 0) {
      if (idx === activeItems.length - 1) {
        itemDiscountAmount = remainingDiscountForItems;
      } else {
        itemDiscountAmount = Math.floor(Number(item.total || 0) / cartSubtotalForItems * cartDiscountAmountForItems);
        remainingDiscountForItems -= itemDiscountAmount;
      }
    }

    const itemTotalAfterDiscount = Math.max(0, Number(item.total || 0) - itemDiscountAmount);

    return `
    <div class="cart-item">
      ${thumbHtml}
      <div class="cart-item-body">
        <div class="cart-item-name" title="${rawName}">${shortName}</div>
        ${metaStr ? `<div class="cart-item-meta">${metaStr}</div>` : ""}
        ${extraBagText ? `<div class="cart-item-meta">${extraBagText}</div>` : ""}
        <div class="cart-item-controls">
          <button class="cart-qty-btn" data-action="minus" data-idx="${idx}">−</button>
          <span class="cart-qty-display">${item.quantity}</span>
          <button class="cart-qty-btn" data-action="plus" data-idx="${idx}">+</button>
          <button class="cart-remove-btn" data-action="remove" data-idx="${idx}">🗑 Xoá</button>
        </div>
      </div>
      <div class="cart-item-price ${itemDiscountAmount > 0 ? "is-discounted" : ""}">
        ${formatPrice(itemTotalAfterDiscount)}
      </div>
    </div>`;
  }).join("");

  const cartDiscountAmount = getActiveDiscountAmount();

  if (cartDiscountAmount > 0 && appliedDiscountCode) {
    cartSummaryList.innerHTML += `
      <div class="cart-discount-row">
        <span>Mã giảm giá ${appliedDiscountCode}</span>
        <strong>-${formatPrice(cartDiscountAmount)}</strong>
      </div>
    `;
  }


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
  const discountAmount = getActiveDiscountAmount();
  const discountCode = appliedDiscountCode;

  let discountRow = document.getElementById("summaryDiscountRow");

  if (!discountRow && grandTotalEl) {
    const totalRow = grandTotalEl.closest(".order-totals-row");

    if (totalRow) {
      discountRow = document.createElement("div");
      discountRow.id = "summaryDiscountRow";
      discountRow.className = "order-totals-row discount-row";
      discountRow.innerHTML = `
        <span>Mã giảm giá <strong id="summaryDiscountCode"></strong></span>
        <span id="summaryDiscountAmount"></span>
      `;

      totalRow.parentNode.insertBefore(discountRow, totalRow);
    }
  }

  if (discountRow) {
    const codeEl = document.getElementById("summaryDiscountCode");
    const amountEl = document.getElementById("summaryDiscountAmount");

    if (discountAmount > 0 && discountCode) {
      discountRow.style.display = "";
      if (codeEl) codeEl.textContent = discountCode;
      if (amountEl) amountEl.textContent = "-" + formatPrice(discountAmount);
    } else {
      discountRow.style.display = "none";
    }
  }
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
  if (PRODUCT_CONFIG.disableWaterBottleUpsell !== true) {
    ensureWaterBottleUpsellLoaded();
  }
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
   CHECKOUT ADDRESS LOGIC
=================================================== */
async function loadCheckoutProvinces() {
  if (!checkoutLocationText) return [];

  if (checkoutProvinceLoadStatus === "success" && checkoutProvincesData.length) {
    return checkoutProvincesData;
  }

  if (checkoutProvinceLoadPromise) {
    return checkoutProvinceLoadPromise;
  }

  checkoutProvinceLoadStatus = "loading";

  checkoutProvinceLoadPromise = fetch("https://provinces.open-api.vn/api/?depth=3")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Province API failed");
      }

      return response.json();
    })
    .then(function (data) {
      checkoutProvincesData = Array.isArray(data) ? data : [];
      checkoutProvinceLoadStatus = checkoutProvincesData.length ? "success" : "error";
      restoreCheckoutCustomerDraft();

      return checkoutProvincesData;
    })
    .catch(function () {
      checkoutProvinceLoadStatus = "error";
      checkoutProvincesData = [];
      checkoutLocationText.textContent = "Nhập địa chỉ đầy đủ bên dưới";
      checkoutLocationText.classList.add("placeholder");
      restoreCheckoutCustomerDraft();

      return [];
    })
    .finally(function () {
      checkoutProvinceLoadPromise = null;
    });

  return checkoutProvinceLoadPromise;
}

function openCheckoutLocationMenu() {
  if (!checkoutLocationMenu || !checkoutAddressField) return;
  checkoutLocationMenu.classList.add("show");
  checkoutAddressField.classList.add("active");
}

function closeCheckoutLocationMenu() {
  if (!checkoutLocationMenu || !checkoutAddressField) return;
  checkoutLocationMenu.classList.remove("show");
  checkoutAddressField.classList.remove("active");
}

function setCheckoutMenuTitle(title) {
  if (!checkoutLocationMenu) return;
  checkoutLocationMenu.innerHTML = '<div class="checkout-menu-title">' + title + '</div>';
}
function showAddressFallbackMenu() {
  if (!checkoutLocationMenu) return;

  setCheckoutMenuTitle("Không tải được tỉnh/thành");

  const option = document.createElement("div");
  option.className = "checkout-location-option";
  option.innerHTML = "Vui lòng nhập địa chỉ đầy đủ ở ô <strong>Địa chỉ chi tiết</strong> bên dưới.";

  checkoutLocationMenu.appendChild(option);
  openCheckoutLocationMenu();

  if (checkoutLocationText) {
    checkoutLocationText.textContent = "Nhập địa chỉ đầy đủ bên dưới";
    checkoutLocationText.classList.add("placeholder");
  }

  if (streetAddressInput) {
    setTimeout(function () {
      streetAddressInput.focus();
    }, 120);
  }
}

function showProvinceMenu() {
  if (!checkoutLocationMenu) return;

  if (checkoutProvinceLoadStatus !== "success" || !checkoutProvincesData.length) {
    setCheckoutMenuTitle("Đang tải tỉnh/thành...");

    const option = document.createElement("div");
    option.className = "checkout-location-option";
    option.textContent = "Vui lòng chờ giây lát";

    checkoutLocationMenu.appendChild(option);
    openCheckoutLocationMenu();

    loadCheckoutProvinces().then(function (data) {
      if (data && data.length) {
        showProvinceMenu();
        return;
      }

      showAddressFallbackMenu();
    });

    return;
  }

  setCheckoutMenuTitle("Chọn tỉnh/thành");

  checkoutProvincesData.forEach(function (province) {
    const option = document.createElement("div");
    option.className = "checkout-location-option";
    option.textContent = province.name;

    option.onclick = function () {
      selectedProvince = province;
      selectedDistrict = null;
      selectedWard = null;

      updateCheckoutAddressValue();
      saveCheckoutCustomerDraft();

      setTimeout(function () {
        showDistrictMenu();
      }, 80);
    };

    checkoutLocationMenu.appendChild(option);
  });

  openCheckoutLocationMenu();
}

function showDistrictMenu() {
  if (!checkoutLocationMenu || !selectedProvince) return;

  setCheckoutMenuTitle("Chọn quận/huyện");

  selectedProvince.districts.forEach(function (district) {
    const option = document.createElement("div");
    option.className = "checkout-location-option";
    option.textContent = district.name;

    option.onclick = function () {
      selectedDistrict = district;
      selectedWard = null;

      updateCheckoutAddressValue();
      saveCheckoutCustomerDraft();

      setTimeout(function () {
        showWardMenu();
      }, 80);
    };

    checkoutLocationMenu.appendChild(option);
  });

  openCheckoutLocationMenu();
}

function showWardMenu() {
  if (!checkoutLocationMenu || !selectedDistrict) return;

  setCheckoutMenuTitle("Chọn xã/phường");

  selectedDistrict.wards.forEach(function (ward) {
    const option = document.createElement("div");
    option.className = "checkout-location-option";
    option.textContent = ward.name;

    option.onclick = function () {
      selectedWard = ward;

      updateCheckoutAddressValue();
      saveCheckoutCustomerDraft();
      closeCheckoutLocationMenu();

      if (streetAddressInput) {
        streetAddressInput.focus();
      }
    };

    checkoutLocationMenu.appendChild(option);
  });

  openCheckoutLocationMenu();
}

function updateCheckoutLocationText() {
  if (!checkoutLocationText) return;

  let text = "";

  if (!selectedProvince) {
    text = "Chọn tỉnh/thành";
    checkoutLocationText.classList.add("placeholder");
  } else if (!selectedDistrict) {
    text = selectedProvince.name + " / Chọn huyện";
    checkoutLocationText.classList.remove("placeholder");
  } else if (!selectedWard) {
    text = selectedProvince.name + " / " + selectedDistrict.name + " / Chọn xã";
    checkoutLocationText.classList.remove("placeholder");
  } else {
    text = selectedProvince.name + " / " + selectedDistrict.name + " / " + selectedWard.name;
    checkoutLocationText.classList.remove("placeholder");
  }

  checkoutLocationText.textContent = text;
}

function updateCheckoutAddressValue() {
  const province = selectedProvince ? selectedProvince.name : "";
  const district = selectedDistrict ? selectedDistrict.name : "";
  const ward     = selectedWard ? selectedWard.name : "";
  const street   = streetAddressInput ? streetAddressInput.value.trim() : "";

  const location = [province, district, ward]
    .filter(Boolean)
    .join(" / ");

  const fullAddress = [location, street]
    .filter(Boolean)
    .join(" | ");

  if (addressInput)  addressInput.value  = fullAddress;
  if (provinceInput) provinceInput.value = province;
  if (districtInput) districtInput.value = district;
  if (wardInput)     wardInput.value     = ward;
  if (checkoutFullAddressPreview) {
    checkoutFullAddressPreview.textContent = fullAddress || "Địa chỉ đầy đủ sẽ hiển thị tại đây.";
    checkoutFullAddressPreview.classList.toggle("has-value", !!fullAddress);
  }

  updateCheckoutLocationText();

  if (fullAddress) {
    clearFieldError("address", "addressError");
  }
}

function resetCheckoutAddressUI() {
  selectedProvince = null;
  selectedDistrict = null;
  selectedWard = null;

  if (streetAddressInput) streetAddressInput.value = "";
  if (addressInput)       addressInput.value = "";
  if (provinceInput)      provinceInput.value = "";
  if (districtInput)      districtInput.value = "";
  if (wardInput)          wardInput.value = "";
  if (checkoutFullAddressPreview) {
    checkoutFullAddressPreview.textContent = "Địa chỉ đầy đủ sẽ hiển thị tại đây.";
    checkoutFullAddressPreview.classList.remove("has-value");
  }

  updateCheckoutLocationText();
  closeCheckoutLocationMenu();
}

function initCheckoutAddressPicker() {
  if (!checkoutLocationDisplay || !checkoutLocationMenu) return;

  checkoutLocationDisplay.addEventListener("click", function () {
    if (!selectedProvince) {
      showProvinceMenu();
      return;
    }

    if (!selectedDistrict) {
      showDistrictMenu();
      return;
    }

    if (!selectedWard) {
      showWardMenu();
      return;
    }

    showProvinceMenu();
  });

  document.addEventListener("click", function (event) {
    if (!event.target.closest("#checkoutAddressField")) {
      closeCheckoutLocationMenu();
    }
  });

  if (streetAddressInput) {
    streetAddressInput.addEventListener("input", function () {
      updateCheckoutAddressValue();
      saveCheckoutCustomerDraft();
    });
  }

  loadCheckoutProvinces();
}

function initCheckoutCustomerAutoSave() {
  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");

  if (fullNameInput) {
    fullNameInput.addEventListener("input", saveCheckoutCustomerDraft);
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", saveCheckoutCustomerDraft);
  }
}

function restoreCheckoutCustomerDraft() {
  const draft = getCheckoutCustomerDraft();

  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");

  if (fullNameInput && draft.full_name) {
    fullNameInput.value = draft.full_name;
  }

  if (phoneInput && draft.phone) {
    phoneInput.value = draft.phone;
  }

  if (streetAddressInput && draft.street_address) {
    streetAddressInput.value = draft.street_address;
  }

  if (!checkoutProvincesData.length) {
    updateCheckoutAddressValue();
    return;
  }

  selectedProvince = checkoutProvincesData.find(function (province) {
    return province.name === draft.province;
  }) || null;

  selectedDistrict = selectedProvince && selectedProvince.districts
    ? selectedProvince.districts.find(function (district) {
        return district.name === draft.district;
      }) || null
    : null;

  selectedWard = selectedDistrict && selectedDistrict.wards
    ? selectedDistrict.wards.find(function (ward) {
        return ward.name === draft.ward;
      }) || null
    : null;

  updateCheckoutAddressValue();
}
/* ===================================================
   Phone auto-format + validation message
=================================================== */
const phoneInput = document.getElementById("phone");

function getPhoneValidationMessage(phoneRaw) {
  const phoneRegex = /^(0[35789])[0-9]{8}$/;

  if (!phoneRaw) {
    return "Vui lòng nhập số điện thoại";
  }

  if (phoneRaw.length < 10) {
    return "Số điện thoại đang thiếu " + (10 - phoneRaw.length) + " số";
  }

  if (phoneRaw.length > 10) {
    return "Số điện thoại đang thừa " + (phoneRaw.length - 10) + " số";
  }

  if (!phoneRaw.startsWith("0")) {
    return "Số điện thoại phải bắt đầu bằng số 0";
  }

  if (!phoneRegex.test(phoneRaw)) {
    return "Số điện thoại chưa đúng, vui lòng kiểm tra lại đầu số";
  }

  return "";
}

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

  if (raw.length === 0) {
    clearFieldError("phone", "phoneError");
    return;
  }

  if (raw.length === 10) {
    const message = getPhoneValidationMessage(raw);

    if (message) {
      showFieldError("phone", "phoneError", message);
    } else {
      clearFieldError("phone", "phoneError");
    }
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
  const target = fieldId === "address" && checkoutAddressField ? checkoutAddressField : field;

  if (target) {
    target.classList.add("input-error");

    target.classList.remove("input-shake");
    void target.offsetWidth;
    target.classList.add("input-shake");
  }

  if (error) {
    error.textContent = msg;
    error.classList.add("show");
  }
}

function clearFieldError(fieldId, errorId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  const target = fieldId === "address" && checkoutAddressField ? checkoutAddressField : field;

  if (target) {
    target.classList.remove("input-error");
    target.classList.remove("input-shake");
  }

  if (error) {
    error.textContent = "";
    error.classList.remove("show");
  }
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
    updateCheckoutAddressValue();

    let address     = document.getElementById("address").value.trim();
    const province  = document.getElementById("province").value.trim();
    const district  = document.getElementById("district").value.trim();
    const ward      = document.getElementById("ward").value.trim();
    const street    = document.getElementById("streetAddress").value.trim();
    const orderNote = document.getElementById("orderNote").value.trim();

    if (!address && checkoutProvinceLoadStatus === "error" && street) {
      address = street;
    }

    let hasError = false;

    const isProvinceApiFailed = checkoutProvinceLoadStatus === "error";
    const manualAddressEnough = street.length >= 12;

    if (isProvinceApiFailed) {
      if (!manualAddressEnough) {
        showFieldError(
          "address",
          "addressError",
          "Không tải được tỉnh/thành. Vui lòng nhập địa chỉ đầy đủ vào ô địa chỉ chi tiết"
        );
        hasError = true;
      }
    } else {
      if (!province) {
        showFieldError("address", "addressError", "Vui lòng chọn Tỉnh/Thành phố");
        hasError = true;
      } else if (!district) {
        showFieldError("address", "addressError", "Vui lòng chọn Quận/Huyện");
        hasError = true;
      } else if (!ward) {
        showFieldError("address", "addressError", "Vui lòng chọn Xã/Phường");
        hasError = true;
      }
    }

    if (!fullName) {
      showFieldError("fullName", "fullNameError", "Vui lòng nhập tên người nhận");
      hasError = true;
    }

    const phoneMessage = getPhoneValidationMessage(phoneRaw);

    if (phoneMessage) {
      showFieldError("phone", "phoneError", phoneMessage);
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
    const clientOrderId = generateClientOrderId();
    const hashedPhone = await sha256(phoneRaw);
    const finalGrandTotal = getActiveGrandTotal();

    const customerData = {
      full_name: fullName,
      phone: phoneRaw,
      address: address,
      province: province,
      district: district,
      ward: ward,
      street_address: street
    };

    const payloadItems = activeItems.map(item => {
      const clean = { ...item };
      delete clean._key;

      if (clean.variants) {
        if (clean.variants.color) clean.color = clean.variants.color;
        if (clean.variants.size) clean.size = clean.variants.size;

        if (clean.variants.extra_bag_color) {
          const baseProductName =
            PRODUCT_CONFIG.sheetProductName ||
            PRODUCT_CONFIG.shortName ||
            PRODUCT.name;

          clean.product_name =
            baseProductName + " + túi học thêm màu " + clean.variants.extra_bag_color;
        }

        delete clean.variants;
      }

      return clean;
    });

    const subtotalBeforeDiscount = getActiveSubTotal();
    const discountAmount = getActiveDiscountAmount();
    const totalAfterDiscount = getActiveGrandTotal();
    const payload = {
      ...buildBasePayload({ purchase_event_id: purchaseEventId }),
      event_type: "purchase",
      order_id: clientOrderId,
      items:              payloadItems,
      quantity:           activeItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal:           subtotalBeforeDiscount,
      total:              totalAfterDiscount,
      value:              totalAfterDiscount,

      discount_code:      appliedDiscountCode || "",
      discount_amount:    discountAmount,
      subtotal_before_discount: subtotalBeforeDiscount,
      total_after_discount:     totalAfterDiscount,
      hashed_phone:       hashedPhone,
      external_id:        EXTERNAL_ID,
      external_id_hashed: false,
      note:               orderNote,
      customer:           customerData
    };

    /* Reset ghi chú, giữ lại thông tin khách đã lưu */
    document.getElementById("orderNote").value = "";
    restoreCheckoutCustomerDraft();

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

    if (PRODUCT_CONFIG.disableWaterBottleUpsell === true) {
      openThankModal();
    } else {
      await ensureWaterBottleUpsellLoaded();

      if (
        window.NinoWaterBottleUpsell &&
        typeof window.NinoWaterBottleUpsell.open === "function"
      ) {
        window.NinoWaterBottleUpsell.open({
          gasUrl: GAS_URL,
          orderId: clientOrderId,
          sheetName: payload.sheet_name || "",
          basePayload: payload,
          customer: customerData,
          items: payloadItems,
          orderTotal: totalAfterDiscount
        });
      } else {
        openThankModal();
      }
    }

    submitBtn.disabled = false;
    updateSubmitBtnPrice();

    setTimeout(() => {
      fetch(GAS_URL, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
      }).catch(fetchErr => {
        sendErrorReport("Fetch GAS thất bại: " + fetchErr.toString(), customerData, payloadItems, totalAfterDiscount);
      });

      if (typeof fbq !== "undefined") {
        fbq('track', 'Purchase', {
          content_name: PRODUCT.name,
          content_ids:  [PRODUCT.id],
          content_type: 'product',
          value:        totalAfterDiscount,
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
      full_name:      document.getElementById("fullName")?.value?.trim() || "",
      phone:          getPhoneRaw(),
      address:        document.getElementById("address")?.value?.trim() || "",
      province:       document.getElementById("province")?.value?.trim() || "",
      district:       document.getElementById("district")?.value?.trim() || "",
      ward:           document.getElementById("ward")?.value?.trim() || "",
      street_address: document.getElementById("streetAddress")?.value?.trim() || ""
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
function sendViewContentToGAS() {
  sendToGAS({
    ...buildBasePayload({ view_content_event_id: viewContentEventId }),
    event_type:         "view_content",
    value:              PRODUCT.price,
    external_id:        EXTERNAL_ID,
    external_id_hashed: false
  });
}

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

function runWhenIdle(fn, fallbackDelay) {
  if (window.requestIdleCallback) {
    requestIdleCallback(fn, { timeout: fallbackDelay || 3000 });
  } else {
    setTimeout(fn, fallbackDelay || 1000);
  }
}

/* ===================================================
   SHARED LIVE NOTIF ENGINE
   window.__liveNotif — dùng chung cho mọi nơi
=================================================== */
function initLiveNotifEngine() {
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
}

setTimeout(initLiveNotifEngine, 3500);
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

    setTimeout(() => {
      showNino2GiftPopupOnCheckoutExit();
    }, 220);
  }

  closeBtn.onclick          = close;
  overlay.onclick           = function(e) { if (e.target === overlay) close(); };
}

/* ===================================================
   EXPOSE DISCOUNT FUNCTIONS
=================================================== */
window.applyDiscountCode = applyDiscountCode;
window.clearDiscountCode = clearDiscountCode;
window.renderDiscountUI = renderDiscountUI;
window.syncDiscountInputs = syncDiscountInputs;
window.startNino2GiftTimer = startNino2GiftTimer;
window.stopNino2GiftTimer = stopNino2GiftTimer;
window.showNino2GiftPopupOnCheckoutExit = showNino2GiftPopupOnCheckoutExit;
window.startUrlDiscountPopupTimer = startUrlDiscountPopupTimer;

function bindCheckoutExitDiscountPopup() {
  const orderModal = document.getElementById("orderModal");
  const closeBtn = document.getElementById("closeModal");

  if (!orderModal || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    setTimeout(() => {
      const isOrderModalOpen = orderModal.classList.contains("show");

      if (!isOrderModalOpen) {
        showNino2GiftPopupOnCheckoutExit();
      }
    }, 250);
  });
}

/* ===================================================
   KHỞI CHẠY
=================================================== */
(function init() {
  loadCartItems();
  buildFullGallery();

  initLazyVideos();
  renderCartSummary();
  updateQtyDisplay();
  updateCartBadge();
  initModalLiveNotif();
  initCheckoutAddressPicker();
  initCheckoutCustomerAutoSave();
  restoreCheckoutCustomerDraft();

  document.querySelectorAll(".combo-option").forEach(btn => {
    btn.addEventListener("click", () => updatePriceDisplay());
  });

  bindCheckoutExitDiscountPopup();
  initUrlDiscountPopupOnPriceSection();

  runWhenIdle(function () {
    renderReviews();
    setupReviewMediaLightbox();
  }, 1500);
})();

// force reupload
