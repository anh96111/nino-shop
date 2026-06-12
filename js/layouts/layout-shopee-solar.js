(function renderShopeeSolarLayout() {
  const P = PRODUCT_CONFIG;
  const S = (typeof SHARED_CONFIG !== "undefined" && SHARED_CONFIG.shop) ? SHARED_CONFIG.shop : {};
  const C = (typeof SHARED_CONFIG !== "undefined") ? SHARED_CONFIG : {};
  const root = document.getElementById("layoutRoot");
  if (!root) return;

  /* ── Inject Material Symbols Outlined ── */
  if (!document.getElementById("solarMaterialSymbols")) {
    const preconnect1 = document.createElement("link");
    preconnect1.rel = "preconnect";
    preconnect1.href = "https://fonts.googleapis.com";
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement("link");
    preconnect2.rel = "preconnect";
    preconnect2.href = "https://fonts.gstatic.com";
    preconnect2.crossOrigin = "anonymous";
    document.head.appendChild(preconnect2);

    const iconLink = document.createElement("link");
    iconLink.id = "solarMaterialSymbols";
    iconLink.rel = "stylesheet";
    iconLink.href = "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap";
    document.head.appendChild(iconLink);
  }

  const formatPrice = n => Number(n || 0).toLocaleString("vi-VN") + "đ";
  const discountPercent = Math.round((1 - Number(P.price || 0) / Number(P.oldPrice || 1)) * 100);

  const images = Array.isArray(P.images) && P.images.length ? P.images : [];
  const combos = Array.isArray(P.combos) ? P.combos : [];

  const variants = Array.isArray(P.variants) ? P.variants : [];
  const hasVariants = variants.length > 0;
  const hasCombos = combos.length > 0;
  const isBaloProduct = P.slug === "balo";
  const isBanProduct = P.slug === "ban";
  const hasExtraBagVariant = variants.some(v => v.type === "extra_bag_color");
  const shouldRenderVariantArea = isBaloProduct || (isBanProduct && hasExtraBagVariant);

  function getComboSaveAmount(combo) {
    if (!combo || isBaloProduct) return 0;

    const qty = Math.max(1, Number(combo.quantity || 1));
    const basePrice = Number(P.price || 0);
    const comboPrice = Number(combo.price || 0);

    return Math.max(0, basePrice * qty - comboPrice);
  }

  const maxComboSaveAmount = (!isBaloProduct && combos.length)
    ? Math.max(...combos.map(getComboSaveAmount))
    : 0;

    /* ── Thứ tự hiển thị combo ──
    - ban: giữ đúng thứ tự trong file sản phẩm
    - sản phẩm khác: giữ logic đảo như cũ
  */
  const shouldKeepComboOrder = ["ban", "thietbitroluc"].includes(P.slug);

  const displayOrder = shouldKeepComboOrder
    ? combos.map((_, i) => i)
    : combos.map((_, i) => i).reverse();

  const rawTags = Array.isArray(P.sliderTags) ? P.sliderTags : [
    "Công suất<br>40W",
    "Sử dụng liên tục<br>8h",
    "Bảo hành 1 đổi 1<br>trong 6 tháng"
  ];

  const tagIcons = ["bolt", "schedule", "verified"];
  const featureTags = rawTags.slice(0, 3).map((raw, idx) => {
    const parts = String(raw).split(/<br\s*\/?>/i);
    return {
      icon: tagIcons[idx] || "check_circle",
      label: (parts[0] || "").trim(),
      value: (parts[1] || "").trim()
    };
  });

  const ICON_MAP = {
    "📞": "call", "💬": "chat", "📲": "send", "📧": "mail",
    "📍": "location_on", "🚚": "local_shipping", "💵": "payments",
    "💳": "credit_card", "✅": "check_circle", "🛡️": "shield",
    "↩️": "undo", "🎁": "redeem", "⭐": "star", "🔒": "lock",
    "🏬": "storefront", "☀️": "wb_sunny", "🌙": "dark_mode", "💧": "water_drop"
  };
  const toIcon = emoji => ICON_MAP[String(emoji || "").trim()] || "check_circle";

  const reviewItems = (P.reviews && Array.isArray(P.reviews.items)) ? P.reviews.items : [];
  const REVIEW_INITIAL = 10;
  let reviewExpanded = false;
  let reviewLoadErrorShown = false;

  let selectedComboIndex = null;
  const selectedVariants = {};

  /* ── Snapshot thông tin nhận hàng trước khi submit ── */
  let lastCustomerSnapshot = null;

  /* ── Slides HTML ── */
  const slidesHtml = images.length
    ? images.map((src, index) => `
        <div class="slide">
          <img
            src="${src}"
            alt="${P.shortName || P.name || "Sản phẩm"} ${index + 1}"
            loading="${index === 0 ? "eager" : "lazy"}"
            fetchpriority="${index === 0 ? "high" : "low"}"
            decoding="async">
        </div>
      `).join("")
    : `
        <div class="slide slide-placeholder">
          <span class="material-symbols-outlined slide-placeholder-icon">image</span>
          <span>Ảnh sản phẩm 1</span>
        </div>
        <div class="slide slide-placeholder">Ảnh sản phẩm 2</div>
      `;

  const dotsHtml = (images.length ? images : [1, 2]).map((_, index) => `
    <span class="dot ${index === 0 ? "active" : ""}" data-dot="${index}"></span>
  `).join("");

  const thumbsHtml = images.length
  ? images.map((src, index) => `
      <button type="button" class="solar-thumb ${index === 0 ? "active" : ""}" data-thumb="${index}">
        <img src="${src}" alt="thumb ${index + 1}" loading="lazy" decoding="async">
      </button>
    `).join("")
  : "";


  const featureTagsHtml = featureTags.map(t => `
    <div class="solar-feature-tag">
      <span class="material-symbols-outlined solar-feature-icon">${t.icon}</span>
      <p class="solar-feature-label">${t.label}</p>
      <p class="solar-feature-value">${t.value}</p>
    </div>
  `).join("");

  function buildVariantOptionsHtml(variant) {
    const type = variant.type || "";
    const label = variant.label || type;
    const extraBagStockHtml = type === "extra_bag_color" && P.extraBagGift?.enabled
      ? `<span class="solar-extra-bag-stock">(số lượng túi còn: <strong id="solarExtraBagStock">${P.extraBagGift.initialStock || 14}</strong>)</span>`
      : "";
    const options = Array.isArray(variant.options) ? variant.options : [];

    if (!options.length) return "";

    if (!selectedVariants[type]) {
      selectedVariants[type] = options[0].name || "";
    }

    const optionsHtml = options.map((opt, index) => {
      const name = opt.name || "";
      const image = opt.image || "";
      const active = selectedVariants[type] === name || (!selectedVariants[type] && index === 0);

      const colorUiNameMap = {
        "Navy Phối Xanh Lá": "Xanh lá",
        "Navy": "Navy",
        "Navy Phối Hồng": "Hồng",
        "Nâu": "Nâu"
      };

      const displayName = type === "color"
        ? (colorUiNameMap[name] || name)
        : name;

      return `
        <button type="button"
          class="solar-variant-option ${active ? "active" : ""}"
          data-variant-type="${type}"
          data-variant-name="${name}"
          data-variant-index="${index}">
          ${image ? `<img src="${image}" alt="${displayName}" loading="lazy" decoding="async">` : ""}
          <span>${displayName}</span>
        </button>
      `;
    }).join("");

    return `
      <div class="solar-variant-group" data-variant-group="${type}">
        <div class="solar-section-head">
          <div class="solar-section-title">${label} ${extraBagStockHtml}</div>
          <div class="solar-section-hint" data-variant-hint="${type}">
            Đã chọn: ${selectedVariants[type]}
          </div>
        </div>
        <div class="solar-variant-list">
          ${optionsHtml}
        </div>
      </div>
    `;
  }

  const tableColorVariants = isBanProduct
    ? variants.filter(v => v.type === "table_color")
    : [];

  const giftVariants = isBanProduct
    ? variants.filter(v => v.type !== "table_color")
    : variants;

  const tableColorVariantHtml = tableColorVariants.length
    ? `
      <div class="solar-variant-area solar-table-color-area" id="solarTableColorArea">
        ${tableColorVariants.map(buildVariantOptionsHtml).join("")}
      </div>
    `
    : "";

  const variantHtml = giftVariants.length
    ? `
      <div class="solar-variant-area" id="solarVariantArea">
        ${giftVariants.map(buildVariantOptionsHtml).join("")}
      </div>
    `
    : "";

  /* ── Combo cards hiển thị theo displayOrder, data-index vẫn dùng index GỐC ── */
  const comboHtml = displayOrder.map(index => {
    const c = combos[index];
    const tagClass = c.tagType === "save" ? "tag-save" : "tag-hot";
    const hasShip = Number(c.shipFee || 0) > 0;
    const shipText = hasShip
      ? "+" + Math.round(Number(c.shipFee) / 1000) + "K Ship"
      : "Miễn phí vận chuyển";
    const shipClass = hasShip ? "ship-fee" : "ship-free";
    const priceK = Math.round(Number(c.price || 0) / 1000) + "K";

    const saveAmount = getComboSaveAmount(c);
    const saveHtml = saveAmount > 0
      ? `<div class="combo-save-amount">Tiết kiệm ${formatPrice(saveAmount)}</div>`
      : "";

    return `
      <label class="combo-card" data-combo-card data-index="${index}">
        ${c.tag ? `<span class="combo-tag ${tagClass}">${c.tag}</span>` : ""}
        ${saveHtml}
        <input type="radio" name="solarCombo" value="${index}">
        <div class="combo-content">
          <div class="combo-info">
            <div class="combo-name">${c.name || ""}</div>
            <div class="combo-desc">${c.note || ""}</div>
            <div class="combo-ship ${shipClass}">${shipText}</div>
          </div>
          <div class="combo-price-wrap">
            <div class="combo-price">${priceK}</div>
          </div>
        </div>
        <div class="combo-check">
          <span class="material-symbols-outlined">check</span>
        </div>
      </label>
    `;
  }).join("");

  function renderReviewItem(rv) {
    const stars = Number(rv.stars || 5);
    const starsHtml = Array.from({ length: 5 }, (_, i) => `
      <span class="material-symbols-outlined solar-review-star ${i < stars ? "filled" : ""}">star</span>
    `).join("");

    const mediaArr = Array.isArray(rv.media) ? rv.media : [];
    const mediaHtml = mediaArr.length
     ? `<div class="solar-review-media">
         ${mediaArr.map((m, idx) => {
          const src = typeof m === "string" ? m : (m && m.src ? m.src : "");
          const mediaFullArr = Array.isArray(rv.mediaFull) ? rv.mediaFull : [];
          const fullSrc = typeof m === "object" && m.fullSrc
            ? m.fullSrc
            : (mediaFullArr[idx] || src);
          const poster = typeof m === "object" && m.poster ? m.poster : src;
          const isVideo = typeof m === "object" && m.type === "video";

           if (!src) return "";

           return isVideo
             ? `<button type="button" class="solar-review-media-item is-video" data-review-video="${src}">
                  <img src="${poster}" alt="review video" loading="lazy" decoding="async">
                  <span class="material-symbols-outlined">play_circle</span>
                </button>`
             : `<button type="button" class="solar-review-media-item is-image" data-review-image="${fullSrc}">
                  <img src="${src}" alt="review media" loading="lazy" decoding="async">
                </button>`;
         }).join("")}
       </div>`
     : "";

    const classifyHtml = rv.classify ? `<div class="solar-review-classify">Phân loại: ${rv.classify}</div>` : "";

    return `
      <div class="solar-review-item">
        <div class="solar-review-head">
          <img class="solar-review-avatar" src="${rv.avatar || ""}" alt="${rv.name || ""}" loading="lazy" decoding="async">
          <div class="solar-review-meta">
            <div class="solar-review-name">${rv.name || ""}</div>
            <div class="solar-review-stars">${starsHtml}</div>
            <div class="solar-review-date">${rv.date || ""}</div>
          </div>
        </div>
        ${classifyHtml}
        <p class="solar-review-content">${rv.content || ""}</p>
        ${mediaHtml}
      </div>
    `;
  }

  function buildReviewsHtml() {
    if (!reviewItems.length) {
      return `<p class="solar-review-empty">Chưa có đánh giá.</p>`;
    }

    const shown = reviewExpanded ? reviewItems : reviewItems.slice(0, REVIEW_INITIAL);
    const listHtml = shown.map(renderReviewItem).join("");

    const moreBtnHtml = !reviewExpanded
      ? `<button type="button" class="solar-review-more" id="solarReviewMoreBtn">
          Xem thêm 1.2k đánh giá
          <span class="material-symbols-outlined">expand_more</span>
        </button>`
      : "";

    const loadErrorHtml = reviewLoadErrorShown
      ? `<div class="solar-review-load-error">
          Không thể tải thêm đánh giá khác vì mất kết nối mạng
        </div>`
      : "";

    return `<div class="solar-review-list" id="solarReviewList">${listHtml}</div>${moreBtnHtml}${loadErrorHtml}`;
  }

  const shopStats = Array.isArray(S.stats) ? S.stats : [];
  const shopStatsHtml = shopStats.map(s => `
    <div class="solar-shop-stat">
      <span class="solar-shop-stat-label">${s.label}</span>
      <span class="solar-shop-stat-value">${s.value}</span>
    </div>
  `).join("");

  const shopHtml = `
    <div class="solar-shop-block">
      <div class="solar-shop-head">
        ${S.avatar ? `<img class="solar-shop-avatar" src="${S.avatar}" alt="${S.name || ""}" loading="lazy" decoding="async">` : ""}
        <div class="solar-shop-meta">
          <div class="solar-shop-name">${S.name || ""}</div>
          <div class="solar-shop-online">
            <span class="solar-shop-dot"></span>
            ${S.onlineStatus || ""}
          </div>
        </div>
      </div>
      ${shopStatsHtml ? `<div class="solar-shop-stats">${shopStatsHtml}</div>` : ""}
    </div>
  `;

  const contactArr = Array.isArray(C.contact) ? C.contact : [];
  const contactHtml = contactArr.length ? `
    <div class="solar-card">
      <div class="solar-card-head">
        <span class="material-symbols-outlined solar-card-icon">support_agent</span>
        <h3>Liên hệ</h3>
      </div>
      <div class="solar-info-list">
        ${contactArr.map(c => `
          <div class="solar-info-row">
            <span class="material-symbols-outlined solar-info-icon">${toIcon(c.icon)}</span>
            <span class="solar-info-text"><strong>${c.label}:</strong> ${c.value}</span>
          </div>
        `).join("")}
      </div>
    </div>
  ` : "";

  const storesArr = Array.isArray(C.stores) ? C.stores : [];
  const storesHtml = storesArr.length ? `
    <div class="solar-card">
      <div class="solar-card-head">
        <span class="material-symbols-outlined solar-card-icon">storefront</span>
        <h3>Hệ thống cửa hàng</h3>
      </div>
      <div class="solar-info-list">
        ${storesArr.map(s => `
          <div class="solar-info-row">
            <span class="material-symbols-outlined solar-info-icon">location_on</span>
            <span class="solar-info-text">${s}</span>
          </div>
        `).join("")}
      </div>
      ${C.storeMapImage ? `
        <img class="solar-store-map" src="${C.storeMapImage}" alt="Bản đồ cửa hàng" loading="lazy" decoding="async">
      ` : ""}
    </div>
  ` : "";

  const policiesArr = Array.isArray(P.policies) ? P.policies : [];
  const policiesHtml = policiesArr.length ? `
    <div class="solar-card">
      <div class="solar-card-head">
        <span class="material-symbols-outlined solar-card-icon">policy</span>
        <h3>Chính sách</h3>
      </div>
      <div class="solar-info-list">
        ${policiesArr.map(p => `
          <div class="solar-info-row">
            <span class="material-symbols-outlined solar-info-icon">${toIcon(p.icon)}</span>
            <span class="solar-info-text">${p.text}</span>
          </div>
        `).join("")}
      </div>
    </div>
  ` : "";

  const faqsArr = Array.isArray(P.faqs) ? P.faqs : [];
  const faqsHtml = faqsArr.length ? `
    <div class="solar-card">
      <div class="solar-card-head">
        <span class="material-symbols-outlined solar-card-icon">help</span>
        <h3>Câu hỏi thường gặp</h3>
      </div>
      <div class="solar-faq-list">
        ${faqsArr.map((f, i) => `
          <div class="solar-faq-item" data-faq-item="${i}">
            <button type="button" class="solar-faq-head" data-faq-toggle="${i}">
              <span class="solar-faq-q">${f.q}</span>
              <span class="material-symbols-outlined solar-faq-arrow">expand_more</span>
            </button>
            <div class="solar-faq-body" data-faq-body="${i}">
              <p>${f.a}</p>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  ` : "";

  /* ── HIDDEN STUBS cho core.js ── */
  const hiddenCombosHtml = combos.map((c, idx) => {
   const qty = Math.max(1, Number(c.quantity || 1));
   const comboTotal = Number(c.price || 0);
   const unitPrice = Math.floor(comboTotal / qty);
   return `
     <button type="button" class="combo-option" data-index="${idx}" data-price="${unitPrice}" data-combo-total="${comboTotal}" data-shipfee="${Number(c.shipFee || 0)}">
        <span class="combo-name">${c.name || ""}</span>
        <span class="combo-price">${unitPrice}</span>
      </button>
    `;
  }).join("");

  const coreStubsHtml = `
    <div class="solar-core-stubs" aria-hidden="true">
      <div id="slider">
        <div id="slides"></div>
        <div id="dots"></div>
      </div>
      <input type="number" id="quantity" value="1">
      <button type="button" id="minusQty"></button>
      <button type="button" id="plusQty"></button>
      <button type="button" id="inlineAddToCartBtn"></button>
      <button type="button" id="inlineBuyNowBtn"></button>
      <div class="combos-wrap" id="solarHiddenCombos">
        ${hiddenCombosHtml}
      </div>
    </div>
  `;

  root.innerHTML = `
    <main class="solar-page">
      <section class="solar-product-wrap">
        <div class="solar-gallery">
          <div class="solar-slider">
            <div class="solar-slides" id="solarSlides">
              ${slidesHtml}
            </div>
          </div>

          <div class="solar-dots">
            ${dotsHtml}
          </div>

          <div class="solar-feature-tags solar-feature-tags--below">
            ${featureTagsHtml}
          </div>

          <div class="solar-thumbs" id="solarThumbs">
            ${thumbsHtml}
          </div>
          </div>
         </div>

        <div class="solar-info">
          <div class="solar-shop-row">
            ${isBanProduct ? `
              <span class="solar-fav-badge">🏆 Đạt tiêu chuẩn Nhật Bản</span>
            ` : `
              <span class="solar-fav-badge">Yêu thích</span>
              ${isBaloProduct ? "" : `
                <span class="solar-shop-cat">${P.category || "Đèn năng lượng mặt trời"}</span>
              `}
            `}
          </div>

          <h1>${P.uiName || P.name || P.shortName || "Đèn Năng Lượng Mặt Trời 40W"}</h1>

          <div class="solar-proof-row">
            <span class="solar-proof-rating">★ <strong>4.8/5</strong> <span>(1.2k)</span></span>
            <span class="solar-proof-sep">|</span>
            <span class="solar-proof-sold">Đã bán <strong>112.7k</strong></span>
            <span class="solar-proof-ship">🚚 Miễn phí vận chuyển</span>
          </div>

          <div class="solar-rank-box">
            <div class="solar-rank-item">🏆 Top sản phẩm bán chạy</div>
            <div class="solar-rank-item">Tỷ lệ khách hàng mua lại 95%</div>
          </div>

          ${isBaloProduct ? "" : `
            <div class="solar-trust-row">
              <div class="solar-trust-item">💳 Thanh toán bảo mật</div>
              <div class="solar-trust-item">🛒 Hủy đơn dễ dàng</div>
              <div class="solar-trust-item">💬 Hỗ trợ 24/7</div>
            </div>
          `}

          <div class="solar-price-box">
            <div class="solar-price-line">
              <span class="solar-price">${formatPrice(P.price)}${P.priceUnit ? `<span class="solar-price-unit"> ${P.priceUnit}</span>` : ""}</span>
              ${isBaloProduct ? `
                <span class="solar-old-price">${formatPrice(P.oldPrice)}</span>
                <span class="solar-discount">-${discountPercent}%</span>
              ` : ""}
              <span class="solar-return-tag">↩️ Miễn phí đổi trả 7 ngày</span>
            </div>
            <p class="solar-price-note">
              <span class="material-symbols-outlined">info</span>
              ${isBaloProduct
                ? "Giá đã bao gồm bộ quà tặng và miễn phí vận chuyển."
                : (maxComboSaveAmount > 0
                    ? `Chọn combo để tiết kiệm đến ${formatPrice(maxComboSaveAmount)}.`
                    : "Chọn combo ưu đãi để đặt hàng.")}
            </p>
          </div>
          ${isBanProduct ? tableColorVariantHtml : ""}
          ${hasCombos ? `
            <div class="solar-combo-area" id="solarComboArea">
              <div class="solar-section-head">
                <div class="solar-section-title">Chọn combo ưu đãi</div>
                <div class="solar-section-hint" id="solarComboHint">Chưa chọn</div>
              </div>

              <div class="solar-combo-list">
                ${comboHtml}
              </div>

              <div class="solar-notice" id="solarNotice">
                Vui lòng chọn combo trước khi đặt hàng
              </div>
            </div>
          ` : ""}

          ${shouldRenderVariantArea ? `
            ${variantHtml}

            ${isBaloProduct ? `
              <div class="solar-variant-actions">
                <button type="button" class="solar-variant-add" id="solarVariantAddToCart">
                  Thêm giỏ hàng
                </button>

                <button type="button" class="solar-variant-buy" id="solarVariantBuyNow">
                  Mua ngay
                </button>
              </div>
            ` : ""}
          ` : ""}

          <div class="solar-content-area">

           <div class="solar-content-block solar-review-section">
            <h2 class="solar-review-main-title">Khách hàng nói gì về sản phẩm</h2>

            <div class="solar-content-head solar-review-small-head">
              <span class="material-symbols-outlined solar-content-icon">reviews</span>
              <h3>Đánh giá sản phẩm</h3>
            </div>

            <div id="solarReviewWrap">${buildReviewsHtml()}</div>
          </div>

           <div class="solar-soft-line"></div>

           <div class="solar-content-block">
             <div class="solar-content-head">
               <span class="material-symbols-outlined solar-content-icon">description</span>
               <h2>Mô tả sản phẩm</h2>
             </div>

             <div class="solar-desc-content">
               <div class="solar-desc-short">
                 ${P.description?.shortHtml || ""}
               </div>

               <div id="solarDescFull" class="solar-desc-full">
                 ${P.description?.fullHtml || ""}
               </div>

               <button id="solarDescMoreBtn" class="solar-desc-more" type="button">
                 Xem thêm
                 <span class="material-symbols-outlined">expand_more</span>
               </button>
             </div>
           </div>

           <div class="solar-soft-line"></div>

           ${shopHtml}
           ${contactHtml}
           ${storesHtml}
           ${policiesHtml}
           ${faqsHtml}
         </div>
        </div>
      </section>

      ${coreStubsHtml}
    </main>

    <div class="solar-bottom-bar solar-bottom-bar--single">
      <button class="solar-bottom-cart" id="goToCartBtn" type="button">
        <span class="material-symbols-outlined">shopping_cart</span>
        <span class="cart-badge" id="cartBadge"></span>
      </button>

      <button class="solar-bottom-buy" id="solarBuyNow" type="button">
        <span class="material-symbols-outlined">bolt</span>
        MUA NGAY
      </button>
    </div>
  `;

  /* ── Sync hidden .combo-option active ── */
  function syncHiddenCombo() {
    const hidden = document.querySelectorAll("#solarHiddenCombos .combo-option");
    hidden.forEach(el => {
      const isActive = Number(el.dataset.index) === selectedComboIndex;
      el.classList.toggle("active", isActive);
    });
  }

  /* ── Combo selection ── */
  function setSelectedCombo(index) {
    selectedComboIndex = Number(index);

    document.querySelectorAll("[data-combo-card]").forEach(card => {
      const isActive = Number(card.dataset.index) === selectedComboIndex;
      card.classList.toggle("active", isActive);
      const input = card.querySelector("input");
      if (input) input.checked = isActive;
    });

    syncHiddenCombo();

    const combo = combos[selectedComboIndex];
    const hint = document.getElementById("solarComboHint");
    const notice = document.getElementById("solarNotice");
    const area = document.getElementById("solarComboArea");

    if (hint && combo) {
      hint.textContent = "Đã chọn: " + combo.name;
      hint.classList.remove("is-error");
    }
    if (notice) {
      notice.textContent = "Đã chọn: " + (combo?.name || "");
      notice.classList.remove("is-error", "shake-error");
    }
    if (area) area.classList.remove("is-error");
    updateExtraBagVariantVisibility();
  }

  function updateExtraBagVariantVisibility() {
    if (!isBanProduct) return;

    const combo = selectedComboIndex !== null ? combos[selectedComboIndex] : null;
    const shouldShow = !!combo?.showExtraBagVariant;

    const variantArea = document.getElementById("solarVariantArea");
    const extraBagGroup = document.querySelector('[data-variant-group="extra_bag_color"]');

    if (extraBagGroup) {
      extraBagGroup.style.display = shouldShow ? "" : "none";
    }

    if (variantArea) {
      const hasVisibleGiftVariant = shouldShow && extraBagGroup;
      variantArea.style.display = hasVisibleGiftVariant ? "" : "none";
    }

    if (shouldShow && !selectedVariants.extra_bag_color) {
      const firstExtraBagOption = document.querySelector('[data-variant-type="extra_bag_color"]');

      if (firstExtraBagOption) {
        selectedVariants.extra_bag_color = firstExtraBagOption.dataset.variantName || "";

        document.querySelectorAll('[data-variant-type="extra_bag_color"]').forEach(item => {
          item.classList.toggle("active", item === firstExtraBagOption);
        });

        const hint = document.querySelector('[data-variant-hint="extra_bag_color"]');
        if (hint) {
          hint.textContent = "Đã chọn: " + selectedVariants.extra_bag_color;
        }
      }
    }

    if (!shouldShow && selectedVariants.extra_bag_color) {
      delete selectedVariants.extra_bag_color;
      P.selectedVariants = { ...selectedVariants };

      if (typeof window.PRODUCT === "object" && window.PRODUCT) {
        window.PRODUCT.selectedVariants = { ...selectedVariants };
      }
    }
  }

  function requireCombo() {
    if (selectedComboIndex === null) {
      const notice = document.getElementById("solarNotice");
      const area = document.getElementById("solarComboArea");
      const hint = document.getElementById("solarComboHint");

      if (notice) {
        notice.textContent = "⚠ Vui lòng chọn combo trước khi đặt hàng";
        notice.classList.add("is-error", "shake-error");
        setTimeout(() => notice.classList.remove("shake-error"), 500);
      }
      if (area) {
        area.classList.add("is-error");
        area.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (hint) {
        hint.textContent = "Chưa chọn";
        hint.classList.add("is-error");
      }
      return null;
    }

    return combos[selectedComboIndex];
  }

  function applyComboToProduct(combo) {
    if (!combo) return;

    const qty = Math.max(1, Number(combo.quantity || 1));
    const comboTotal = Number(combo.price || 0);
    const unitPrice = Math.floor(comboTotal / qty);

    window.__selectedSolarCombo = {
     name: combo.name,
     quantity: qty,
     price: comboTotal,
     unitPrice: unitPrice,
     oldPrice: Number(combo.oldPrice || 0),
     shipFee: Number(combo.shipFee || 0),
     note: combo.note || ""
    };

    P.selectedCombo = window.__selectedSolarCombo;
    P.price = unitPrice;
    P.oldPrice = Number(combo.oldPrice || P.oldPrice || 0);
    P.shipFee = Number(combo.shipFee || 0);

    if (typeof window.PRODUCT === "object" && window.PRODUCT) {
      window.PRODUCT.price = unitPrice;
    }

    const qtyInput = document.getElementById("quantity");
    if (qtyInput) {
      qtyInput.value = String(qty);
      qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function triggerCoreBuy() {
    const inlineBuy = document.getElementById("inlineBuyNowBtn");
    if (inlineBuy && typeof inlineBuy.click === "function") {
      inlineBuy.click();
      return true;
    }
    const bottomBuy = document.getElementById("buyNowBtn");
    if (bottomBuy && typeof bottomBuy.click === "function") {
      bottomBuy.click();
      return true;
    }
    return false;
  }

function applySelectedVariantsToProduct(forceQty) {
  const finalVariants = { ...selectedVariants };

  if (isBanProduct && finalVariants.table_color) {
    finalVariants.color = finalVariants.table_color;
  }

  const selectedText = Object.values(finalVariants).filter(Boolean).join(" - ");

  P.selectedVariantText = selectedText;
  P.selectedVariants = finalVariants;

  if (typeof window.PRODUCT === "object" && window.PRODUCT) {
    window.PRODUCT.selectedVariantText = selectedText;
    window.PRODUCT.selectedVariants = finalVariants;
  }

  if (forceQty) {
    const qtyInput = document.getElementById("quantity");
    if (qtyInput) {
      qtyInput.value = String(forceQty);
      qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }
}

function openCheckout() {
  if (isBaloProduct) {
    applySelectedVariantsToProduct(1);

    if (triggerCoreBuy()) return;

    if (typeof window.openVariantPopup === "function") {
      window.openVariantPopup();
      return;
    }

    return;
  }

  const combo = requireCombo();
  if (!combo) return;

  applyComboToProduct(combo);
  syncHiddenCombo();

  if (isBanProduct && combo.showExtraBagVariant) {
    applySelectedVariantsToProduct(combo.quantity);
  } else if (isBanProduct) {
    delete selectedVariants.extra_bag_color;
    applySelectedVariantsToProduct(combo.quantity);
  }

  if (triggerCoreBuy()) return;

  if (typeof window.openVariantPopup === "function") {
    window.openVariantPopup();
    return;
  }
  if (typeof window.openCheckoutPopup === "function") {
    window.openCheckoutPopup();
    return;
  }
}

  document.querySelectorAll("[data-combo-card]").forEach(card => {
    card.addEventListener("click", () => {
      setSelectedCombo(card.dataset.index);
    });
  });
  updateExtraBagVariantVisibility();

  document.querySelectorAll("[data-variant-name]").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.variantType || "";
      const name = btn.dataset.variantName || "";

      if (!type || !name) return;

      selectedVariants[type] = name;

      document.querySelectorAll(`[data-variant-type="${type}"]`).forEach(item => {
        item.classList.toggle("active", item.dataset.variantName === name);
      });

      const hint = document.querySelector(`[data-variant-hint="${type}"]`);
      if (hint) {
        hint.textContent = "Đã chọn: " + name;
      }

      if (type === "color") {
        const idx = Number(btn.dataset.variantIndex || 0);
        const slidesEl2 = document.getElementById("solarSlides");
        const targetSlide = slidesEl2 ? slidesEl2.querySelectorAll(".slide")[idx] : null;

        if (slidesEl2 && targetSlide) {
          slidesEl2.scrollLeft = targetSlide.offsetLeft;
        }

        document.querySelectorAll("[data-dot]").forEach(dot => {
          dot.classList.toggle("active", Number(dot.dataset.dot) === idx);
        });

        document.querySelectorAll("[data-thumb]").forEach(thumb => {
          thumb.classList.toggle("active", Number(thumb.dataset.thumb) === idx);
        });
      }
    });
  });

  const slidesEl = document.getElementById("solarSlides");
  if (slidesEl) {
    slidesEl.addEventListener("scroll", () => {
      const slides = Array.from(slidesEl.querySelectorAll(".slide"));
      if (!slides.length) return;

      let activeIndex = 0;
      let minDistance = Infinity;

      slides.forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft - slidesEl.scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          activeIndex = index;
        }
      });

      document.querySelectorAll("[data-dot]").forEach(dot => {
        dot.classList.toggle("active", Number(dot.dataset.dot) === activeIndex);
      });

      document.querySelectorAll("[data-thumb]").forEach(t => {
        t.classList.toggle("active", Number(t.dataset.thumb) === activeIndex);
      });

      if (activeIndex <= 3) {
        const colorBtn = document.querySelector(
          `[data-variant-type="color"][data-variant-index="${activeIndex}"]`
        );

        if (colorBtn) {
          const colorName = colorBtn.dataset.variantName || "";

          selectedVariants.color = colorName;

          document.querySelectorAll(`[data-variant-type="color"]`).forEach(item => {
            item.classList.toggle("active", item === colorBtn);
          });

          const hint = document.querySelector(`[data-variant-hint="color"]`);
          if (hint) {
            hint.textContent = "Đã chọn: " + colorName;
          }
        }
      }

    }, { passive: true });
  }

  document.querySelectorAll("[data-thumb]").forEach(thumb => {
    thumb.addEventListener("click", () => {
        const idx = Number(thumb.dataset.thumb);
        const slidesEl2 = document.getElementById("solarSlides");
        if (slidesEl2) {
        slidesEl2.scrollTo({ left: idx * slidesEl2.clientWidth, behavior: "smooth" });
        }
    });
  });

  function bindReviewMoreBtn() {
    const btn = document.getElementById("solarReviewMoreBtn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      reviewExpanded = true;
      reviewLoadErrorShown = true;

      const wrap = document.getElementById("solarReviewWrap");
      if (wrap) {
        wrap.innerHTML = buildReviewsHtml();
        bindReviewVideoBtns();
        bindReviewImageBtns();
      }
    });
  }
  bindReviewMoreBtn();

  function injectReviewImageStyle() {
    if (document.getElementById("solar-review-image-style")) return;

    const style = document.createElement("style");
    style.id = "solar-review-image-style";
    style.textContent = `
      .combo-tag.tag-save {
        background: linear-gradient(135deg, #16a34a, #22c55e) !important;
        color: #fff !important;
      }

      .solar-review-load-error {
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 12px;
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #b91c1c;
        font-size: 13px;
        font-weight: 800;
        text-align: center;
      }

      .solar-feature-tags--sticky {
        display: none !important;
      }

      .solar-feature-tags--below {
        position: static !important;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        margin: 10px 0 8px;
        padding: 0 4px;
      }

      .solar-feature-tags--below .solar-feature-tag {
        min-height: 58px;
        border-radius: 12px;
        background: #ffffff;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
      }

      .solar-feature-tags--below .solar-feature-icon {
        font-size: 18px;
      }

      .solar-feature-tags--below .solar-feature-label {
        font-size: 11px;
        line-height: 1.2;
      }

      .solar-feature-tags--below .solar-feature-value {
        font-size: 12px;
        line-height: 1.2;
      }

      .combo-tag.tag-hot {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #fff;
      }

      .solar-proof-row {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .solar-return-tag {
        display: inline-flex;
        align-items: center;
        width: fit-content;
        padding: 4px 8px;
        border-radius: 999px;
        background: #ecfdf5;
        border: 1px solid #86efac;
        color: #15803d;
        font-size: 12px;
        font-weight: 800;
        white-space: nowrap;
      }

      .solar-bottom-bar--single {
        display: grid;
        grid-template-columns: 56px 1fr;
        gap: 10px;
        align-items: center;
      }

      .solar-bottom-cart {
        position: relative;
        height: 52px;
        border: 1px solid #ef4444;
        border-radius: 14px;
        background: #fff;
        color: #ef4444;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .solar-bottom-cart .material-symbols-outlined {
        font-size: 26px;
      }

      .solar-bottom-cart .cart-badge {
        position: absolute;
        top: -6px;
        right: -6px;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        border-radius: 999px;
        background: #ef4444;
        color: #fff;
        font-size: 11px;
        font-weight: 900;
        line-height: 18px;
        text-align: center;
        display: none;
      }

      .solar-bottom-cart .cart-badge.show {
        display: inline-block;
      }

      .solar-variant-actions {
        display: grid;
        grid-template-columns: 2fr 5fr;
        gap: 10px;
        margin: 12px 0 16px;
      }

      .solar-variant-add,
      .solar-variant-buy {
        border: none;
        border-radius: 14px;
        padding: 13px 10px;
        font-size: 14px;
        font-weight: 900;
        cursor: pointer;
      }

      .solar-variant-add {
        background: #fff;
        color: #ef4444;
        border: 1px solid #ef4444;
      }

      .solar-variant-buy {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: #fff;
      }

      .solar-extra-bag-stock {
        display: inline-block;
        margin-left: 4px;
        font-size: 12px;
        font-weight: 600;
        color: #ef4444;
      }

      .solar-extra-bag-stock strong {
        font-weight: 900;
      }

      .solar-proof-ship {
        margin-left: auto;
        white-space: nowrap;
      }

      .solar-variant-area {
        margin: 14px 0;
      }

      .solar-variant-group {
        margin-bottom: 16px;
      }

      .solar-variant-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .solar-variant-group[data-variant-group="color"] .solar-variant-list,
      .solar-variant-group[data-variant-group="extra_bag_color"] .solar-variant-list {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 8px;
      }

      .solar-variant-group[data-variant-group="color"] .solar-variant-option,
      .solar-variant-group[data-variant-group="extra_bag_color"] .solar-variant-option {
        min-width: 0;
        flex: unset;
        padding: 6px 4px;
        font-size: 11px;
      }

      .solar-variant-group[data-variant-group="color"] .solar-variant-option img,
      .solar-variant-group[data-variant-group="extra_bag_color"] .solar-variant-option img {
        width: 52px;
        height: 52px;
        margin-bottom: 4px;
      }

      .solar-variant-option {
        min-width: calc(50% - 4px);
        flex: 1 1 calc(50% - 4px);
        border: 1px solid #e5e7eb;
        background: #fff;
        border-radius: 12px;
        padding: 8px;
        cursor: pointer;
        text-align: center;
        font-size: 13px;
        font-weight: 700;
        color: #111827;
      }

      .solar-variant-option.active {
        border-color: #ef4444;
        background: #fff7f7;
        box-shadow: 0 0 0 1px #ef4444 inset;
      }

      .solar-variant-option img {
        width: 72px;
        height: 72px;
        object-fit: cover;
        border-radius: 10px;
        display: block;
        margin: 0 auto 6px;
      }

      .solar-variant-option span {
        display: block;
        line-height: 1.35;
      }

      .solar-review-media-item.is-image {
        position: relative;
        overflow: hidden;
        padding: 0;
        border: none;
        background: transparent;
        cursor: pointer;
      }

      .solar-review-media-item.is-image img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
      }

      .solar-review-image-overlay {
        position: fixed;
        inset: 0;
        z-index: 100002;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px;
        background: rgba(0, 0, 0, 0.78);
      }

      .solar-review-image-box {
        position: relative;
        width: 100%;
        max-width: 92vw;
        max-height: 94vh;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .solar-review-image-box img {
        display: block;
        width: auto;
        max-width: 92vw;
        max-height: 94vh;
        border-radius: 14px;
        object-fit: contain;
        background: #000;
        box-shadow: 0 18px 45px rgba(0, 0, 0, 0.35);
      }

      .solar-review-image-close {
        position: absolute;
        top: -10px;
        right: -10px;
        z-index: 2;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(17, 24, 39, 0.86);
        color: #fff;
        cursor: pointer;
      }

      .solar-review-image-close .material-symbols-outlined {
        font-size: 22px !important;
      }
    `;
    document.head.appendChild(style);
  }

  function openReviewImage(src) {
    if (!src) return;

    injectReviewImageStyle();

    const old = document.getElementById("solarReviewImageOverlay");
    if (old) old.remove();

    const overlay = document.createElement("div");
    overlay.id = "solarReviewImageOverlay";
    overlay.className = "solar-review-image-overlay";
    overlay.innerHTML = `
      <div class="solar-review-image-box">
        <button type="button" class="solar-review-image-close" id="solarReviewImageClose">
          <span class="material-symbols-outlined">close</span>
        </button>
        <img src="${src}" alt="review media full" decoding="async">
      </div>
    `;

    document.body.appendChild(overlay);

    const closeBtn = document.getElementById("solarReviewImageClose");
    closeBtn.addEventListener("click", function () {
      overlay.remove();
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });
  }

  function bindReviewImageBtns() {
    document.querySelectorAll("[data-review-image]").forEach(btn => {
      btn.addEventListener("click", function () {
        openReviewImage(btn.dataset.reviewImage);
      });
    });
  }

  function openReviewVideo(src) {
    if (!src) return;

    const old = document.getElementById("solarReviewVideoOverlay");
    if (old) old.remove();

    const overlay = document.createElement("div");
    overlay.id = "solarReviewVideoOverlay";
    overlay.className = "solar-review-video-overlay";
    overlay.innerHTML = `
      <div class="solar-review-video-box">
        <button type="button" class="solar-review-video-close" id="solarReviewVideoClose">
          <span class="material-symbols-outlined">close</span>
        </button>
        <video src="${src}" controls autoplay playsinline></video>
      </div>
    `;

    document.body.appendChild(overlay);

    const closeBtn = document.getElementById("solarReviewVideoClose");
    closeBtn.addEventListener("click", function () {
      overlay.remove();
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.remove();
    });
  }

  function bindReviewVideoBtns() {
    document.querySelectorAll("[data-review-video]").forEach(btn => {
      btn.addEventListener("click", function () {
        openReviewVideo(btn.dataset.reviewVideo);
      });
    });
  }

  bindReviewVideoBtns();
  bindReviewImageBtns();
  injectReviewImageStyle();

  const descMoreBtn = document.getElementById("solarDescMoreBtn");
  const descFull = document.getElementById("solarDescFull");

  if (descMoreBtn && descFull) {
    descMoreBtn.addEventListener("click", function () {
      descFull.classList.add("show");
      descMoreBtn.remove();
    });
  }

  document.querySelectorAll("[data-faq-toggle]").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.dataset.faqToggle;
      const item = document.querySelector(`[data-faq-item="${idx}"]`);
      if (item) item.classList.toggle("open");
    });
  });

  const variantAddBtn = document.getElementById("solarVariantAddToCart");
  if (variantAddBtn) {
    variantAddBtn.addEventListener("click", () => {
      applySelectedVariantsToProduct(1);

      const inlineAdd = document.getElementById("inlineAddToCartBtn");
      if (inlineAdd && typeof inlineAdd.click === "function") {
        inlineAdd.click();
      }
    });
  }

  const variantBuyBtn = document.getElementById("solarVariantBuyNow");
  if (variantBuyBtn) {
    variantBuyBtn.addEventListener("click", () => {
      openCheckout();
    });
  }
  const buyBtn = document.getElementById("solarBuyNow");
  if (buyBtn) buyBtn.addEventListener("click", openCheckout);

  function startSolarExtraBagStockTimer() {
    if (!isBaloProduct && !isBanProduct) return;
    if (!P.extraBagGift?.enabled) return;

    const stockEl = document.getElementById("solarExtraBagStock");
    if (!stockEl) return;

    let stock = Number(P.extraBagGift.initialStock || 14);
    let delay = 3000;

    function decreaseStock() {
      if (stock <= 3) return;

      stock -= 1;
      stockEl.textContent = String(stock);

      delay += 1000;
      setTimeout(decreaseStock, delay);
    }

    setTimeout(decreaseStock, delay);
  }

  startSolarExtraBagStockTimer();

  /* ── ORDER NOTIFICATION RIÊNG CHO ĐÈN ── */
  function initSolarOrderNotificationTop() {
    if (document.getElementById("solarOrderNotifTop")) return;

    const orderNotifTop = document.createElement("div");
    orderNotifTop.id = "solarOrderNotifTop";
    orderNotifTop.className = "order-notif-top solar-order-notif";
    orderNotifTop.innerHTML = `
      <div class="order-notif-icon">✓</div>
      <div class="order-notif-content">
        <div id="solarOrderNotifTopText"></div>
        <div class="order-notif-sub">${P.orderNotification?.subText || "Vừa đặt hàng trên Nino Việt Nam"}</div>
      </div>
    `;

    document.body.appendChild(orderNotifTop);

    const textEl = document.getElementById("solarOrderNotifTopText");
    if (!textEl) return;

    let lastShownAt = 0;
    let minGapMs = 5000;

    function randomGap() {
      return 5000 + Math.floor(Math.random() * 5000);
      // khoảng 5–10 giây/lần
    }

    function showThenHide(entry) {
      const now = Date.now();

      if (now - lastShownAt < minGapMs) return;

      lastShownAt = now;
      minGapMs = randomGap();

      const customerName = entry && entry.name ? entry.name : "Khách hàng";
      textEl.textContent = customerName + " đã mua hàng";

      orderNotifTop.classList.add("show");

      setTimeout(function () {
        orderNotifTop.classList.remove("show");
      }, 3500);
    }

    function subscribeWhenReady() {
      if (window.__liveNotif && typeof window.__liveNotif.subscribe === "function") {
        window.__liveNotif.subscribe(showThenHide);
        return;
      }

      let waited = 0;
      const timer = setInterval(function () {
        waited += 100;

        if (window.__liveNotif && typeof window.__liveNotif.subscribe === "function") {
          clearInterval(timer);
          window.__liveNotif.subscribe(showThenHide);
        }

        if (waited >= 8000) {
          clearInterval(timer);
        }
      }, 100);
    }

    subscribeWhenReady();
  }

  setTimeout(initSolarOrderNotificationTop, 3000);

  /* ═══════════════════════════════════════════════
     POPUP CẢM ƠN CHI TIẾT
     ═══════════════════════════════════════════════ */

  function injectThankStyle() {
    if (document.getElementById("solar-thank-style")) return;

    const style = document.createElement("style");
    style.id = "solar-thank-style";
    style.textContent = `
      .solar-thank-overlay {
        position: fixed; inset: 0; z-index: 100001;
        background: rgba(0,0,0,.58);
        display: flex; align-items: center; justify-content: center;
        padding: 14px; font-family: Arial, sans-serif;
      }
      .solar-thank-modal {
        width: 100%; max-width: 465px; max-height: 92vh;
        overflow-y: auto; background: #fff;
        border-radius: 20px; padding: 22px;
        box-shadow: 0 18px 45px rgba(0,0,0,.22);
      }
      .solar-thank-icon { text-align: center; font-size: 42px; margin-bottom: 8px; }
      .solar-thank-title {
        text-align: center; font-size: 22px; font-weight: 900;
        color: #111; margin-bottom: 8px;
      }
      .solar-thank-sub {
        text-align: center; font-size: 14px; line-height: 1.45;
        color: #555; margin-bottom: 14px;
      }
      .solar-thank-box {
        background: #f9fafb; border: 1px solid #eee;
        border-radius: 14px; padding: 13px; margin-bottom: 12px;
      }
      .solar-thank-section-title {
        font-size: 14px; font-weight: 900;
        color: #111; margin-bottom: 10px;
      }
      .solar-thank-customer-row {
        display: flex; justify-content: space-between; gap: 10px;
        font-size: 13.5px; margin-bottom: 7px;
      }
      .solar-thank-customer-row span { color: #666; }
      .solar-thank-customer-row strong { color: #111; text-align: right; }
      .solar-thank-address {
        margin-top: 8px; padding-top: 8px;
        border-top: 1px dashed #ddd;
        font-size: 13.5px; line-height: 1.45; color: #374151;
      }
      .solar-thank-item {
        display: flex; justify-content: space-between; gap: 10px;
        padding: 10px 0; border-bottom: 1px solid #eee;
      }
      .solar-thank-item:last-child { border-bottom: none; }
      .solar-thank-item-main { flex: 1; min-width: 0; }
      .solar-thank-item-name {
        font-size: 13.5px; font-weight: 800;
        color: #111; line-height: 1.35;
      }
      .solar-thank-item-meta { margin-top: 3px; font-size: 12px; color: #6b7280; }
      .solar-thank-item-side {
        flex-shrink: 0; text-align: right;
        font-size: 12.5px; color: #666;
      }
      .solar-thank-item-side strong {
        display: block; margin-top: 3px;
        color: #ef4444; font-size: 13.5px;
      }
      .solar-thank-total-box {
        background: #fff7ed; border: 1px solid #fed7aa;
        border-radius: 14px; padding: 13px; margin-bottom: 14px;
      }
      .solar-thank-total-box > div {
        display: flex; justify-content: space-between; gap: 10px;
        font-size: 14px; margin-bottom: 8px;
      }
      .solar-thank-total-box > div:last-child { margin-bottom: 0; }
      .solar-thank-total-box span { color: #666; }
      .solar-thank-total-box strong { color: #111; }
      .solar-thank-total-box .final {
        border-top: 1px dashed #f59e0b;
        padding-top: 9px; margin-top: 9px;
        font-size: 16px; font-weight: 900;
      }
      .solar-thank-total-box .final strong {
        color: #ef4444; font-size: 18px;
      }
      .solar-thank-ship-note {
        margin: -2px 0 14px; text-align: center;
        font-size: 12.5px; line-height: 1.45; color: #6b7280;
      }
      .solar-thank-close {
        width: 100%; border: none; border-radius: 14px;
        background: #16a34a; color: #fff;
        font-size: 17px; font-weight: 900;
        padding: 15px 14px; cursor: pointer;
      }
    `;
    document.head.appendChild(style);
  }

  /* ── Chụp thông tin form trước khi core.js reset ── */
  function captureCustomerSnapshot() {
    const fullName = (document.getElementById("fullName")?.value || "").trim();
    const phone = (document.getElementById("phone")?.value || "").trim();
    const address = (document.getElementById("address")?.value || "").trim();

    if (fullName || phone || address) {
      lastCustomerSnapshot = { fullName, phone, address };
    }
  }

  function bindFormCapture() {
    const form = document.getElementById("orderForm");
    const submitBtn = document.getElementById("submitBtn");

    if (form) {
      form.addEventListener("submit", captureCustomerSnapshot, true);
    }
    if (submitBtn) {
      submitBtn.addEventListener("click", captureCustomerSnapshot, true);
    }

    /* Theo dõi mọi thay đổi input để luôn có bản mới nhất */
    ["fullName", "phone", "address"].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("input", captureCustomerSnapshot);
        el.addEventListener("blur", captureCustomerSnapshot);
      }
    });
  }

  function showSolarThankModal() {
    injectThankStyle();

    const snap = lastCustomerSnapshot || {};
    const fullName = snap.fullName || "—";
    const phone = snap.phone || "—";
    const address = snap.address || "—";

    const combo = window.__selectedSolarCombo || {};
    const comboName = combo.name || (P.name || "Sản phẩm");
    const qty = Number(combo.quantity || 1);
    const subtotal = Number(combo.price || 0);
    const shipFee = Number(combo.shipFee || 0);
    const finalTotal = subtotal + shipFee;

    const shipRowHtml = shipFee > 0
      ? `<div><span>Phí vận chuyển</span><strong>${formatPrice(shipFee)}</strong></div>`
      : `<div><span>Phí vận chuyển</span><strong style="color:#16a34a;">Miễn phí</strong></div>`;

    const old = document.getElementById("solarThankOverlay");
    if (old) old.remove();

    const overlay = document.createElement("div");
    overlay.id = "solarThankOverlay";
    overlay.className = "solar-thank-overlay";

    overlay.innerHTML = `
      <div class="solar-thank-modal">
        <div class="solar-thank-icon">✅</div>
        <div class="solar-thank-title">Cảm ơn bạn đã đặt hàng</div>
        <div class="solar-thank-sub">
          Shop đã ghi nhận đơn hàng. Vui lòng giữ điện thoại, shop sẽ liên hệ xác nhận.
        </div>

        <div class="solar-thank-box">
          <div class="solar-thank-section-title">📋 Thông tin nhận hàng</div>
          <div class="solar-thank-customer-row">
            <span>Người nhận</span><strong>${fullName}</strong>
          </div>
          <div class="solar-thank-customer-row">
            <span>Số điện thoại</span><strong>${phone}</strong>
          </div>
          <div class="solar-thank-address">${address}</div>
        </div>

        <div class="solar-thank-box">
          <div class="solar-thank-section-title">🛒 Sản phẩm đã đặt</div>
          <div class="solar-thank-item">
            <div class="solar-thank-item-main">
              <div class="solar-thank-item-name">${comboName}</div>
              <div class="solar-thank-item-meta">${combo.note || ""}</div>
            </div>
            <div class="solar-thank-item-side">
              <div>SL: ${qty}</div>
              <strong>${formatPrice(subtotal)}</strong>
            </div>
          </div>
        </div>

        <div class="solar-thank-total-box">
          <div>
            <span>Tổng tiền hàng</span>
            <strong>${formatPrice(subtotal)}</strong>
          </div>
          ${shipRowHtml}
          <div class="final">
            <span>Tổng thanh toán khi nhận hàng</span>
            <strong>${formatPrice(finalTotal)}</strong>
          </div>
        </div>

        <div class="solar-thank-ship-note">
          Sau vài hôm bạn vui lòng chú ý điện thoại, Bạn ship sẽ liên hệ. Cảm ơn.
        </div>

        <button class="solar-thank-close" type="button" id="solarThankClose">OK</button>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("solarThankClose").addEventListener("click", () => {
      overlay.remove();
    });
  }

  /* ── Rình popup #thankModal mặc định xuất hiện ── */
  function watchDefaultThankModal() {
    const thankModal = document.getElementById("thankModal");
    if (!thankModal) return;

    const observer = new MutationObserver(() => {
      const style = window.getComputedStyle(thankModal);
      const isVisible = thankModal.classList.contains("show")
        || thankModal.classList.contains("active")
        || style.display === "flex"
        || style.display === "block";

      if (isVisible) {
        thankModal.style.display = "none";
        thankModal.classList.remove("show", "active");
        showSolarThankModal();
      }
    });

    observer.observe(thankModal, {
      attributes: true,
      attributeFilter: ["class", "style"]
    });
  }

  setTimeout(() => {
    bindFormCapture();
    watchDefaultThankModal();
  }, 300);
})();