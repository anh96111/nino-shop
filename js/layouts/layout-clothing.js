(function renderClothingLayout() {
  const P = PRODUCT_CONFIG;
  const root = document.getElementById("layoutRoot");
  if (!root) return;

  const formatPrice = n => Number(n || 0).toLocaleString("vi-VN") + "đ";

  const safeText = value => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const fallbackImage = (label = "Ảnh sản phẩm") =>
    `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f7f1ea"/>
            <stop offset="100%" stop-color="#efe5d8"/>
          </linearGradient>
        </defs>
        <rect width="900" height="900" fill="url(#g)"/>
        <rect x="90" y="90" width="720" height="720" rx="28" fill="#fff" stroke="#dfd3c2" stroke-width="4"/>
        <text x="450" y="455" text-anchor="middle" font-size="34" font-family="Arial, sans-serif" fill="#8d6b44" font-weight="700">${label}</text>
      </svg>
    `)}`;

  const clothing = P.clothing || {};

  const rawImages = Array.isArray(P.images) ? P.images.filter(Boolean) : [];
  const images = rawImages.length
    ? rawImages
    : [
        fallbackImage("Ảnh 1"),
        fallbackImage("Ảnh 2"),
        fallbackImage("Ảnh 3"),
        fallbackImage("Ảnh 4")
      ];

  const sizeVariants = Array.isArray(P.variants)
    ? P.variants.filter(v => v.type === "size")
    : [];

  const sizes = sizeVariants.length
    ? sizeVariants
    : [
        { type: "size", name: "M", label: "M" },
        { type: "size", name: "L", label: "L" }
      ];

  let selectedSize =
    (P.defaultVariant && P.defaultVariant.size) ||
    (sizes[0] && sizes[0].name) ||
    "M";

  const combo = Array.isArray(P.combos) && P.combos[0]
    ? P.combos[0]
    : {
        name: "1 sản phẩm",
        quantity: 1,
        price: Number(P.price || 0),
        oldPrice: Number(P.oldPrice || 0),
        shipFee: 0,
        note: "Miễn phí vận chuyển"
      };

  const comboQty = Math.max(1, Number(combo.quantity || 1));
  const comboTotal = Number(combo.price || P.price || 0);
  const unitPrice = Math.floor(comboTotal / comboQty);
  const comboShipFee = Number(combo.shipFee || 0);

  const policyTags = Array.isArray(clothing.policyTags) && clothing.policyTags.length
    ? clothing.policyTags
    : [
        { icon: "✓", text: "Kiểm tra hàng<br>trước khi nhận" },
        { icon: "↺", text: "Trả hàng nếu<br>k giống mẫu" },
        { icon: "🚚", text: "Miễn phí<br>vận chuyển" }
      ];

  const reviews = P.reviews && Array.isArray(P.reviews.items)
    ? P.reviews.items
    : [];

  const slidesHtml = images.map((src, index) => `
    <div class="clothing-slide">
      <img
        src="${safeText(src)}"
        alt="${safeText(P.shortName || P.name || "Sản phẩm")} ${index + 1}"
        loading="${index === 0 ? "eager" : "lazy"}"
        data-fallback="${fallbackImage(`Ảnh ${index + 1}`)}"
      >
    </div>
  `).join("");

  const dotsHtml = images.map((_, index) => `
    <span class="clothing-dot ${index === 0 ? "active" : ""}" data-clothing-dot="${index}"></span>
  `).join("");

  const thumbsHtml = images.map((src, index) => `
    <button type="button" class="clothing-thumb ${index === 0 ? "active" : ""}" data-clothing-thumb="${index}">
      <img
        src="${safeText(src)}"
        alt="thumb ${index + 1}"
        loading="lazy"
        data-fallback="${fallbackImage(`Ảnh ${index + 1}`)}"
      >
    </button>
  `).join("");

  const policyTagsHtml = policyTags.map(tag => `
    <div class="clothing-policy-tag">
      <div class="clothing-policy-icon">${tag.icon || "✓"}</div>
      <div>${tag.text || ""}</div>
    </div>
  `).join("");

  const sizeHtml = sizes.map(v => `
    <button
      class="clothing-size-card ${v.name === selectedSize ? "active" : ""}"
      type="button"
      data-size-option="${safeText(v.name)}"
    >
      ${safeText(v.label || v.name)}
    </button>
  `).join("");

  const hiddenSizeOptionsHtml = sizes.map(v => `
    <button
      class="variant-option ${v.name === selectedSize ? "active" : ""}"
      data-value="${safeText(v.name)}"
      type="button"
    >
      ${safeText(v.label || v.name)}
    </button>
  `).join("");

  function renderReviewItem(rv) {
    const stars = Math.max(0, Math.min(5, Number(rv.stars || 5)));
    const starsHtml = Array.from({ length: 5 }, (_, i) => i < stars ? "★" : "☆").join("");
    const media = Array.isArray(rv.media) ? rv.media : [];

    const mediaHtml = media.length ? `
      <div class="clothing-review-media">
        ${media.slice(0, 3).map(m => {
          const src = typeof m === "string" ? m : (m && m.poster ? m.poster : "");
          if (!src) return "";
          return `<img src="${safeText(src)}" alt="Ảnh đánh giá" loading="lazy" data-fallback="${fallbackImage("Review")}">`;
        }).join("")}
      </div>
    ` : "";

    return `
      <div class="clothing-review-item">
        <img
          class="clothing-review-avatar"
          src="${safeText(rv.avatar || fallbackImage("Avatar"))}"
          alt="${safeText(rv.name || "Khách hàng")}"
          loading="lazy"
          data-fallback="${fallbackImage("Avatar")}"
        >
        <div class="clothing-review-body">
          <div class="clothing-review-name">${safeText(rv.name || "Khách hàng")}</div>
          <div class="clothing-review-stars">${starsHtml}</div>
          <div class="clothing-review-meta">${safeText(rv.date || "")}${rv.classify ? " · " + safeText(rv.classify) : ""}</div>
          <div class="clothing-review-text">${safeText(rv.content || "")}</div>
          ${mediaHtml}
        </div>
      </div>
    `;
  }

  const reviewsHtml = reviews.length
    ? reviews.slice(0, 10).map(renderReviewItem).join("")
    : `<div class="clothing-empty-review">Chưa có đánh giá.</div>`;

  const coreDomHtml = `
    <div class="clothing-core-hidden" aria-hidden="true">
      <div id="slider">
        <div id="slides"></div>
        <div id="dots"></div>
      </div>

      <div id="thumbs"></div>

      <input type="number" id="quantity" value="${comboQty}">

      <button type="button" id="minusQty"></button>
      <button type="button" id="plusQty"></button>
      <button type="button" id="inlineAddToCartBtn"></button>
      <button type="button" id="buyNowBtn"></button>
      <button type="button" id="goToCartBtn"></button>
      <span id="cartBadge"></span>

      <div class="variant-group" data-type="size">
        ${hiddenSizeOptionsHtml}
      </div>

      <div class="combos-wrap" id="clothingHiddenCombos">
        <button
          type="button"
          class="combo-option active"
          data-index="0"
          data-price="${unitPrice}"
          data-combo-total="${comboTotal}"
          data-shipfee="${comboShipFee}"
        >
          <span class="combo-name">${safeText(combo.name || "1 sản phẩm")}</span>
          <span class="combo-price">${unitPrice}</span>
        </button>
      </div>

      <span class="old-price">${formatPrice(P.oldPrice)}</span>
    </div>
  `;

  root.innerHTML = `
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #f5f5f5;
      }

      .clothing-page {
        max-width: 430px;
        margin: 0 auto;
        background: #fff;
        min-height: 100vh;
        color: #222;
        font-family: Arial, sans-serif;
        padding-bottom: 74px;
      }

      .clothing-hero {
        padding: 12px 14px 8px;
        background: linear-gradient(180deg, #fff7ef 0%, #ffffff 88%);
      }

      .clothing-shop-logo {
        font-size: 22px;
        font-weight: 900;
        letter-spacing: -0.4px;
        color: #b87333;
      }

      .clothing-shop-logo span {
        color: #222;
        font-size: 15px;
        font-weight: 700;
        margin-left: 2px;
      }

      .clothing-slider {
        position: relative;
        margin-top: 10px;
        border-radius: 18px;
        overflow: hidden;
        background: #f1ede7;
      }

      .clothing-slides {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: none;
      }

      .clothing-slides::-webkit-scrollbar,
      .clothing-thumbs::-webkit-scrollbar {
        display: none;
      }

      .clothing-slide {
        min-width: 100%;
        aspect-ratio: 1 / 1;
        scroll-snap-align: start;
        background: #f1ede7;
      }

      .clothing-slide img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
      }

      .clothing-policy-tags {
        position: absolute;
        left: 10px;
        top: 12px;
        display: flex;
        flex-direction: column;
        gap: 7px;
        z-index: 3;
        max-width: 195px;
      }

      .clothing-policy-tag {
        display: flex;
        align-items: center;
        gap: 7px;
        width: fit-content;
        max-width: 195px;
        padding: 7px 10px 7px 8px;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.75);
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14);
        color: #333;
        font-size: 11.5px;
        font-weight: 800;
        line-height: 1.2;
      }

      .clothing-policy-icon {
        width: 22px;
        height: 22px;
        min-width: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #d49a46, #8b5a24);
        color: #fff;
        font-size: 12px;
      }

      .clothing-dots {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 10px;
        display: flex;
        justify-content: center;
        gap: 5px;
        z-index: 4;
        pointer-events: none;
      }

      .clothing-dot {
        width: 7px;
        height: 7px;
        border-radius: 999px;
        background: rgba(255,255,255,.62);
        transition: .18s;
      }

      .clothing-dot.active {
        width: 18px;
        background: #fff;
      }

      .clothing-thumbs {
        display: flex;
        gap: 7px;
        padding: 9px 2px 0;
        overflow-x: auto;
        scrollbar-width: none;
      }

      .clothing-thumb {
        width: 48px;
        height: 48px;
        border: 1px solid #e5e5e5;
        padding: 0;
        border-radius: 8px;
        overflow: hidden;
        background: #fff;
        flex: 0 0 auto;
      }

      .clothing-thumb.active {
        border-color: #ee4d2d;
      }

      .clothing-thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .clothing-product-info {
        padding: 12px 14px 10px;
      }

      .clothing-rating-row {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: #555;
        margin-bottom: 8px;
        flex-wrap: wrap;
      }

      .clothing-rating-row strong,
      .clothing-sold {
        color: #111;
        font-weight: 800;
      }

      .clothing-star {
        color: #f6a400;
      }

      .clothing-link {
        color: #2d65c8;
      }

      .clothing-ship {
        color: #00a99d;
        font-weight: 800;
      }

      .clothing-rank-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        background: linear-gradient(90deg, #fff7ef 0%, #fff 100%);
        border-radius: 9px;
        padding: 9px 10px;
        margin-bottom: 10px;
        color: #a86416;
        font-size: 13px;
        font-weight: 900;
        border: 1px solid #f2dfc7;
      }

      .clothing-rank-right {
        color: #c97922;
        font-weight: 800;
        white-space: nowrap;
        font-size: 12px;
      }

      .clothing-service-row {
        display: flex;
        justify-content: space-between;
        gap: 5px;
        padding: 10px 8px;
        background: #fafafa;
        border-radius: 8px;
        font-size: 11px;
        color: #333;
        margin-bottom: 12px;
      }

      .clothing-service-row span {
        flex: 1;
        text-align: center;
        white-space: nowrap;
      }

      .clothing-title {
        font-size: 18px;
        line-height: 1.35;
        font-weight: 900;
        margin: 0 0 8px;
        letter-spacing: -0.2px;
      }

      .clothing-price-box {
        display: flex;
        align-items: flex-end;
        gap: 8px;
        margin-bottom: 4px;
      }

      .clothing-sale-price {
        font-size: 28px;
        color: #ee4d2d;
        font-weight: 900;
      }

      .clothing-old-price {
        font-size: 14px;
        color: #999;
        text-decoration: line-through;
        padding-bottom: 4px;
      }

      .clothing-section {
        padding: 14px;
        border-top: 8px solid #f5f5f5;
        background: #fff;
      }

      .clothing-section-title {
        font-size: 16px;
        font-weight: 900;
        margin-bottom: 10px;
      }

      .clothing-size-options {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .clothing-size-card {
        min-width: 72px;
        border: 1px solid #ddd;
        border-radius: 999px;
        padding: 8px 14px;
        text-align: center;
        cursor: pointer;
        background: #fff;
        transition: .18s;
        font-size: 14px;
        font-weight: 900;
        line-height: 1.1;
        color: #222;
      }

      .clothing-size-card.active {
        border-color: #9b621e;
        background: linear-gradient(180deg, #fff8ef 0%, #fff 100%);
        box-shadow: 0 4px 12px rgba(155, 98, 30, 0.15);
      }

      .clothing-size-guide {
        margin-top: 10px;
        padding: 10px 11px;
        border-radius: 12px;
        background: #faf7f2;
        border: 1px solid #f0e1cf;
        font-size: 13px;
        line-height: 1.55;
        color: #444;
      }

      .clothing-size-guide strong {
        display: block;
        color: #111;
        font-size: 13px;
        margin-bottom: 4px;
      }

      .clothing-line {
        font-size: 14px;
        line-height: 1.55;
        color: #444;
        margin-bottom: 9px;
      }

      .clothing-cod {
        display: inline-block;
        background: #40b884;
        color: #fff;
        font-weight: 900;
        font-size: 11px;
        padding: 3px 5px;
        border-radius: 3px;
        margin-right: 6px;
      }

      .clothing-voucher {
        display: inline-block;
        color: #00a6b3;
        border: 1px solid #9be8ef;
        background: #f0fdff;
        font-size: 12px;
        font-weight: 800;
        padding: 3px 8px;
        border-radius: 3px;
        margin-right: 8px;
      }

      .clothing-free {
        color: #ee4d2d;
        font-weight: 800;
      }

      .clothing-review-item {
        display: flex;
        gap: 10px;
        padding: 12px 0;
        border-bottom: 1px solid #eee;
      }

      .clothing-review-item:last-child {
        border-bottom: none;
      }

      .clothing-review-avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        object-fit: cover;
        background: #eee;
        flex: 0 0 auto;
      }

      .clothing-review-name {
        font-size: 13px;
        font-weight: 800;
        margin-bottom: 3px;
      }

      .clothing-review-stars {
        color: #f6a400;
        font-size: 12px;
        margin-bottom: 4px;
      }

      .clothing-review-meta {
        font-size: 11px;
        color: #999;
        margin-bottom: 5px;
      }

      .clothing-review-text {
        font-size: 13px;
        line-height: 1.45;
        color: #444;
      }

      .clothing-review-media {
        display: flex;
        gap: 6px;
        margin-top: 8px;
      }

      .clothing-review-media img {
        width: 58px;
        height: 58px;
        object-fit: cover;
        border-radius: 7px;
      }

      .clothing-description {
        font-size: 14px;
        line-height: 1.6;
        color: #444;
      }

      .clothing-description img {
        max-width: 100%;
        border-radius: 12px;
        display: block;
        margin: 10px 0;
      }

      .clothing-core-hidden {
        position: absolute !important;
        left: -99999px !important;
        top: -99999px !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        z-index: -1 !important;
      }

      .clothing-core-hidden button,
      .clothing-core-hidden #buyNowBtn,
      .clothing-core-hidden #goToCartBtn,
      .clothing-core-hidden #inlineAddToCartBtn {
        display: none !important;
        position: static !important;
        left: auto !important;
        right: auto !important;
        bottom: auto !important;
        top: auto !important;
        width: 0 !important;
        height: 0 !important;
        min-width: 0 !important;
        min-height: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        border: 0 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        pointer-events: none !important;
      }

      .clothing-bottom-bar {
        position: fixed;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 100%;
        max-width: 430px;
        z-index: 9999;
        padding: 10px 12px;
        background: rgba(255,255,255,.96);
        box-shadow: 0 -4px 16px rgba(0,0,0,.08);
      }

      #inlineBuyNowBtn.clothing-bottom-buy {
        display: block !important;
        width: 100% !important;
        height: 48px !important;
        border: none !important;
        border-radius: 12px !important;
        background: #ee4d2d !important;
        color: #fff !important;
        font-size: 16px !important;
        font-weight: 900 !important;
        cursor: pointer !important;
        position: static !important;
        opacity: 1 !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
    </style>

    <main class="clothing-page">
      <header class="clothing-hero">
        <div class="clothing-shop-logo">Nino<span>-clothing</span></div>

        <div class="clothing-slider">
          <div class="clothing-policy-tags">
            ${policyTagsHtml}
          </div>

          <div class="clothing-slides" id="clothingSlides">
            ${slidesHtml}
          </div>

          <div class="clothing-dots">
            ${dotsHtml}
          </div>
        </div>

        <div class="clothing-thumbs" id="clothingThumbs">
          ${thumbsHtml}
        </div>
      </header>

      <section class="clothing-product-info">
        <div class="clothing-rating-row">
          <span class="clothing-star">★</span>
          <strong>${safeText(clothing.ratingText || "4.8/5")}</strong>
          <span class="clothing-link">${safeText(clothing.ratingCountText || "(1.2k)")}</span>
          <span>|</span>
          <span>Đã bán <span class="clothing-sold">${safeText(clothing.soldText || P.soldText || "12k")}</span></span>
          <span class="clothing-ship">🚚 Miễn phí vận chuyển</span>
        </div>

        <div class="clothing-rank-box">
          <span>${clothing.rankTitle || "🏆 Top sản phẩm bán chạy"}</span>
          <span class="clothing-rank-right">${safeText(clothing.repurchaseText || "Tỷ lệ khách hàng mua lại 95%")}</span>
        </div>

        <div class="clothing-service-row">
          <span>💳 Thanh toán bảo mật</span>
          <span>🛒 Hủy đơn dễ dàng</span>
          <span>💬 Hỗ trợ 24/7</span>
        </div>

        <h1 class="clothing-title">${safeText(P.displayName || P.name || "")}</h1>

        <div class="clothing-price-box">
          <div class="clothing-sale-price price">${formatPrice(P.price)}</div>
          <div class="clothing-old-price">${formatPrice(P.oldPrice)}</div>
        </div>
      </section>

      <section class="clothing-section">
        <div class="clothing-section-title">Chọn size</div>

        <div class="clothing-size-options">
          ${sizeHtml}
        </div>

        <div class="clothing-size-guide">
          ${clothing.sizeGuideHtml || `
            <strong>HD chọn size</strong>
            38-45kg: size M<br>
            46-62kg: size L
          `}
        </div>
      </section>

      <section class="clothing-section">
        <div class="clothing-section-title">Hình thức thanh toán</div>
        <div class="clothing-line">
          <span class="clothing-cod">COD</span>
          Thanh toán bằng tiền mặt khi nhận hàng.
        </div>
      </section>

      <section class="clothing-section">
        <div class="clothing-section-title">Vận chuyển</div>

        <div class="clothing-line">
          <span class="clothing-old-price">22.000đ</span>
          <span class="clothing-free">Free</span>
        </div>

        <div class="clothing-line">
          <span class="clothing-voucher">Voucher giảm phí vận chuyển</span>
          Giảm 50.000đ phí vận chuyển đối với các đơn hàng từ giá 250.000đ trở lên.
        </div>

        <div class="clothing-line">
          Từ kho ${safeText(clothing.shopName || P.shopName || "Nino-clothing")} đến địa chỉ của khách hàng.
        </div>

        <div class="clothing-line">
          Ngày giao hàng dự kiến: 2 - 4 ngày.
        </div>
      </section>

      <section class="clothing-section">
        <div class="clothing-section-title">Chính sách đổi trả</div>
        <div class="clothing-line">
          ${P.returnPolicy && P.returnPolicy.content
            ? P.returnPolicy.content
            : "Khách được kiểm tra hàng trước khi nhận. Nếu sản phẩm không giống mẫu có thể liên hệ shop để được hỗ trợ đổi trả."}
        </div>
      </section>

      <section class="clothing-section review-section">
        <div class="clothing-section-title">Đánh giá sản phẩm</div>
        ${reviewsHtml}
      </section>

      <section class="clothing-section">
        <div class="clothing-section-title">Mô tả sản phẩm</div>
        <div class="clothing-description">
          ${P.description && P.description.shortHtml ? P.description.shortHtml : ""}
          ${P.description && P.description.fullHtml ? P.description.fullHtml : ""}
        </div>
      </section>

      ${coreDomHtml}
    </main>

    <div class="clothing-bottom-bar">
      <button class="clothing-bottom-buy" id="inlineBuyNowBtn" type="button">
        MUA NGAY
      </button>
    </div>
  `;

  function bindFallbackImages() {
    root.querySelectorAll("img[data-fallback]").forEach(img => {
      img.addEventListener("error", function () {
        if (img.dataset.failed === "1") return;
        img.dataset.failed = "1";
        img.src = img.dataset.fallback;
      });
    });
  }

  function syncSize(size) {
    selectedSize = size;

    root.querySelectorAll("[data-size-option]").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.sizeOption === selectedSize);
    });

    root.querySelectorAll('.variant-group[data-type="size"] .variant-option').forEach(btn => {
      btn.classList.toggle("active", btn.dataset.value === selectedSize);
    });

    P.selectedSize = selectedSize;
    P.selectedVariants = { size: selectedSize };
  }

  function syncQuantity() {
    const qtyInput = document.getElementById("quantity");
    if (!qtyInput) return;

    qtyInput.value = String(comboQty);
    qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
    qtyInput.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function syncCombo() {
    const hiddenCombo = document.querySelector("#clothingHiddenCombos .combo-option");
    if (!hiddenCombo) return;

    hiddenCombo.classList.add("active");
    hiddenCombo.dataset.index = "0";
    hiddenCombo.dataset.price = String(unitPrice);
    hiddenCombo.dataset.comboTotal = String(comboTotal);
    hiddenCombo.dataset.shipfee = String(comboShipFee);
  }

  function applyProductState() {
    syncSize(selectedSize);
    syncCombo();
    syncQuantity();
  }

  function syncSliderUi(activeIndex) {
    root.querySelectorAll("[data-clothing-dot]").forEach(dot => {
      dot.classList.toggle("active", Number(dot.dataset.clothingDot) === activeIndex);
    });

    root.querySelectorAll("[data-clothing-thumb]").forEach(thumb => {
      thumb.classList.toggle("active", Number(thumb.dataset.clothingThumb) === activeIndex);
    });
  }

  const slidesEl = document.getElementById("clothingSlides");

  if (slidesEl) {
    slidesEl.addEventListener("scroll", function () {
      const width = slidesEl.clientWidth || 1;
      const activeIndex = Math.round(slidesEl.scrollLeft / width);
      syncSliderUi(activeIndex);
    }, { passive: true });
  }

  root.querySelectorAll("[data-clothing-thumb]").forEach(thumb => {
    thumb.addEventListener("click", function () {
      const idx = Number(thumb.dataset.clothingThumb || 0);

      if (slidesEl) {
        slidesEl.scrollTo({
          left: idx * slidesEl.clientWidth,
          behavior: "smooth"
        });
      }

      syncSliderUi(idx);
    });
  });

  root.querySelectorAll("[data-size-option]").forEach(btn => {
    btn.addEventListener("click", function () {
      syncSize(btn.dataset.sizeOption);
      applyProductState();
    });
  });

  const buyBtn = document.getElementById("inlineBuyNowBtn");
  if (buyBtn) {
    buyBtn.addEventListener("click", function () {
      applyProductState();
    }, true);
  }

  bindFallbackImages();
  applyProductState();
})();