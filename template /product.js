/* ===================================================
   product.js — Bộ máy chung, không sửa file này
   Chỉ sửa CONFIG trong index.html của từng sản phẩm
=================================================== */

(function () {
  /* ---------------------------------------------------
     LẤY CONFIG TỪ index.html
  --------------------------------------------------- */
  if (typeof CONFIG === "undefined") {
    console.error("product.js: Không tìm thấy CONFIG");
    return;
  }

  const PRODUCT  = CONFIG.product;
  const TAX      = CONFIG.tax || 9000;
  const GAS_URL  = CONFIG.tracking.gasUrl;
  const FB_PIXEL = CONFIG.tracking.fbPixelId;

  /* ---------------------------------------------------
     INJECT <title> + META
  --------------------------------------------------- */
  document.title = PRODUCT.name;

  /* ---------------------------------------------------
     INJECT CSS (chỉ 1 lần)
  --------------------------------------------------- */
  if (!document.getElementById("nino-style")) {
    const link = document.createElement("link");
    link.id   = "nino-style";
    link.rel  = "stylesheet";
    link.href = "/template/product.css";
    document.head.appendChild(link);
  }

  /* ---------------------------------------------------
     INJECT FACEBOOK PIXEL
  --------------------------------------------------- */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = true; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  fbq("init", FB_PIXEL);
  fbq("track", "PageView");
  fbq("track", "ViewContent", {
    content_name:     PRODUCT.name,
    content_category: CONFIG.category || "Sản phẩm",
    content_ids:      [PRODUCT.id],
    content_type:     "product",
    value:            PRODUCT.price,
    currency:         "VND"
  });

  /* ---------------------------------------------------
     RENDER HTML KHUNG VÀO #app
  --------------------------------------------------- */
  document.getElementById("app").innerHTML = `

    <!-- GALLERY -->
    <section class="gallery-wrap">
      <div class="slider" id="slider">
        <div class="slides" id="slides"></div>
        <div class="dots" id="dots"></div>
      </div>
      <div class="thumbs" id="thumbs"></div>
      <div class="top-sale-bar">
        <span>🔥 Ưu đãi hôm nay</span>
        <span>Kết thúc sau <strong id="countdown">15:00</strong></span>
      </div>
    </section>

    <!-- INFO -->
    <section class="section">
      <div class="price-row">
        <div class="price">${formatPrice(PRODUCT.price)}</div>
        ${PRODUCT.oldPrice ? `<div class="old-price">${formatPrice(PRODUCT.oldPrice)}</div>` : ""}
        ${PRODUCT.oldPrice ? `<div class="discount-badge">-${Math.round((1 - PRODUCT.price / PRODUCT.oldPrice) * 100)}%</div>` : ""}
      </div>
      <div class="product-title">${PRODUCT.name}</div>
      <div class="sold">Đã bán ${PRODUCT.sold || ""}</div>
    </section>

    <!-- FREE SHIP -->
    <section class="section" style="padding-top:10px; padding-bottom:10px;">
      <div class="free-ship-bar">
        🚚 Miễn phí vận chuyển cho tất cả đơn hàng khi mua trong thời gian ưu đãi hôm nay
      </div>
    </section>

    <!-- RETURN POLICY -->
    <section class="section">
      <div class="collapse-head" id="returnHead">
        <span>🛡️ Trả hàng miễn phí 15 ngày • Bảo hiểm Thời trang</span>
        <span class="collapse-arrow">⌄</span>
      </div>
      <div class="collapse-body" id="returnBody">
        <div style="display:flex; gap:10px; align-items:flex-start;">
          <div style="font-size:20px;">📦</div>
          <div>
            <div style="font-weight:700; margin-bottom:6px;">An tâm mua sắm cùng Nino Shop</div>
            <div>Miễn phí Trả hàng trong 15 ngày. Tại thời điểm nhận hàng, bạn có thể đồng kiểm và được hỗ trợ nếu sản phẩm có vấn đề.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- COLOR -->
    <section class="section">
      <div class="color-head">Màu sắc: <span id="colorLabel">${Object.keys(CONFIG.colorImages)[0]}</span></div>
      <div class="color-thumbs" id="colorThumbs"></div>
    </section>

    <!-- SIZE -->
    <section class="section">
      <div class="section-title">Size</div>
      <div class="option-list" id="sizeOptions">
        ${CONFIG.sizes.map((s, i) => `
          <button class="option-btn ${i === 0 ? "active" : ""}" data-value="${s.value}">${s.label}</button>
        `).join("")}
      </div>
    </section>

    <!-- SIZE GUIDE -->
    ${CONFIG.sizeGuide ? `
    <section class="section">
      <div class="collapse-head active" id="sizeGuideHead">
        <span>Hướng Dẫn Chọn Size</span>
        <span class="collapse-arrow">⌄</span>
      </div>
      <div class="collapse-body show" id="sizeGuideBody">
        ${CONFIG.sizeGuide}
      </div>
    </section>` : ""}

    <!-- QTY -->
    <section class="section">
      <div class="section-title">Số lượng</div>
      <div class="qty-wrap">
        <button class="qty-btn" id="minusQty">-</button>
        <input class="qty-input" type="number" id="quantity" value="1" min="1" />
        <button class="qty-btn" id="plusQty">+</button>
      </div>
      <div style="margin-top:16px; display:flex; gap:10px;">
        <button class="btn-outline" id="inlineAddToCartBtn" style="flex:1;">Thêm vào giỏ hàng</button>
        <button class="btn-primary" id="inlineBuyNowBtn" style="flex:1;">Mua ngay</button>
      </div>
    </section>

    <!-- DESCRIPTION -->
    <section class="section">
      <div class="desc-section-title">Mô tả sản phẩm</div>
      <div class="desc-preview collapsed" id="descPreview">
        <div class="desc-inner">${CONFIG.description}</div>
      </div>
      <button class="desc-toggle-btn" id="descToggleBtn">Xem thêm ▾</button>
    </section>

    <!-- REVIEWS -->
    <section class="section">
      <div class="collapse-head active" id="reviewHead">
        <span>Đánh giá sản phẩm <span style="color:#ee4d2d; font-weight:800;">${CONFIG.reviewScore || "4.9"}/5 ★</span></span>
        <span class="collapse-arrow">⌄</span>
      </div>
      <div class="collapse-body show" id="reviewBody">
        <div id="reviewList"></div>
      </div>
    </section>

    <!-- SHOP INFO -->
    <section class="section">
      <div class="shop-box">
        <img class="shop-avatar"
          src="https://res.cloudinary.com/dezednxpz/image/upload/v1774912565/Nino_Shop_fashion_202603310615_m8cpgn.jpg"
          alt="Nino Shop" loading="lazy" decoding="async" />
        <div class="shop-main">
          <div class="shop-name">Nino Shop</div>
          <div class="shop-online">Online 4 Giờ Trước</div>
        </div>
      </div>
      <div class="shop-stats">
        <div class="shop-stat"><span class="shop-stat-label">Đánh Giá</span><span class="shop-stat-value">3,9k</span></div>
        <div class="shop-stat"><span class="shop-stat-label">Sản Phẩm</span><span class="shop-stat-value">37</span></div>
        <div class="shop-stat"><span class="shop-stat-label">Tỉ Lệ Phản Hồi</span><span class="shop-stat-value">99%</span></div>
        <div class="shop-stat"><span class="shop-stat-label">Thời Gian Phản Hồi</span><span class="shop-stat-value">trong vài giờ</span></div>
        <div class="shop-stat"><span class="shop-stat-label">Người Theo Dõi</span><span class="shop-stat-value">43,6k</span></div>
        <div class="shop-stat"><span class="shop-stat-label">Kinh Doanh</span><span class="shop-stat-value">5 năm trước</span></div>
      </div>
    </section>

    <!-- THÔNG TIN MUA HÀNG -->
    <section class="section">
      <div class="section-title">Thông tin mua hàng &amp; hỗ trợ</div>
      <div style="font-size:14px; line-height:1.7; margin-bottom:14px;">
        <div><strong>Hotline:</strong> 0798.658.600</div>
        <div><strong>Zalo:</strong> https://zalo.me/ninoshop</div>
        <div><strong>Messenger:</strong> m.me/920062987858914</div>
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:700; margin-bottom:6px;">Hệ thống cửa hàng:</div>
        <div style="font-size:14px; line-height:1.7;">
          <div>• Chi nhánh 1: 39 Đường Láng, Đống Đa, Hà Nội</div>
          <div>• Chi nhánh 2: 268 Đ. Hoàng Hoa Thám, Hà Nội</div>
          <div>• Chi nhánh 3: 85 Nguyễn Trãi, Quận 1, TP.HCM</div>
        </div>
      </div>
      <div style="margin-bottom:16px;">
        <img src="https://res.cloudinary.com/dezednxpz/image/upload/v1774966653/Screenshot_2026-03-31_063159_j3ckds.png"
          style="width:100%; border-radius:12px;" loading="lazy" decoding="async" alt="Bản đồ cửa hàng" />
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:700; margin-bottom:6px;">Chính sách đổi trả</div>
        <div style="font-size:14px; color:#555; line-height:1.7;">
          Hỗ trợ đổi size / đổi màu trong 7 ngày nếu sản phẩm chưa qua sử dụng.
          Trường hợp lỗi do nhà sản xuất được đổi mới hoàn toàn.
        </div>
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:700; margin-bottom:6px;">Thông tin vận chuyển</div>
        <div style="font-size:14px; color:#555; line-height:1.7;">
          Giao hàng toàn quốc 2–5 ngày. Nội thành Hà Nội / TP.HCM: 1–2 ngày.
        </div>
      </div>
      <div style="margin-bottom:14px;">
        <div style="font-weight:700; margin-bottom:6px;">Cam kết</div>
        <div style="font-size:14px; color:#555; line-height:1.7;">
          ✔ Được kiểm tra hàng trước khi thanh toán (COD)<br>
          ✔ Hỗ trợ đổi size nếu không vừa<br>
          ✔ Sản phẩm đúng mô tả 100%
        </div>
      </div>
      <div>
        <div style="font-weight:700; margin-bottom:6px;">FAQ</div>
        <div style="font-size:14px; color:#555; line-height:1.7;">
          <div><strong>Hỏi:</strong> Có được kiểm hàng không?</div>
          <div>✔ Có, kiểm tra trước khi thanh toán.</div>
          <div style="margin-top:8px;"><strong>Hỏi:</strong> Không vừa size có đổi không?</div>
          <div>✔ Có, hỗ trợ đổi size nhanh chóng.</div>
          <div style="margin-top:8px;"><strong>Hỏi:</strong> Bao lâu nhận hàng?</div>
          <div>✔ 2–5 ngày toàn quốc.</div>
        </div>
      </div>
    </section>

  `;

  /* ---------------------------------------------------
     STATE
  --------------------------------------------------- */
  let selectedColor  = Object.keys(CONFIG.colorImages)[0];
  let selectedSize   = CONFIG.sizes[0].value;
  let quantity       = 1;
  let currentSlide   = 0;
  let currentGallery = [];
  let colorIndexMap  = {};
  let slideColorMap  = [];
  let cartItems      = [];
  let clientIp       = null;

  /* ---------------------------------------------------
     UTILS
  --------------------------------------------------- */
  function formatPrice(num) {
    return num.toLocaleString("vi-VN") + "đ";
  }

  function genEventId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? match[2] : null;
  }

  function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + "=" + value + "; expires=" + expires + "; path=/";
  }

  async function sha256(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str.trim().toLowerCase()));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2000);
  }

  function updateQtyDisplay() {
    document.getElementById("quantity").value = quantity;
  }

  /* ---------------------------------------------------
     _fbc từ fbclid
  --------------------------------------------------- */
  (function () {
    const fbclid = getQueryParam("fbclid");
    if (fbclid) setCookie("_fbc", "fb.1." + Date.now() + "." + fbclid, 90);
  })();

  /* ---------------------------------------------------
     CLIENT IP
  --------------------------------------------------- */
  fetch("https://api.ipify.org?format=json")
    .then(r => r.json())
    .then(d => { clientIp = d.ip; })
    .catch(() => {});

  /* ---------------------------------------------------
     GAS PAYLOAD
  --------------------------------------------------- */
  function buildBasePayload(eventIdObj) {
    return {
      product_id:       PRODUCT.id,
      product_name:     PRODUCT.name,
      price:            PRODUCT.price,
      value:            PRODUCT.price,
      currency:         "VND",
      event_source_url: window.location.href,
      user_agent:       navigator.userAgent,
      client_ip:        clientIp || null,
      fbp:              getCookie("_fbp") || null,
      fbc:              getCookie("_fbc") || null,
      fbclid:           getQueryParam("fbclid") || null,
      ...eventIdObj
    };
  }

  function sendToGAS(payload) {
    fetch(GAS_URL, {
      method:  "POST",
      mode:    "no-cors",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload)
    }).catch(() => {});
  }

  /* ---------------------------------------------------
     GALLERY
  --------------------------------------------------- */
  function buildFullGallery() {
    const slidesEl = document.getElementById("slides");
    const dotsEl   = document.getElementById("dots");
    const thumbsEl = document.getElementById("thumbs");

    slidesEl.innerHTML = "";
    dotsEl.innerHTML   = "";
    thumbsEl.innerHTML = "";
    currentGallery     = [];
    colorIndexMap      = {};
    slideColorMap      = [];

    let index = 0;

    function addSlide(src, label, isVideo) {
      currentGallery.push(src);
      slideColorMap.push(isVideo ? "video" : label);

      const slide = document.createElement("div");
      slide.className = "slide";

      if (isVideo) {
        slide.innerHTML = `<video controls playsinline preload="metadata"><source src="${src}" type="video/mp4" /></video>`;
      } else {
        const eager = index === 0 ? "eager" : "lazy";
        const fp    = index === 0 ? "high"  : "low";
        slide.innerHTML = `<img src="${src}" alt="${label}" loading="${eager}" fetchpriority="${fp}" decoding="async" />`;
      }
      slidesEl.appendChild(slide);

      const capturedIndex = index;
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.addEventListener("click", () => goToSlide(capturedIndex));
      dotsEl.appendChild(dot);

      const thumbSrc = isVideo
        ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Crect width='72' height='72' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='22' fill='%23aaa'%3E%E2%96%B6%3C/text%3E%3C/svg%3E"
        : src;

      const thumb = document.createElement("img");
      thumb.className = "thumb";
      thumb.src       = thumbSrc;
      thumb.alt       = label;
      thumb.loading   = "lazy";
      thumb.decoding  = "async";
      thumb.addEventListener("click", () => goToSlide(capturedIndex));
      thumbsEl.appendChild(thumb);

      index++;
    }

    (CONFIG.extraImages || []).forEach(src => addSlide(src, "extra", false));
    Object.keys(CONFIG.colorImages).forEach(color => {
      colorIndexMap[color] = index;
      CONFIG.colorImages[color].forEach(src => addSlide(src, color, false));
    });
    (CONFIG.videos || []).forEach(src => addSlide(src, "video", true));

    goToSlide(0);
  }

  function buildColorThumbs() {
    const colorThumbsEl = document.getElementById("colorThumbs");
    colorThumbsEl.innerHTML = "";
    Object.keys(CONFIG.colorImages).forEach((color, i) => {
      const img  = CONFIG.colorImages[color][0];
      const item = document.createElement("div");
      item.className     = "color-thumb-item" + (i === 0 ? " active" : "");
      item.dataset.color = color;
      item.innerHTML = `
        <div class="color-thumb-img-wrap">
          <img class="color-thumb-img" src="${img}" alt="${color}" loading="lazy" decoding="async" />
        </div>
        <div class="color-thumb-label">${color}</div>
      `;
      item.addEventListener("click", () => {
        selectedColor = color;
        document.getElementById("colorLabel").textContent = color;
        goToSlide(colorIndexMap[color]);
      });
      colorThumbsEl.appendChild(item);
    });
  }

  function updateColorThumbActive() {
    document.querySelectorAll(".color-thumb-item").forEach(el => {
      el.classList.toggle("active", el.dataset.color === selectedColor);
    });
  }

  function updateSlider() {
    const slidesEl = document.getElementById("slides");
    slidesEl.style.transform = `translateX(-${currentSlide * 100}%)`;
    document.querySelectorAll(".dot").forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
    document.querySelectorAll("#thumbs .thumb").forEach((thumb, i) => thumb.classList.toggle("active", i === currentSlide));
    const slideColor = slideColorMap[currentSlide];
    if (slideColor && slideColor !== "video" && slideColor !== "extra") {
      selectedColor = slideColor;
      document.getElementById("colorLabel").textContent = slideColor;
      updateColorThumbActive();
    }
    autoScrollThumbs();
    autoScrollColorThumbs();
  }

  function goToSlide(idx) {
    currentSlide = idx;
    updateSlider();
  }

  function autoScrollThumbs() {
    const thumbs = document.querySelectorAll("#thumbs .thumb");
    if (thumbs[currentSlide]) {
      thumbs[currentSlide].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  function autoScrollColorThumbs() {
    const active = document.querySelector(".color-thumb-item.active");
    if (!active) return;
    const container = document.getElementById("colorThumbs");
    container.scrollTo({
      left:     active.offsetLeft - container.offsetWidth / 2 + active.offsetWidth / 2,
      behavior: "smooth"
    });
  }

  /* SWIPE */
  const slider   = document.getElementById("slider");
  let startX = 0, startY = 0, moveX = 0, moveY = 0;
  let isDragging = false, isHorizontal = null;

  slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    moveX  = startX; moveY = startY;
    isDragging = true; isHorizontal = null;
  }, { passive: true });

  slider.addEventListener("touchmove", e => {
    if (!isDragging) return;
    moveX = e.touches[0].clientX; moveY = e.touches[0].clientY;
    if (isHorizontal === null) {
      const dx = Math.abs(moveX - startX), dy = Math.abs(moveY - startY);
      if (dx > 5 || dy > 5) isHorizontal = dx >= dy;
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
    isDragging = false; isHorizontal = null;
    startX = 0; startY = 0; moveX = 0; moveY = 0;
  });

  /* ---------------------------------------------------
     SIZE & QTY
  --------------------------------------------------- */
  document.querySelectorAll("#sizeOptions .option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#sizeOptions .option-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.dataset.value;
    });
  });

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

  /* ---------------------------------------------------
     COLLAPSE
  --------------------------------------------------- */
  function setupCollapse(headId, bodyId) {
    const head = document.getElementById(headId);
    const body = document.getElementById(bodyId);
    if (!head || !body) return;
    head.addEventListener("click", () => {
      head.classList.toggle("active");
      body.classList.toggle("show");
    });
  }

  setupCollapse("returnHead",    "returnBody");
  setupCollapse("reviewHead",    "reviewBody");
  setupCollapse("sizeGuideHead", "sizeGuideBody");

  /* ---------------------------------------------------
     DESC XEM THÊM
  --------------------------------------------------- */
  let descExpanded = false;
  document.getElementById("descToggleBtn").addEventListener("click", () => {
    descExpanded = !descExpanded;
    document.getElementById("descPreview").classList.toggle("collapsed", !descExpanded);
    document.getElementById("descToggleBtn").textContent = descExpanded ? "Thu gọn ▴" : "Xem thêm ▾";
  });

  /* ---------------------------------------------------
     MODAL — ORDER
  --------------------------------------------------- */
  function openModal() {
    document.getElementById("orderModal").classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function hideModal() {
    document.getElementById("orderModal").classList.remove("show");
    document.body.style.overflow = "auto";
  }

  document.getElementById("closeModal").addEventListener("click", hideModal);
  document.getElementById("orderModal").addEventListener("click", e => {
    if (e.target === document.getElementById("orderModal")) hideModal();
  });

  /* ---------------------------------------------------
     MODAL — THANK
  --------------------------------------------------- */
  function openThankModal() {
    document.getElementById("thankModal").classList.add("show");
    document.body.style.overflow = "hidden";
  }
  function hideThankModal() {
    document.getElementById("thankModal").classList.remove("show");
    document.body.style.overflow = "auto";
  }

  document.getElementById("thankCloseBtn").addEventListener("click", hideThankModal);
  document.getElementById("thankModal").addEventListener("click", e => {
    if (e.target === document.getElementById("thankModal")) hideThankModal();
  });

  /* ---------------------------------------------------
     CART — localStorage
  --------------------------------------------------- */
  function loadCartItems() {
    try { cartItems = JSON.parse(localStorage.getItem("nino_cart_" + PRODUCT.id)) || []; }
    catch (_) { cartItems = []; }
  }

  function saveCartItems() {
    localStorage.setItem("nino_cart_" + PRODUCT.id, JSON.stringify(cartItems));
  }

  function addCurrentSelectionToCart() {
    loadCartItems();
    const existingIndex = cartItems.findIndex(item =>
      item.color === selectedColor && item.size === selectedSize
    );
    if (existingIndex > -1) {
      cartItems[existingIndex].quantity += quantity;
      cartItems[existingIndex].total = cartItems[existingIndex].quantity * PRODUCT.price;
    } else {
      cartItems.push({
        product_id:   PRODUCT.id,
        product_name: PRODUCT.name,
        color:        selectedColor,
        size:         selectedSize,
        quantity:     quantity,
        price:        PRODUCT.price,
        total:        PRODUCT.price * quantity
      });
    }
    saveCartItems();
  }

  function getCartSubTotal() { return cartItems.reduce((sum, item) => sum + item.total, 0); }
  function getCartGrandTotal() { return getCartSubTotal() + TAX; }

  /* ---------------------------------------------------
     RENDER CART SUMMARY
  --------------------------------------------------- */
  function renderCartSummary() {
    const cartSummaryList = document.getElementById("cartSummaryList");
    const subTotalEl      = document.getElementById("summarySubTotal");
    const grandTotalEl    = document.getElementById("summaryGrandTotal");

    if (!cartItems.length) {
      cartSummaryList.innerHTML = `<div style="color:#777; padding:8px 0;">Chưa có sản phẩm trong giỏ hàng.</div>`;
      subTotalEl.textContent   = formatPrice(0);
      grandTotalEl.textContent = formatPrice(TAX);
      return;
    }

    cartSummaryList.innerHTML = cartItems.map((item, idx) => `
      <div class="cart-item">
        <div class="cart-item-top">${item.product_name}</div>
        <div class="cart-item-meta">Màu: ${item.color}</div>
        <div class="cart-item-meta">Size: ${item.size}</div>
        <div class="cart-item-controls">
          <button class="cart-qty-btn" data-action="minus" data-idx="${idx}">−</button>
          <span class="cart-qty-display">${item.quantity}</span>
          <button class="cart-qty-btn" data-action="plus" data-idx="${idx}">+</button>
          <button class="cart-remove-btn" data-action="remove" data-idx="${idx}">🗑 Xoá</button>
        </div>
        <div class="cart-item-price">${formatPrice(item.total)}</div>
      </div>
    `).join("");

    subTotalEl.textContent   = formatPrice(getCartSubTotal());
    grandTotalEl.textContent = formatPrice(getCartGrandTotal());

    cartSummaryList.querySelectorAll("[data-action]").forEach(btn => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action;
        const idx    = parseInt(btn.dataset.idx);
        if (action === "minus") {
          if (cartItems[idx].quantity > 1) {
            cartItems[idx].quantity--;
            cartItems[idx].total = cartItems[idx].quantity * cartItems[idx].price;
          } else {
            cartItems.splice(idx, 1);
          }
        } else if (action === "plus") {
          cartItems[idx].quantity++;
          cartItems[idx].total = cartItems[idx].quantity * cartItems[idx].price;
        } else if (action === "remove") {
          cartItems.splice(idx, 1);
        }
        saveCartItems();
        renderCartSummary();
      });
    });
  }

  /* ---------------------------------------------------
     OPEN CHECKOUT
  --------------------------------------------------- */
  function openCheckoutCart() {
    loadCartItems();
    renderCartSummary();
    const eid = genEventId();
    if (typeof fbq !== "undefined") {
      fbq("track", "InitiateCheckout", {
        content_name: PRODUCT.name,
        content_ids:  [PRODUCT.id],
        content_type: "product",
        value:        getCartGrandTotal(),
        currency:     "VND"
      }, { eventID: eid });
    }
    sendToGAS({ ...buildBasePayload({ initiate_checkout_event_id: eid }), event_type: "initiate_checkout", value: getCartGrandTotal() });
    openModal();
  }

  /* ---------------------------------------------------
     CTA EVENTS
  --------------------------------------------------- */
  document.getElementById("inlineAddToCartBtn").addEventListener("click", () => {
    addCurrentSelectionToCart();
    const eid = genEventId();
    if (typeof fbq !== "undefined") {
      fbq("track", "AddToCart", {
        content_name: PRODUCT.name,
        content_ids:  [PRODUCT.id],
        content_type: "product",
        value:        PRODUCT.price * quantity,
        currency:     "VND"
      }, { eventID: eid });
    }
    sendToGAS({ ...buildBasePayload({ add_to_cart_event_id: eid }), event_type: "add_to_cart", value: PRODUCT.price * quantity });
    showToast("✓ Đã thêm vào giỏ hàng");
  });

  document.getElementById("goToCartBtn").addEventListener("click",     () => openCheckoutCart());
  document.getElementById("buyNowBtn").addEventListener("click",       () => { addCurrentSelectionToCart(); openCheckoutCart(); });
  document.getElementById("inlineBuyNowBtn").addEventListener("click", () => { addCurrentSelectionToCart(); openCheckoutCart(); });

  /* ---------------------------------------------------
     COUNTDOWN
  --------------------------------------------------- */
  let countdownSeconds = 15 * 60;
  const countdownEl    = document.getElementById("countdown");
  setInterval(() => {
    const m = Math.floor(countdownSeconds / 60);
    const s = countdownSeconds % 60;
    countdownEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    if (countdownSeconds > 0) countdownSeconds--;
  }, 1000);

  /* ---------------------------------------------------
     ORDER FORM SUBMIT
  --------------------------------------------------- */
  document.getElementById("orderForm").addEventListener("submit", async e => {
    e.preventDefault();
    const fullName = document.getElementById("fullName").value.trim();
    const phone    = document.getElementById("phone").value.trim();
    const address  = document.getElementById("address").value.trim();

    if (!fullName || !phone || !address) {
      document.getElementById("statusMessage").style.color = "red";
      document.getElementById("statusMessage").textContent = "Vui lòng nhập đầy đủ thông tin.";
      return;
    }

    loadCartItems();
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled    = true;
    submitBtn.textContent = "Đang gửi...";
    document.getElementById("statusMessage").textContent = "";

    const purchaseEventId = genEventId();
    const hashedPhone     = await sha256(phone);

    const payload = {
      ...buildBasePayload({ purchase_event_id: purchaseEventId }),
      event_type:   "purchase",
      items:        cartItems,
      quantity:     cartItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal:     getCartSubTotal(),
      tax:          TAX,
      total:        getCartGrandTotal(),
      value:        getCartGrandTotal(),
      hashed_phone: hashedPhone,
      customer:     { full_name: fullName, phone, address }
    };

    try {
      await fetch(GAS_URL, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload)
      });

      if (typeof fbq !== "undefined") {
        fbq("track", "Purchase", {
          content_name: PRODUCT.name,
          content_ids:  [PRODUCT.id],
          content_type: "product",
          value:        getCartGrandTotal(),
          currency:     "VND"
        }, { eventID: purchaseEventId });
      }

      document.getElementById("orderForm").reset();
      quantity = 1;
      updateQtyDisplay();
      localStorage.removeItem("nino_cart_" + PRODUCT.id);
      cartItems = [];
      renderCartSummary();
      hideModal();
      openThankModal();

    } catch (err) {
      document.getElementById("statusMessage").style.color = "red";
      document.getElementById("statusMessage").textContent = "Gửi đơn thất bại. Vui lòng thử lại.";
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = "XÁC NHẬN ĐẶT HÀNG";
    }
  });

  /* ---------------------------------------------------
     REVIEWS
  --------------------------------------------------- */
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
                <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:26px;background:rgba(0,0,0,0.18);border-radius:8px;">▶</div>
              </div>`
            : `<img class="review-media-item" data-type="image" data-src="${item}" src="${item}" loading="lazy" decoding="async" style="cursor:pointer;" />`;
        }).join("")}
      </div>
    `;
  }

  function renderReviews() {
    document.getElementById("reviewList").innerHTML = (CONFIG.reviews || []).map(review => `
      <div class="review-item">
        <div class="review-top">
          <img class="review-avatar" src="${review.avatar}" alt="${review.name}" loading="lazy" decoding="async" />
          <div class="review-main">
            <div class="review-name">${review.name}</div>
            <div class="review-stars">${renderStars(review.stars)}</div>
            <div class="review-meta">${review.date} | Phân loại hàng: ${review.classify}</div>
            <div class="review-tags">
              <div>Màu sắc: ${review.color}</div>
              <div>Đúng với mô tả: ${review.match}</div>
              <div>Chất liệu: ${review.material}</div>
            </div>
            <div class="review-content">${review.content}</div>
            ${renderReviewMedia(review.media)}
            <div class="review-like">👍 ${review.likes}</div>
          </div>
        </div>
      </div>
    `).join("");
  }

  /* ---------------------------------------------------
     MEDIA LIGHTBOX
  --------------------------------------------------- */
  function setupReviewMediaLightbox() {
    const lightbox        = document.getElementById("mediaLightbox");
    const lightboxContent = document.getElementById("mediaLightboxContent");

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

    document.getElementById("closeMediaLightbox").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
  }

  /* ---------------------------------------------------
     INIT
  --------------------------------------------------- */
  (function initViewContent() {
    const eid = genEventId();
    sendToGAS({ ...buildBasePayload({ view_content_event_id: eid }), event_type: "view_content", value: PRODUCT.price });
  })();

  loadCartItems();
  buildFullGallery();
  buildColorThumbs();
  renderReviews();
  setupReviewMediaLightbox();
  renderCartSummary();
  updateQtyDisplay();

})();
