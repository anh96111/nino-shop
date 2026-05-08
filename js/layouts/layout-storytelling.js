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

  /* ── Kiểm tra SP có combo + không có color variant → dùng combo popup ── */
  const hasComboPopup = P.combos.length > 0 && !hasColorVariant;

  /* ── showMidCta — mặc định true nếu không khai báo ── */
  const showMidCta = P.showMidCta !== false;

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

        <!-- GIFT NOTE -->
        <div style="display:flex; align-items:center; gap:6px; padding:0 16px 12px; font-size:13.5px; font-weight:600; color:#38a169;">
          <span style="font-size:16px;">🎁</span> Đã bao gồm full bộ quà tặng kèm cho bé
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

        <!-- NÚT THÊM VÀO GIỎ (ngay dưới size) -->
        <button class="vp-add-to-cart-btn" id="vpAddToCartBtn">🛒 Thêm vào giỏ</button>

        <!-- NÚT ĐẾN GIỎ HÀNG + MUA NGAY -->
        <div class="variant-popup-cta">
          <button class="btn-ghost" id="vpGoToCartBtn">🛒 Đến giỏ hàng<span class="cart-badge" id="vpCartBadge"></span></button>
          <button class="btn-solid" id="vpBuyNowBtn">Mua ngay</button>
        </div>
      </div>
    </div>
    `;
  }

  /* ── Build combo popup HTML nếu có combo + không có color variant ── */
  let comboPopupHTML = "";
  if (hasComboPopup) {
    const comboHasImages = P.combos.some(c => c.image);

    comboPopupHTML = `
    <div class="variant-popup-overlay" id="comboPopupOverlay">
      <div class="variant-popup" id="comboPopup">
        <div class="variant-popup-top">
          <div class="variant-popup-title">Chọn sản phẩm</div>
          <button class="variant-popup-close" id="comboPopupClose">&times;</button>
        </div>

        <!-- GIÁ + TRUST -->
        <div style="padding:0 16px 12px; border-bottom:1px solid #f0f0f0; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="cp-price-display" style="font-size:20px; font-weight:800; color:#e53e3e;">${Number(P.combos[0].price).toLocaleString("vi-VN")}đ</span>
            <span class="cp-oldprice-display" style="font-size:14px; color:#aaa; text-decoration:line-through;">${Number(P.combos[0].oldPrice || P.oldPrice).toLocaleString("vi-VN")}đ</span>
            <span class="cp-discount-display" style="font-size:12px; font-weight:700; color:#fff; background:#e53e3e; padding:2px 7px; border-radius:4px;">-${discountNum}%</span>
          </div>
          <div class="cp-ship-display" style="margin-top:6px; display:inline-flex; align-items:center; gap:4px; font-size:12px; font-weight:600; padding:3px 8px; border-radius:4px; ${P.combos[0].shipFee ? 'color:#c2410c; background:#fff7ed;' : 'color:#38a169; background:#f0fff4;'}">
            ${P.combos[0].shipFee ? '🚚 Phí ship: ' + Number(P.combos[0].shipFee).toLocaleString("vi-VN") + 'đ' : '🚚 Miễn phí vận chuyển'}
          </div>
          <div style="display:flex; align-items:center; gap:12px; margin-top:10px;">
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#2b6cb0;">
              <span style="font-size:14px;">🔍</span> Xem hàng trước khi trả tiền
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#2b6cb0;">
              <span style="font-size:14px;">↩️</span> Hoàn tiền nếu sai mô tả
            </div>
          </div>
        </div>

        <!-- SLIDER ẢNH COMBO (chỉ render nếu combo có image) -->
        ${comboHasImages ? `
        <div class="variant-popup-gallery">
          <div class="variant-popup-slider" id="cpSlider">
            <div class="variant-popup-slides" id="cpSlides">
              ${P.combos.map(c => `
                <div class="variant-popup-slide">
                  <img src="${c.image}" alt="${c.name}" loading="lazy" decoding="async" />
                </div>
              `).join("")}
            </div>
          </div>
          <div class="variant-popup-dots" id="cpDots">
            ${P.combos.map((c, idx) => `
              <div class="variant-popup-dot ${idx === 0 ? "active" : ""}" data-index="${idx}"></div>
            `).join("")}
          </div>
          <div class="variant-popup-thumbs" id="cpThumbs">
            ${P.combos.map((c, idx) => `
              <div class="variant-popup-thumb ${idx === 0 ? "active" : ""}" data-index="${idx}">
                <img src="${c.image}" alt="${c.name}" loading="lazy" decoding="async" />
              </div>
            `).join("")}
          </div>
        </div>
        ` : ""}

        <!-- COMBO OPTIONS -->
        <div style="padding:0 16px 12px;">
          <div style="font-size:14px; font-weight:600; margin-bottom:8px;">Chọn combo</div>
          <div class="combos-list">
            ${P.combos.map((c, idx) => {
              const comboDiscount = c.oldPrice ? Math.round((1 - c.price / c.oldPrice) * 100) : 0;
              return `
              <button class="combo-option ${idx === 0 ? "active" : ""}" data-index="${idx}" data-price="${c.price}" data-shipfee="${c.shipFee || 0}" data-oldprice="${c.oldPrice || P.oldPrice}">
                <span class="combo-name" style="display:none;">${c.name}</span>
                <span class="combo-price" style="display:none;">${c.price}</span>
                <div class="cp-opt-top">
                  <span class="cp-opt-name">${c.name}</span>
                  ${!c.shipFee ? '<span class="cp-opt-badge-free">Free ship</span>' : ''}
                </div>
                <div class="cp-opt-bottom">
                  <span class="cp-opt-price">${Number(c.price).toLocaleString("vi-VN")}đ</span>
                  ${c.oldPrice ? '<span class="cp-opt-oldprice">' + Number(c.oldPrice).toLocaleString("vi-VN") + 'đ</span>' : ''}
                  ${comboDiscount ? '<span class="cp-opt-discount">-' + comboDiscount + '%</span>' : ''}
                </div>
                ${c.shipFee ? '<div class="cp-opt-ship">Phí ship: ' + Number(c.shipFee).toLocaleString("vi-VN") + 'đ</div>' : ''}
              </button>`;
            }).join("")}
          </div>
        </div>

        <style>
        #comboPopup .combo-option {
          display:flex; flex-direction:column; align-items:flex-start;
          width:100%; padding:12px 14px; border:2px solid #e2e8f0;
          border-radius:10px; background:#fff; cursor:pointer;
          text-align:left; gap:0; margin-bottom:8px;
          transition: border-color .15s;
        }
        #comboPopup .combo-option.active {
          border-color:#e53e3e; background:#fff5f5;
        }
        #comboPopup .combo-option .combo-name,
        #comboPopup .combo-option .combo-price,
        #comboPopup .combo-option .combo-ship {
          display:none;
        }
        .cp-opt-top {
          display:flex; align-items:flex-start; justify-content:space-between; width:100%; gap:10px;
        }
        .cp-opt-name {
          font-size:13.5px; font-weight:600; color:#1a202c; line-height:1.4; flex:1;
        }
        .cp-opt-badge-free {
          flex-shrink:0; font-size:10px; font-weight:700; color:#fff; background:#38a169;
          padding:3px 8px; border-radius:4px; white-space:nowrap; margin-top:1px;
        }
        .cp-opt-bottom {
          display:flex; align-items:center; gap:8px; margin-top:6px; flex-wrap:wrap;
        }
        .cp-opt-price {
          font-size:17px; font-weight:800; color:#e53e3e;
        }
        .cp-opt-oldprice {
          font-size:13px; color:#aaa; text-decoration:line-through;
        }
        .cp-opt-discount {
          font-size:10px; font-weight:700; color:#fff; background:#e53e3e;
          padding:2px 6px; border-radius:3px;
        }
        .cp-opt-ship {
          font-size:11.5px; color:#c2410c; margin-top:2px;
        }
        </style>

        <!-- SHIP BAR -->
        <div style="margin:0 16px 12px; color:#16a34a; background:linear-gradient(135deg,#f0fff4,#dcfce7); border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; font-weight:600; font-size:13px;">
          🎁 ${P.shipBar || 'Miễn phí vận chuyển khi mua combo'}
        </div>

        <!-- NÚT THÊM VÀO GIỎ (ngay dưới combo options) -->
        <button class="vp-add-to-cart-btn" id="cpAddToCartBtn">🛒 Thêm vào giỏ</button>

        <!-- NÚT ĐẾN GIỎ HÀNG + MUA NGAY -->
        <div class="variant-popup-cta">
          <button class="btn-ghost" id="cpGoToCartBtn">🛒 Đến giỏ hàng<span class="cart-badge" id="cpCartBadge"></span></button>
          <button class="btn-solid" id="cpBuyNowBtn">Mua ngay</button>
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

    <!-- ============ MID CTA — Nhận ưu đãi (ẩn nếu showMidCta === false) ============ -->
    ${showMidCta ? `
    <section style="padding:0 16px; margin-bottom:0;">
      <div id="midCtaBanner" style="display:flex; align-items:center; justify-content:space-between; gap:12px; background:linear-gradient(135deg,#fff7ed,#ffedd5); border:1px solid #fed7aa; border-radius:12px; padding:14px 16px;">
        <div style="font-size:14px; font-weight:600; color:#c2410c; line-height:1.45;">🔥 Nhận giảm giá ${discountNum}% và miễn phí vận chuyển ngay</div>
        <button id="midCtaBtn" style="flex-shrink:0; background:#e53e3e; color:#fff; border:none; border-radius:8px; padding:10px 18px; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap;">Nhận ưu đãi</button>
      </div>
    </section>
    ` : ""}

    <!-- ============ P3 — BENEFITS (chứng minh công dụng) ============ -->
    <section class="section benefits-section">
      ${P.benefits.map((b, i) => `
        <div class="benefit-block ${i % 2 === 0 ? "img-left" : "img-right"}">
          <div class="benefit-img">
            ${b.video
              ? `<div class="lazy-video-wrap" data-type="video" data-src="${b.video}" style="position:relative; cursor:pointer; width:100%; aspect-ratio:16/9; border-radius:10px; overflow:hidden;">
                  <img src="${b.poster}" alt="${b.title}" loading="lazy" decoding="async" style="width:100%; height:100%; object-fit:cover;" />
                  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:32px;background:rgba(0,0,0,0.25);border-radius:10px;">▶</div>
                </div>`
              : `<img src="${b.image}" alt="${b.title}" loading="${i === 0 ? 'eager' : 'lazy'}" fetchpriority="${i === 0 ? 'high' : 'low'}" decoding="async" width="600" height="338" />`
            }
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

      <!-- COMBOS (chỉ render ngoài trang nếu KHÔNG dùng combo popup) -->
      ${(P.combos.length && !hasComboPopup) ? `
        <div class="combos-wrap">
          <div class="combos-label">Chọn combo</div>
          <div class="combos-list">
            ${P.combos.map((c, idx) => `
              <button class="combo-option ${idx === 0 ? "active" : ""}" data-index="${idx}" data-price="${c.price}" data-shipfee="${c.shipFee || 0}">
                <span class="combo-name">${c.name}</span>
                <span class="combo-price">${Number(c.price).toLocaleString("vi-VN")}đ</span>
                ${c.shipFee ? '<span class="combo-ship">Ship: ' + Number(c.shipFee).toLocaleString("vi-VN") + 'đ</span>' : '<span class="combo-ship combo-freeship">Free ship</span>'}
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
          : hasComboPopup
            ? `<button class="btn-ghost" id="inlineAddToCartBtn">Chọn combo</button>`
            : `<button class="btn-ghost" id="inlineAddToCartBtn">Thêm vào giỏ</button>`
        }
        <button class="btn-solid" id="inlineBuyNowBtn">Mua ngay</button>
      </div>
    </section>

    <!-- ============ VARIANT POPUP (chỉ render nếu có biến thể màu) ============ -->
    ${variantPopupHTML}

    <!-- ============ COMBO POPUP (chỉ render nếu có combo + không có color variant) ============ -->
    ${comboPopupHTML}

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

  /* ── COMBO SELECTOR (ngoài trang — chỉ khi không dùng combo popup) ── */
  if (!hasComboPopup) {
    document.querySelectorAll(".combo-option").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".combo-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  /* ── COMBO POPUP — EVENT LISTENERS ── */
  if (hasComboPopup) {
    const cpOverlay  = document.getElementById("comboPopupOverlay");
    const cpCloseBtn = document.getElementById("comboPopupClose");
    const cpHasImages = P.combos.some(c => c.image);

    let cpCurrentSlide = 0;
    const cpTotalSlides = P.combos.length;

    function cpGoToSlide(idx) {
      if (!cpHasImages) return;
      cpCurrentSlide = idx;
      const cpSlides = document.getElementById("cpSlides");
      if (cpSlides) cpSlides.style.transform = "translateX(-" + (idx * 100) + "%)";
      document.querySelectorAll("#cpDots .variant-popup-dot").forEach(function(dot, i) {
        dot.classList.toggle("active", i === idx);
      });
      document.querySelectorAll("#cpThumbs .variant-popup-thumb").forEach(function(thumb, i) {
        thumb.classList.toggle("active", i === idx);
      });
      var activeThumb = document.querySelectorAll("#cpThumbs .variant-popup-thumb")[idx];
      if (activeThumb) activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    if (cpHasImages) {
      document.querySelectorAll("#cpDots .variant-popup-dot").forEach(function(dot) {
        dot.addEventListener("click", function() {
          cpGoToSlide(parseInt(dot.dataset.index));
          var comboBtns = document.querySelectorAll("#comboPopup .combo-option");
          comboBtns.forEach(function(b) { b.classList.remove("active"); });
          if (comboBtns[parseInt(dot.dataset.index)]) {
            comboBtns[parseInt(dot.dataset.index)].classList.add("active");
            comboBtns[parseInt(dot.dataset.index)].click();
          }
        });
      });

      document.querySelectorAll("#cpThumbs .variant-popup-thumb").forEach(function(thumb) {
        thumb.addEventListener("click", function() {
          cpGoToSlide(parseInt(thumb.dataset.index));
          var comboBtns = document.querySelectorAll("#comboPopup .combo-option");
          comboBtns.forEach(function(b) { b.classList.remove("active"); });
          if (comboBtns[parseInt(thumb.dataset.index)]) {
            comboBtns[parseInt(thumb.dataset.index)].classList.add("active");
            comboBtns[parseInt(thumb.dataset.index)].click();
          }
        });
      });

      var cpStartX = 0, cpMoveX = 0, cpIsDragging = false, cpIsHorizontal = null;
      var cpSlider = document.getElementById("cpSlider");

      if (cpSlider) {
        cpSlider.addEventListener("touchstart", function(e) {
          cpStartX = cpMoveX = e.touches[0].clientX;
          cpIsDragging = true;
          cpIsHorizontal = null;
        }, { passive: true });

        cpSlider.addEventListener("touchmove", function(e) {
          if (!cpIsDragging) return;
          cpMoveX = e.touches[0].clientX;
          var diffX = Math.abs(cpMoveX - cpStartX);
          var diffY = Math.abs(e.touches[0].clientY - cpStartX);
          if (cpIsHorizontal === null && (diffX > 5 || diffY > 5)) {
            cpIsHorizontal = diffX >= diffY;
          }
          if (cpIsHorizontal === true) e.preventDefault();
        }, { passive: false });

        cpSlider.addEventListener("touchend", function() {
          if (!cpIsDragging) return;
          if (cpIsHorizontal === true) {
            var diff = cpStartX - cpMoveX;
            if (diff > 50 && cpCurrentSlide < cpTotalSlides - 1) {
              cpGoToSlide(cpCurrentSlide + 1);
              var comboBtns = document.querySelectorAll("#comboPopup .combo-option");
              comboBtns.forEach(function(b) { b.classList.remove("active"); });
              if (comboBtns[cpCurrentSlide]) {
                comboBtns[cpCurrentSlide].classList.add("active");
                comboBtns[cpCurrentSlide].click();
              }
            } else if (diff < -50 && cpCurrentSlide > 0) {
              cpGoToSlide(cpCurrentSlide - 1);
              var comboBtns2 = document.querySelectorAll("#comboPopup .combo-option");
              comboBtns2.forEach(function(b) { b.classList.remove("active"); });
              if (comboBtns2[cpCurrentSlide]) {
                comboBtns2[cpCurrentSlide].classList.add("active");
                comboBtns2[cpCurrentSlide].click();
              }
            }
          }
          cpIsDragging = false;
          cpIsHorizontal = null;
        });
      }
    }

    function openComboPopup() {
      cpOverlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function closeComboPopup() {
      cpOverlay.classList.remove("show");
      document.body.style.overflow = "auto";
    }

    cpCloseBtn.addEventListener("click", closeComboPopup);
    cpOverlay.addEventListener("click", function(e) {
      if (e.target === cpOverlay) closeComboPopup();
    });

    document.querySelectorAll("#comboPopup .combo-option").forEach(function(btn) {
      btn.addEventListener("click", function() {
        document.querySelectorAll("#comboPopup .combo-option").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");

        var price    = parseInt(btn.dataset.price);
        var shipFee  = parseInt(btn.dataset.shipfee || "0");
        var oldPrice = parseInt(btn.dataset.oldprice || P.oldPrice);
        var disc     = Math.round((1 - price / oldPrice) * 100);

        document.querySelector(".cp-price-display").textContent = Number(price).toLocaleString("vi-VN") + "đ";
        document.querySelector(".cp-oldprice-display").textContent = Number(oldPrice).toLocaleString("vi-VN") + "đ";
        document.querySelector(".cp-discount-display").textContent = "-" + disc + "%";

        var shipEl = document.querySelector(".cp-ship-display");
        if (shipFee > 0) {
          shipEl.textContent = "🚚 Phí ship: " + Number(shipFee).toLocaleString("vi-VN") + "đ";
          shipEl.style.color = "#c2410c";
          shipEl.style.background = "#fff7ed";
        } else {
          shipEl.textContent = "🚚 Miễn phí vận chuyển";
          shipEl.style.color = "#38a169";
          shipEl.style.background = "#f0fff4";
        }

        var comboIdx = parseInt(btn.dataset.index);
        cpGoToSlide(comboIdx);
      });
    });

    window.__comboPopup = {
      open: openComboPopup,
      close: closeComboPopup
    };
  }

  /* ── VARIANT POPUP — EVENT LISTENERS (chỉ khi có biến thể màu) ── */
  if (hasColorVariant) {
    const vpOverlay   = document.getElementById("variantPopupOverlay");
    const vpCloseBtn  = document.getElementById("variantPopupClose");
    const vpSlides    = document.getElementById("vpSlides");
    const vpDots      = document.querySelectorAll(".variant-popup-dot");
    const vpThumbs    = document.querySelectorAll(".variant-popup-thumb");
    const vpColorBtns = document.querySelectorAll(".vp-color-option");
    let vpCurrentSlide = 0;
    const vpTotalSlides = P.variants.find(v => v.type === "color").options.length;

    function vpGoToSlide(idx) {
      vpCurrentSlide = idx;
      vpSlides.style.transform = `translateX(-${idx * 100}%)`;
      vpDots.forEach((dot, i) => dot.classList.toggle("active", i === idx));
      vpThumbs.forEach((thumb, i) => thumb.classList.toggle("active", i === idx));
      vpColorBtns.forEach((btn, i) => btn.classList.toggle("active", i === idx));
      const activeThumb = document.querySelectorAll(".variant-popup-thumb")[idx];
      if (activeThumb) activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    vpDots.forEach(dot => {
      dot.addEventListener("click", () => {
        vpGoToSlide(parseInt(dot.dataset.index));
      });
    });

    vpThumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        vpGoToSlide(parseInt(thumb.dataset.index));
      });
    });

    vpColorBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        vpGoToSlide(parseInt(btn.dataset.index));
      });
    });

    document.querySelectorAll(".vp-other-option").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        document.querySelectorAll(`.vp-other-option[data-type="${type}"]`).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

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

    function openVariantPopup() {
      vpOverlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }

    function closeVariantPopup() {
      vpOverlay.classList.remove("show");
      document.body.style.overflow = "auto";
    }

    vpCloseBtn.addEventListener("click", closeVariantPopup);
    vpOverlay.addEventListener("click", e => {
      if (e.target === vpOverlay) closeVariantPopup();
    });

    window.__variantPopup = {
      open: openVariantPopup,
      close: closeVariantPopup,
      getSelectedVariants: function () {
        const result = {};
        const activeColor = document.querySelector(".vp-color-option.active");
        if (activeColor) result["color"] = activeColor.dataset.value;
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
