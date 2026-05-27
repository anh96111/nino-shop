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

  /* ── Thứ tự hiển thị combo (đảo): index gốc 2,1,0 ── */
  const displayOrder = combos.map((_, i) => i).reverse();

  const rawTags = Array.isArray(P.sliderTags) && P.sliderTags.length
    ? P.sliderTags
    : [
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

  let selectedComboIndex = null;

  /* ── Snapshot thông tin nhận hàng trước khi submit ── */
  let lastCustomerSnapshot = null;

  /* ── Slides HTML ── */
  const slidesHtml = images.length
    ? images.map((src, index) => `
        <div class="slide">
          <img src="${src}" alt="${P.shortName || P.name || "Sản phẩm"} ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}">
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
        <img src="${src}" alt="thumb ${index + 1}" loading="lazy">
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

    const saveAmount = Number(c.oldPrice || 0) - Number(c.price || 0);
    const saveHtml = (c.tag && saveAmount > 0)
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
         ${mediaArr.map(m => {
           const src = typeof m === "string" ? m : (m && m.src ? m.src : "");
           const poster = typeof m === "object" && m.poster ? m.poster : src;
           const isVideo = typeof m === "object" && m.type === "video";

           return isVideo
             ? `<button type="button" class="solar-review-media-item is-video" data-review-video="${src}">
                  <img src="${poster}" alt="review video" loading="lazy">
                  <span class="material-symbols-outlined">play_circle</span>
                </button>`
             : `<img class="solar-review-media-item" src="${src}" alt="review media" loading="lazy">`;
         }).join("")}
       </div>`
     : "";

    const classifyHtml = rv.classify ? `<div class="solar-review-classify">Phân loại: ${rv.classify}</div>` : "";

    return `
      <div class="solar-review-item">
        <div class="solar-review-head">
          <img class="solar-review-avatar" src="${rv.avatar || ""}" alt="${rv.name || ""}" loading="lazy">
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

    const moreBtnHtml = reviewItems.length > REVIEW_INITIAL && !reviewExpanded
      ? `<button type="button" class="solar-review-more" id="solarReviewMoreBtn">
           Xem thêm ${reviewItems.length - REVIEW_INITIAL} đánh giá
           <span class="material-symbols-outlined">expand_more</span>
         </button>`
      : "";

    return `<div class="solar-review-list" id="solarReviewList">${listHtml}</div>${moreBtnHtml}`;
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
        ${S.avatar ? `<img class="solar-shop-avatar" src="${S.avatar}" alt="${S.name || ""}" loading="lazy">` : ""}
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
        <img class="solar-store-map" src="${C.storeMapImage}" alt="Bản đồ cửa hàng" loading="lazy">
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
      <header class="solar-hero">
        <div class="solar-hero-inner">
          <div class="solar-brand">
            <span class="solar-brand-nino">Nino</span>
            <span class="solar-brand-vn">Viet Nam</span>
          </div>
          <p class="solar-hero-desc">Giải pháp chiếu sáng thông minh &amp; bền bỉ</p>
        </div>
        <div class="solar-hero-blur"></div>
      </header>

      <section class="solar-product-wrap">
        <div class="solar-gallery">
          <div class="solar-slider">
            <div class="solar-slides" id="solarSlides">
              ${slidesHtml}
            </div>

            <div class="solar-feature-tags solar-feature-tags--sticky">
              ${featureTagsHtml}
            </div>
          </div>

          <div class="solar-dots">
            ${dotsHtml}
          </div>

          <div class="solar-thumbs" id="solarThumbs">
            ${thumbsHtml}
          </div>
          </div>
         </div>

        <div class="solar-info">
          <div class="solar-shop-row">
            <span class="solar-fav-badge">Yêu thích</span>
            <span class="solar-shop-cat">${P.category || "Đèn năng lượng mặt trời"}</span>
          </div>

          <h1>${P.name || P.shortName || "Đèn Năng Lượng Mặt Trời 40W"}</h1>

          <div class="solar-rating-row">
            <div class="solar-rating-stars">
              <span class="material-symbols-outlined filled">star</span>
              <span class="material-symbols-outlined filled">star</span>
              <span class="material-symbols-outlined filled">star</span>
              <span class="material-symbols-outlined filled">star</span>
              <span class="material-symbols-outlined filled">star</span>
              <strong>5.0</strong>
            </div>
            <span class="solar-rating-sep">|</span>
            <span class="solar-sold">Đã bán <strong>${P.soldText || "112.5k"}</strong></span>
          </div>

          <div class="solar-price-box">
            <div class="solar-price-line">
              <span class="solar-price">${formatPrice(P.price)}</span>
              <span class="solar-old-price">${formatPrice(P.oldPrice)}</span>
              <span class="solar-discount">-${discountPercent}%</span>
            </div>
            <p class="solar-price-note">
              <span class="material-symbols-outlined">info</span>
              Giá lẻ 1 chiếc, chọn combo để tiết kiệm được 216.000đ.
            </p>
          </div>

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
      <button class="solar-bottom-buy" id="solarBuyNow">
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

  function openCheckout() {
    const combo = requireCombo();
    if (!combo) return;

    applyComboToProduct(combo);
    syncHiddenCombo();

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

  const slidesEl = document.getElementById("solarSlides");
  if (slidesEl) {
    slidesEl.addEventListener("scroll", () => {
      const width = slidesEl.clientWidth || 1;
      const activeIndex = Math.round(slidesEl.scrollLeft / width);

      document.querySelectorAll("[data-dot]").forEach(dot => {
        dot.classList.toggle("active", Number(dot.dataset.dot) === activeIndex);
      });
      document.querySelectorAll("[data-thumb]").forEach(t => {
        t.classList.toggle("active", Number(t.dataset.thumb) === activeIndex);
     });

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
      const wrap = document.getElementById("solarReviewWrap");
      if (wrap) {
        wrap.innerHTML = buildReviewsHtml();
        bindReviewMoreBtn();
        bindReviewVideoBtns();
      }
    });
  }
  bindReviewMoreBtn();

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

  const buyBtn = document.getElementById("solarBuyNow");
  if (buyBtn) buyBtn.addEventListener("click", openCheckout);

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
        <div class="order-notif-sub">Vừa đặt hàng trên Nino Việt Nam</div>
      </div>
    `;

    document.body.appendChild(orderNotifTop);

    const textEl = document.getElementById("solarOrderNotifTopText");
    if (!textEl) return;

    const comboTexts = [
      "1 đèn năng lượng mặt trời",
      "Combo 2 đèn năng lượng mặt trời",
      "Combo 3 đèn năng lượng mặt trời"
    ];

    function pickComboText() {
      return comboTexts[Math.floor(Math.random() * comboTexts.length)];
    }

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
      textEl.textContent = customerName + " vừa đặt " + pickComboText();

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
