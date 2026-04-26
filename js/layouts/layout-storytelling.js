/* ===================================================
   layout-storytelling.js
   Render layout storytelling (P1→P7) vào #layoutRoot
   Phụ thuộc: PRODUCT_CONFIG, SHARED_CONFIG
   Chạy TRƯỚC core.js
=================================================== */

(function renderStorytelling() {
  const P = PRODUCT_CONFIG;
  const S = SHARED_CONFIG.shop;
  const C = SHARED_CONFIG;
  const root = document.getElementById("layoutRoot");

  /* ── Kiểm tra SP có biến thể màu không ── */
  const hasColorVariant = P.variants.some(v => v.type === "color");

  /* ── Discount number (lấy số từ "-50%" → "50") ── */
  const discountNum = P.discount
    ? P.discount.replace(/[^0-9]/g, "")
    : Math.round((1 - P.price / P.oldPrice) * 100);

  /* ── Build variant popup HTML nếu có biến thể màu ── */
  let variantPopupHTML = "";
  if (hasColorVariant) {
    const colorVariant = P.variants.find(v => v.type === "color");
    const otherVariants = P.variants.filter(v => v.type !== "color");

    variantPopupHTML = `
    <div class="variant-popup-overlay" id="variantPopupOverlay">
      <div class="variant-popup" id="variantPopup">
        <div class="variant-popup-top">
          <div class="variant-popup-title">Chọn phân loại</div>
          <button class="variant-popup-close" id="variantPopupClose">&times;</button>
        </div>

        <!-- GIÁ BÁN + GIÁ GỐC + % GIẢM + FREE SHIP -->
        <div style="padding:0 16px 12px; border-bottom:1px solid #f0f0f0; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span style="font-size:20px; font-weight:800; color:#e53e3e;">${Number(P.price).toLocaleString("vi-VN")}đ</span>
            <span style="font-size:14px; color:#aaa; text-decoration:line-through;">${Number(P.oldPrice).toLocaleString("vi-VN")}đ</span>
            <span style="font-size:12px; font-weight:700; color:#fff; background:#e53e3e; padding:2px 7px; border-radius:4px;">-${discountNum}%</span>
          </div>
          <div style="margin-top:6px; display:inline-flex; align-items:center; gap:4px; font-size:12px; color:#38a169; font-weight:600; background:#f0fff4; padding:3px 8px; border-radius:4px;">
            🚚 Miễn phí vận chuyển
          </div>
          <div style="display:flex; align-items:center; gap:12px; margin-top:10px;">
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#2b6cb0;">
              <span style="font-size:14px;">🔍</span> Xem hàng trước khi trả tiền
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#2b6cb0;">
              <span style="font-size:14px;">🛡️</span> BH 12 tháng 1 đổi 1
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#2b6cb0;">
              <span style="font-size:14px;">↩️</span> Hoàn tiền nếu sai mô tả
            </div>
          </div>
        </div>

        <!-- SLIDER ẢNH TRONG POPUP -->
        <div class="variant-popup-gallery">
          <div class="variant-popup-slider" id="vpSlider">
            <div class="variant-popup-slides" id="vpSlides">
              ${colorVariant.options.map(opt => `
                <div class="variant-popup-slide">
                  <img src="${opt.image}" alt="${opt.name}" loading="lazy" decoding="async" />
                </div>
              `).join("")}
            </div>
          </div>
          <div class="variant-popup-dots" id="vpDots">
            ${colorVariant.options.map((opt, idx) => `
              <div class="variant-popup-dot ${idx === 0 ? "active" : ""}" data-index="${idx}"></div>
            `).join("")}
          </div>
          <div class="variant-popup-thumbs" id="vpThumbs">
            ${colorVariant.options.map((opt, idx) => `
              <div class="variant-popup-thumb ${idx === 0 ? "active" : ""}" data-index="${idx}">
                <img src="${opt.image}" alt="${opt.name}" loading="lazy" decoding="async" />
              </div>
            `).join("")}
          </div>
        </div>

        <!-- BIẾN THỂ MÀU -->
        <div class="variant-popup-section">
          <div class="variant-popup-label">${colorVariant.label}</div>
          <div class="variant-popup-options">
            ${colorVariant.options.map((opt, idx) => `
              <button class="variant-popup-option vp-color-option ${idx === 0 ? "active" : ""}" data-type="color" data-value="${opt.name}" data-index="${idx}">${opt.name}</button>
            `).join("")}
          </div>
        </div>

        <!-- BIẾN THỂ KHÁC (size, v.v.) -->
        ${otherVariants.map(v => `
          <div class="variant-popup-section">
            <div class="variant-popup-label">${v.label}</div>
            <div class="variant-popup-options">
              ${v.options.map((opt, idx) => `
                <button class="variant-popup-option vp-other-option ${idx === 0 ? "active" : ""}" data-type="${v.type}" data-value="${opt}">${opt}</button>
              `).join("")}
            </div>
          </div>
        `).join("")}

        <!-- 2 NÚT CTA TRONG POPUP -->
        <div class="variant-popup-cta">
          <button class="btn-ghost" id="vpAddToCartBtn">Thêm vào giỏ</button>
          <button class="btn-solid" id="vpBuyNowBtn">Mua ngay</button>
        </div>
      </div>
    </div>
    `;
  }

  root.innerHTML = `

    <!-- ============ P1 — HERO: Gallery + Tên SP ============ -->
    <section class="gallery-wrap">
      <div class="slider" id="slider">
        <div class="slides" id="slides"></div>
        <div class="dots" id="dots"></div>
      </div>
    </section>

    <section class="section hero-section">
      <h1 class="product-title">${P.shortName}</h1>
      <div class="product-sub">${P.subHeading}</div>
    </section>

    <!-- ============ P2 — HOOK ============ -->
    <section class="section hook-section">
      <div class="hook-title">${P.hookTitle || (P.hooks.length + " lý do bạn nên chọn sản phẩm này")}</div>
      <div class="hook-list">
        ${P.hooks.map(h => `
          <div class="hook-item">
            <span class="hook-icon">${h.icon}</span>
            <span class="hook-text">${h.text}</span>
          </div>
        `).join("")}
      </div>
    </section>

    <!-- ============ MID CTA — Nhận ưu đãi ============ -->
    <section style="padding:0 16px; margin-bottom:0;">
      <div id="midCtaBanner" style="display:flex; align-items:center; justify-content:space-between; gap:12px; background:linear-gradient(135deg,#fff7ed,#ffedd5); border:1px solid #fed7aa; border-radius:12px; padding:14px 16px;">
        <div style="font-size:14px; font-weight:600; color:#c2410c; line-height:1.45;">🔥 Nhận giảm giá ${discountNum}% và miễn phí vận chuyển ngay</div>
        <button id="midCtaBtn" style="flex-shrink:0; background:#e53e3e; color:#fff; border:none; border-radius:8px; padding:10px 18px; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap;">Nhận ưu đãi</button>
      </div>
    </section>

    <!-- ============ P3 — BENEFITS (chứng minh công dụng) ============ -->
    <section class="section benefits-section">
      ${P.benefits.map((b, i) => `
        <div class="benefit-block ${i % 2 === 0 ? "img-left" : "img-right"}">
          <div class="benefit-img">
            <img src="${b.image}" alt="${b.title}" loading="lazy" decoding="async" width="600" height="338" />
          </div>
          <div class="benefit-content">
            <div class="benefit-title">${b.title}</div>
            <div class="benefit-desc">${b.description}</div>
          </div>
        </div>
      `).join("")}
    </section>

    <!-- ============ P4 — GIÁ + BIẾN THỂ + COMBO + QTY + CTA ============ -->
    <section class="section pricing-section">

      <!-- TÊN SP -->
      <div class="pricing-product-name">${P.shortName}</div>

      <!-- SALE BAR (tĩnh, trước giá) -->
      <div class="sale-bar">🔥 Giảm ${discountNum}% và miễn phí vận chuyển khi đặt hàng trong hôm nay</div>

      <div class="price-row">
        <span class="price-label">Giá chỉ:</span>
        <span class="price">${Number(P.price).toLocaleString("vi-VN")}đ</span>
        <span class="old-price">${Number(P.oldPrice).toLocaleString("vi-VN")}đ</span>
        <span class="badge-discount">-${discountNum}%</span>
      </div>

      <!-- VARIANTS (chỉ render ngoài trang nếu KHÔNG có biến thể màu) -->
      ${(P.variants.length && !hasColorVariant) ? `
        <div class="variants-wrap">
          ${P.variants.map(v => `
            <div class="variant-group" data-type="${v.type}">
              <div class="variant-label">${v.label}</div>
              <div class="variant-options">
                ${v.options.map((opt, idx) => `
                  <button class="variant-option ${idx === 0 ? "active" : ""}" data-type="${v.type}" data-value="${opt}">${opt}</button>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      ` : ""}

      <!-- COMBOS -->
      ${P.combos.length ? `
        <div class="combos-wrap">
          <div class="combos-label">Chọn combo</div>
          <div class="combos-list">
            ${P.combos.map((c, idx) => `
              <button class="combo-option ${idx === 0 ? "active" : ""}" data-index="${idx}" data-price="${c.price}">
                <span class="combo-name">${c.name}</span>
                <span class="combo-price">${Number(c.price).toLocaleString("vi-VN")}đ</span>
              </button>
            `).join("")}
          </div>
        </div>
      ` : ""}

      <!-- FREE SHIP -->
      <div class="ship-bar" style="color:#16a34a; background:linear-gradient(135deg,#f0fff4,#dcfce7); border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; font-weight:600; font-size:14px; position:relative; overflow:hidden;">
        <span class="ship-bar-shimmer"></span>
        <span style="position:relative; z-index:1;">🎁 ${P.shipBar || 'Miễn phí vận chuyển &amp; hoàn trả toàn quốc khi mua trong hôm nay'}</span>
      </div>
      <style>
      .ship-bar-shimmer {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
        animation: shipBarShimmer 2s ease-in-out infinite;
        pointer-events: none;
        z-index: 0;
      }
      @keyframes shipBarShimmer {
        0%   { left: -100%; }
        100% { left: 100%; }
      }
      </style>



      <!-- RETURN POLICY -->
      <div class="return-policy-bar">
        <span class="return-policy-icon">🛡️</span>
        <span class="return-policy-text">${P.returnPolicy.content}</span>
      </div>

      <!-- QTY + CTA -->
      <div class="section-label">Số lượng</div>
      <div class="qty-wrap">
        <button class="qty-btn" id="minusQty">−</button>
        <input class="qty-input" type="number" id="quantity" value="1" min="1" />
        <button class="qty-btn" id="plusQty">+</button>
      </div>
      <div class="cta-row">
        ${hasColorVariant
          ? `<button class="btn-ghost" id="inlineAddToCartBtn">Chọn màu</button>`
          : `<button class="btn-ghost" id="inlineAddToCartBtn">Thêm vào giỏ</button>`
        }
        <button class="btn-solid" id="inlineBuyNowBtn">Mua ngay</button>
      </div>
    </section>

    <!-- ============ VARIANT POPUP (chỉ render nếu có biến thể màu) ============ -->
    ${variantPopupHTML}

    <!-- ============ P5 — REVIEWS ============ -->
    <section class="section review-section">
      <div class="section-heading">Đánh giá từ khách hàng</div>
      <div id="reviewSummary"></div>
      <div id="reviewList"></div>
    </section>

    <!-- ============ P6 — SHOP INFO ============ -->
    <section class="section shop-section">
      <div class="shop-row">
        <img class="shop-avatar" src="${S.avatar}" alt="${S.name}" loading="lazy" decoding="async" />
        <div>
          <div class="shop-name">${S.name}</div>
          <div class="shop-status">● ${S.onlineStatus}</div>
        </div>
      </div>
      <div class="shop-stats">
        ${S.stats.map(s => `
          <div class="shop-stat">
            <span class="shop-stat-label">${s.label}</span>
            <span class="shop-stat-value">${s.value}</span>
          </div>
        `).join("")}
      </div>

      <div class="info-block">
        <div class="info-block-title">Liên hệ</div>
        ${C.contact.map(c => `
          <div class="info-row">
            <span class="info-row-icon">${c.icon}</span>
            <span class="info-row-text"><strong>${c.label}:</strong> ${c.value}</span>
          </div>
        `).join("")}
      </div>

      <div class="info-block">
        <div class="info-block-title">Hệ thống cửa hàng</div>
        ${C.stores.map(s => `
          <div class="info-row">
            <span class="info-row-icon">📍</span>
            <span class="info-row-text">${s}</span>
          </div>
        `).join("")}
      </div>

      <div style="margin-bottom:16px;">
        <img src="${C.storeMapImage}" loading="lazy" decoding="async" width="600" height="300" style="width:100%; border-radius:10px;" alt="Bản đồ cửa hàng" />
      </div>

      <div class="info-block">
        <div class="info-block-title">Chính sách</div>
        ${P.policies.map(p => `
          <div class="info-row">
            <span class="info-row-icon">${p.icon}</span>
            <span class="info-row-text">${p.text}</span>
          </div>
        `).join("")}
      </div>
    </section>

    <!-- ============ P7 — FAQ ============ -->
    <section class="section faq-section">
      <div class="section-heading">Câu hỏi thường gặp</div>
      <div class="faq-list">
        ${P.faqs.map((f, i) => `
          <div class="faq-item-wrap">
            <div class="faq-head" data-faq="${i}">
              <span class="faq-q">${f.q}</span>
              <span class="faq-arrow">⌄</span>
            </div>
            <div class="faq-body" id="faqBody${i}">
              <div class="faq-a">${f.a}</div>
            </div>
          </div>
        `).join("")}
      </div>
    </section>
  `;

  /* ── ORDER NOTIFICATION (fixed top, ngoài layoutRoot) ── */
  const orderNotifTop = document.createElement("div");
  orderNotifTop.className = "order-notif-top";
  orderNotifTop.innerHTML = `<div class="order-notif-top-inner"><span class="order-notif-top-icon">🔔</span><span class="order-notif-top-text" id="orderNotifTopText"></span></div>`;
  document.body.appendChild(orderNotifTop);

  (function loopOrderNotification() {
    const names = [
      "Nguyễn Văn Hùng", "Trần Thị Mai", "Lê Minh Tuấn", "Phạm Thị Hoa",
      "Hoàng Văn Đức", "Ngô Thị Lan", "Vũ Đình Khoa", "Đặng Thị Ngọc",
      "Bùi Quang Hải", "Đỗ Thị Thanh", "Phan Văn Long", "Lý Thị Hương",
      "Trịnh Minh Phát", "Hồ Thị Yến", "Dương Văn Tâm", "Mai Thị Linh",
      "Nguyễn Thị Bích", "Lê Văn Sơn", "Trần Quốc Bảo", "Phạm Minh Châu",
      "Võ Thị Diệu", "Huỳnh Văn Thắng", "Đinh Thị Thu", "Lương Văn Hòa",
      "Tạ Thị Kim", "Châu Minh Trí", "Nguyễn Hữu Phước", "Trần Thị Ánh",
      "Lê Thị Tuyết", "Phạm Văn Nghĩa"
    ];

    const textEl = document.getElementById("orderNotifTopText");
    let lastIndex = -1;

    function randomBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pickRandomName() {
      let idx;
      do { idx = Math.floor(Math.random() * names.length); } while (idx === lastIndex);
      lastIndex = idx;
      return names[idx];
    }

    function showThenHide() {
      textEl.textContent = pickRandomName() + " vừa đặt hàng";
      orderNotifTop.classList.add("show");

      const showDuration = randomBetween(4000, 8000);
      setTimeout(() => {
        orderNotifTop.classList.remove("show");

        const hideDuration = randomBetween(5000, 15000);
        setTimeout(showThenHide, hideDuration);
      }, showDuration);
    }

    const initialDelay = randomBetween(2000, 5000);
    setTimeout(showThenHide, initialDelay);
  })();

  /* ── REVIEW SUMMARY ── */
  const R = P.reviews;
  document.getElementById("reviewSummary").innerHTML = `
    <div class="review-summary">
      <div class="review-score">
        <div class="review-score-num">${R.avgScore}</div>
        <div class="review-score-stars">★★★★★</div>
        <div class="review-score-count">${R.totalCount} đánh giá</div>
      </div>
      <div class="review-bars">
        ${R.bars.map(b => `
          <div class="review-bar-row">
            <span>${b.star}★</span>
            <div class="review-bar-track"><div class="review-bar-fill" style="width:${b.percent}%"></div></div>
            <span>${b.count}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll(".faq-head").forEach(head => {
    head.addEventListener("click", () => {
      const idx = head.dataset.faq;
      const body = document.getElementById("faqBody" + idx);
      const isOpen = head.classList.contains("active");

      document.querySelectorAll(".faq-head").forEach(h => h.classList.remove("active"));
      document.querySelectorAll(".faq-body").forEach(b => b.classList.remove("show"));

      if (!isOpen) {
        head.classList.add("active");
        body.classList.add("show");
      }
    });
  });

  /* ── VARIANT SELECTOR (cho SP không có biến thể màu) ── */
  document.querySelectorAll(".variant-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      document.querySelectorAll(`.variant-option[data-type="${type}"]`).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ── COMBO SELECTOR ── */
  document.querySelectorAll(".combo-option").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".combo-option").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ── VARIANT POPUP — EVENT LISTENERS (chỉ khi có biến thể màu) ── */
  if (hasColorVariant) {
    const vpOverlay  = document.getElementById("variantPopupOverlay");
    const vpCloseBtn = document.getElementById("variantPopupClose");
    const vpSlides   = document.getElementById("vpSlides");
    const vpDots     = document.querySelectorAll(".variant-popup-dot");
    const vpThumbs   = document.querySelectorAll(".variant-popup-thumb");
    const vpColorBtns = document.querySelectorAll(".vp-color-option");
    let vpCurrentSlide = 0;
    const vpTotalSlides = P.variants.find(v => v.type === "color").options.length;

    /* Cập nhật slider trong popup */
    function vpGoToSlide(idx) {
      vpCurrentSlide = idx;
      vpSlides.style.transform = `translateX(-${idx * 100}%)`;
      vpDots.forEach((dot, i) => dot.classList.toggle("active", i === idx));
      vpThumbs.forEach((thumb, i) => thumb.classList.toggle("active", i === idx));
      vpColorBtns.forEach((btn, i) => btn.classList.toggle("active", i === idx));
      const activeThumb = document.querySelectorAll(".variant-popup-thumb")[idx];
      if (activeThumb) activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    /* Click dot → đổi slide */
    vpDots.forEach(dot => {
      dot.addEventListener("click", () => {
        vpGoToSlide(parseInt(dot.dataset.index));
      });
    });

    /* Click thumbnail → đổi slide */
    vpThumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        vpGoToSlide(parseInt(thumb.dataset.index));
      });
    });

    /* Click nút màu → đổi slide */
    vpColorBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        vpGoToSlide(parseInt(btn.dataset.index));
      });
    });

    /* Click nút biến thể khác (size, v.v.) */
    document.querySelectorAll(".vp-other-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        document.querySelectorAll(`.vp-other-option[data-type="${type}"]`).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    /* Swipe trong popup */
    let vpStartX = 0, vpMoveX = 0, vpIsDragging = false, vpIsHorizontal = null;
    const vpSlider = document.getElementById("vpSlider");

    vpSlider.addEventListener("touchstart", e => {
      vpStartX = vpMoveX = e.touches[0].clientX;
      vpIsDragging = true;
      vpIsHorizontal = null;
    }, { passive: true });

    vpSlider.addEventListener("touchmove", e => {
      if (!vpIsDragging) return;
      vpMoveX = e.touches[0].clientX;
      const diffX = Math.abs(vpMoveX - vpStartX);
      const diffY = Math.abs(e.touches[0].clientY - vpStartX);
      if (vpIsHorizontal === null && (diffX > 5 || diffY > 5)) {
        vpIsHorizontal = diffX >= diffY;
      }
      if (vpIsHorizontal === true) e.preventDefault();
    }, { passive: false });

    vpSlider.addEventListener("touchend", () => {
      if (!vpIsDragging) return;
      if (vpIsHorizontal === true) {
        const diff = vpStartX - vpMoveX;
        if (diff > 50 && vpCurrentSlide < vpTotalSlides - 1) vpGoToSlide(vpCurrentSlide + 1);
        else if (diff < -50 && vpCurrentSlide > 0) vpGoToSlide(vpCurrentSlide - 1);
      }
      vpIsDragging = false;
      vpIsHorizontal = null;
    });

    /* Mở popup */
    function openVariantPopup() {
      vpOverlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    /* Đóng popup */
    function closeVariantPopup() {
      vpOverlay.classList.remove("show");
      document.body.style.overflow = "auto";
    }

    vpCloseBtn.addEventListener("click", closeVariantPopup);
    vpOverlay.addEventListener("click", e => {
      if (e.target === vpOverlay) closeVariantPopup();
    });

    /* Gắn hàm mở popup vào window để core.js truy cập */
    window.__variantPopup = {
      open: openVariantPopup,
      close: closeVariantPopup,
      getSelectedVariants: function () {
        const result = {};
        /* Lấy màu đang chọn */
        const activeColor = document.querySelector(".vp-color-option.active");
        if (activeColor) result["color"] = activeColor.dataset.value;
        /* Lấy các biến thể khác */
        document.querySelectorAll(".variant-popup-section").forEach(section => {
          const activeOther = section.querySelector(".vp-other-option.active");
          if (activeOther) result[activeOther.dataset.type] = activeOther.dataset.value;
        });
        return result;
      },
      hasColorVariant: true
    };
  } else {
    window.__variantPopup = {
      hasColorVariant: false
    };
  }

})();
