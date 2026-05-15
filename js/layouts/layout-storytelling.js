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

  const hasColorVariant = P.variants.some(v => v.type === "color");
  const hasComboPopup   = P.combos.length > 0 && !hasColorVariant;
  const showMidCta      = P.showMidCta !== false;
  const discountNum     = P.discount
    ? P.discount.replace(/[^0-9]/g, "")
    : Math.round((1 - P.price / P.oldPrice) * 100);

  /* ── Build variant popup HTML ── */
  let variantPopupHTML = "";
  if (hasColorVariant) {
    const colorVariant   = P.variants.find(v => v.type === "color");
    const otherVariants  = P.variants.filter(v => v.type !== "color");
    const firstColorName = colorVariant.options[0].name;

    variantPopupHTML = `
    <style>
      /* ── Size image lightbox ── */
      #vpSizeImgLightbox {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.88);
        z-index: 99999;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      #vpSizeImgLightbox.show { display: flex; }
      #vpSizeImgLightbox img {
        max-width: 92vw;
        max-height: 80vh;
        border-radius: 10px;
        object-fit: contain;
      }
      #vpSizeImgLightboxClose {
        position: absolute;
        top: 18px; right: 18px;
        background: rgba(255,255,255,0.15);
        border: none;
        color: #fff;
        font-size: 26px;
        width: 40px; height: 40px;
        border-radius: 50%;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        line-height: 1;
      }
      /* ── Variant options layout ── */
      .variant-popup-options {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      /* Color options — tự co theo nội dung */
      .vp-color-option {
        flex: 0 0 auto;
        padding: 8px 12px;
        border: 1.5px solid #e2e8f0;
        border-radius: 8px;
        background: #fff;
        font-size: 12.5px;
        font-weight: 600;
        color: #1a202c;
        cursor: pointer;
        line-height: 1.4;
        text-align: center;
        transition: border-color 0.15s, background 0.15s;
      }

      .vp-color-option.active {
        border-color: #e53e3e;
        background: #fff5f5;
        color: #e53e3e;
      }

      /* Size options — chia đều 1 hàng */
      .vp-other-option {
        flex: 1 1 0;
        min-width: 0;
        text-align: center;
        white-space: normal;
        word-break: break-word;
        padding: 10px 8px;
        border: 1.5px solid #e2e8f0;
        border-radius: 8px;
        background: #fff;
        font-size: 12.5px;
        font-weight: 600;
        color: #1a202c;
        cursor: pointer;
        line-height: 1.4;
        transition: border-color 0.15s, background 0.15s;
      }

      .vp-other-option.active {
        border-color: #e53e3e;
        background: #fff5f5;
        color: #e53e3e;
      }

      .vp-other-option.vp-soldout {
        opacity: 0.45;
        cursor: not-allowed;
        text-decoration: line-through;
      }
      
      /* ── Size tag trên slide ── */
      .vp-size-tag {
      position: absolute;
      bottom: 10px;
      left: 10px;
      background: rgba(17, 24, 39, 0.78);
      color: #fff;
      font-size: 13px;
      font-weight: 900;
      padding: 7px 11px;
      border-radius: 999px;
      pointer-events: none;
      line-height: 1.25;
      max-width: calc(100% - 20px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
    }



    </style>

    <!-- SIZE IMAGE LIGHTBOX (ngoài popup, fixed toàn màn hình) -->
    <div id="vpSizeImgLightbox">
      <button id="vpSizeImgLightboxClose">&times;</button>
      <img id="vpSizeImgLightboxImg" src="" alt="Xem ảnh size" />
    </div>

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
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#B8860B; font-weight:600;">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/><polyline points="9 12 11 14 15 10"/></svg>
              Xem hàng trước khi trả tiền
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#B8860B; font-weight:600;">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/><polyline points="9 12 11 14 15 10"/></svg>
              BH 12 tháng 1 đổi 1
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#B8860B; font-weight:600;">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/><polyline points="9 12 11 14 15 10"/></svg>
              Hoàn tiền nếu sai mô tả
            </div>
          </div>

        </div>

        <!-- SLIDER ẢNH MÀU + SIZE -->
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
              <div class="variant-popup-dot ${idx === 0 ? "active" : ""}" data-index="${idx}" data-dot-type="color"></div>
            `).join("")}
          </div>
          <div class="variant-popup-thumbs" id="vpThumbs">
            ${colorVariant.options.map((opt, idx) => `
              <div class="variant-popup-thumb ${idx === 0 ? "active" : ""}" data-index="${idx}" data-thumb-type="color">
                <img src="${opt.image}" alt="${opt.name}" loading="lazy" decoding="async" />
              </div>
            `).join("")}
          </div>
        </div>

        <!-- GIFT NOTE + LIVE COUNT -->
        <div style="padding:0 16px 4px; text-align:center;">
          <div style="display:flex; align-items:center; justify-content:center; gap:6px; font-size:13.5px; font-weight:600; color:#38a169;">
            <span style="font-size:16px;">🎁</span> Đã bao gồm full bộ quà tặng kèm cho bé
          </div>
          <div style="margin-top:5px; font-size:11.5px; color:#b7913a; font-weight:500; letter-spacing:0.01em;">
            65% khách hàng mua lại &middot; <span id="vpLiveCount">148</span> người đang mua
          </div>
        </div>

        <!-- BIẾN THỂ MÀU -->
        <div class="variant-popup-section">
          <div class="variant-popup-label">${colorVariant.label}</div>
          <div class="variant-popup-options">
            ${colorVariant.options.map((opt, idx) => `
              <button
                class="variant-popup-option vp-color-option ${idx === 0 ? "active" : ""}"
                data-type="color"
                data-value="${opt.name}"
                data-index="${idx}"
                style="position:relative;"
              >
                ${opt.name}
                ${opt.soldBadge ? `<span style="display:block; font-size:9px; font-weight:700; color:#e53e3e; margin-top:2px; line-height:1;">${opt.soldBadge}</span>` : ""}
              </button>
            `).join("")}
          </div>
        </div>

        <!-- BIẾN THỂ KHÁC (size) -->
        ${otherVariants.map(v => {
          const isSizeVariant = v.type === "size";
          return `
          <div class="variant-popup-section">
            <div class="variant-popup-label">${v.label}</div>
            ${isSizeVariant ? `<div style="font-size:11.5px; color:#6b7280; margin:-4px 0 8px; line-height:1.5;">📌 Lớp 1–3 chọn size nhỏ. Lớp 4–6 chọn size lớn. Cả 2 size đều đựng vừa sách giáo khoa và giấy A4.</div>` : ""}

            <div class="variant-popup-options">
              ${v.options.map((opt, idx) => {
                const isSoldOut = isSizeVariant && opt.soldOutFor && opt.soldOutFor.includes(firstColorName);
                return `
                <button
                  class="variant-popup-option vp-other-option ${idx === 0 && !isSoldOut ? "active" : ""} ${isSoldOut ? "vp-soldout" : ""}"
                  data-type="${v.type}"
                  data-value="${isSizeVariant ? opt.name : opt}"
                  data-index="${idx}"
                  ${isSoldOut ? "disabled" : ""}
                  style="${isSoldOut ? "opacity:0.45; cursor:not-allowed; text-decoration:line-through;" : ""}"
                >
                  ${isSizeVariant ? opt.name : opt}
                  ${isSoldOut ? `<span style="display:block; font-size:9px; color:#e53e3e; font-weight:600; margin-top:2px;">Tạm hết màu này</span>` : ""}
                </button>`;
              }).join("")}
            </div>
          </div>`;
        }).join("")}

        <!-- TÓM TẮT LỰA CHỌN -->
        <div class="vp-selected-summary" id="vpSelectedSummary">
          <div class="vp-selected-summary-label">Bạn đang chọn</div>
          <div class="vp-selected-summary-value" id="vpSelectedSummaryText">Đang cập nhật...</div>
        </div>

        <!-- CAM KẾT TRƯỚC KHI MUA -->
        <div class="vp-trust-box">
          🎁 Đơn này đã kèm full bộ quà tặng cho bé<br>
          🚚 Được xem hàng trước khi thanh toán<br>
          🛡️ Bảo hành 12 tháng, 1 đổi 1 nếu lỗi khóa
        </div>

        <!-- CTA TỐI ƯU -->
        <div class="vp-popup-cta-v2">
          <button class="btn-solid vp-main-buy-btn" id="vpBuyNowBtn">🎁 Mua ngay - nhận quà</button>

          <div class="vp-cart-actions">
            <button class="vp-cart-mini-btn" id="vpAddToCartBtn">🛒 Thêm vào giỏ</button>
            <button class="vp-cart-mini-btn vp-go-cart-mini-btn" id="vpGoToCartBtn">
              🛒 Đi đến giỏ<span class="cart-badge" id="vpCartBadge"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  /* ── Build combo popup HTML ── */
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
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#B8860B; font-weight:600;">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/><polyline points="9 12 11 14 15 10"/></svg>
              Xem hàng trước khi trả tiền
            </div>
            <div style="display:flex; align-items:center; gap:4px; font-size:11px; color:#B8860B; font-weight:600;">
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#B8860B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7z"/><polyline points="9 12 11 14 15 10"/></svg>
              Hoàn tiền nếu sai mô tả
            </div>
          </div>

        </div>
        ${comboHasImages ? `
        <div class="variant-popup-gallery">
          <div class="variant-popup-slider" id="cpSlider">
            <div class="variant-popup-slides" id="cpSlides">
              ${P.combos.map(c => `<div class="variant-popup-slide"><img src="${c.image}" alt="${c.name}" loading="lazy" decoding="async" /></div>`).join("")}
            </div>
          </div>
          <div class="variant-popup-dots" id="cpDots">
            ${P.combos.map((c, idx) => `<div class="variant-popup-dot ${idx === 0 ? "active" : ""}" data-index="${idx}"></div>`).join("")}
          </div>
          <div class="variant-popup-thumbs" id="cpThumbs">
            ${P.combos.map((c, idx) => `<div class="variant-popup-thumb ${idx === 0 ? "active" : ""}" data-index="${idx}"><img src="${c.image}" alt="${c.name}" loading="lazy" decoding="async" /></div>`).join("")}
          </div>
        </div>
        ` : ""}
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
        #comboPopup .combo-option { display:flex; flex-direction:column; align-items:flex-start; width:100%; padding:12px 14px; border:2px solid #e2e8f0; border-radius:10px; background:#fff; cursor:pointer; text-align:left; gap:0; margin-bottom:8px; transition:border-color .15s; }
        #comboPopup .combo-option.active { border-color:#e53e3e; background:#fff5f5; }
        #comboPopup .combo-option .combo-name, #comboPopup .combo-option .combo-price, #comboPopup .combo-option .combo-ship { display:none; }
        .cp-opt-top { display:flex; align-items:flex-start; justify-content:space-between; width:100%; gap:10px; }
        .cp-opt-name { font-size:13.5px; font-weight:600; color:#1a202c; line-height:1.4; flex:1; }
        .cp-opt-badge-free { flex-shrink:0; font-size:10px; font-weight:700; color:#fff; background:#38a169; padding:3px 8px; border-radius:4px; white-space:nowrap; margin-top:1px; }
        .cp-opt-bottom { display:flex; align-items:center; gap:8px; margin-top:6px; flex-wrap:wrap; }
        .cp-opt-price { font-size:17px; font-weight:800; color:#e53e3e; }
        .cp-opt-oldprice { font-size:13px; color:#aaa; text-decoration:line-through; }
        .cp-opt-discount { font-size:10px; font-weight:700; color:#fff; background:#e53e3e; padding:2px 6px; border-radius:3px; }
        .cp-opt-ship { font-size:11.5px; color:#c2410c; margin-top:2px; }
        </style>
        <div style="margin:0 16px 12px; color:#16a34a; background:linear-gradient(135deg,#f0fff4,#dcfce7); border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; font-weight:600; font-size:13px;">
          🎁 ${P.shipBar || 'Miễn phí vận chuyển khi mua combo'}
        </div>
        <button class="vp-add-to-cart-btn" id="cpAddToCartBtn">🛒 Thêm vào giỏ</button>
        <div class="variant-popup-cta">
          <button class="btn-ghost" id="cpGoToCartBtn">🛒 Đến giỏ hàng<span class="cart-badge" id="cpCartBadge"></span></button>
          <button class="btn-solid" id="cpBuyNowBtn">Mua ngay</button>
        </div>
      </div>
    </div>
    `;
  }

  root.innerHTML = `
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

    ${showMidCta ? `
    <section style="padding:0 16px; margin-bottom:0;">
      <div id="midCtaBanner" style="display:flex; align-items:center; justify-content:space-between; gap:12px; background:linear-gradient(135deg,#fff7ed,#ffedd5); border:1px solid #fed7aa; border-radius:12px; padding:14px 16px;">
        <div style="font-size:14px; font-weight:600; color:#c2410c; line-height:1.45;">🔥 Nhận giảm giá ${discountNum}% và miễn phí vận chuyển ngay</div>
        <button id="midCtaBtn" style="flex-shrink:0; background:#e53e3e; color:#fff; border:none; border-radius:8px; padding:10px 18px; font-size:14px; font-weight:700; cursor:pointer; white-space:nowrap;">Nhận ưu đãi</button>
      </div>
    </section>
    ` : ""}

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

    <section class="section pricing-section">
      <div class="pricing-product-name">${P.shortName}</div>
      <div class="sale-bar">🔥 Giảm ${discountNum}% và miễn phí vận chuyển khi đặt hàng trong hôm nay</div>
      <div class="price-row">
        <span class="price-label">Giá chỉ:</span>
        <span class="price">${Number(P.price).toLocaleString("vi-VN")}đ</span>
        <span class="old-price">${Number(P.oldPrice).toLocaleString("vi-VN")}đ</span>
        <span class="badge-discount">-${discountNum}%</span>
      </div>

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

      <div class="ship-bar" style="color:#16a34a; background:linear-gradient(135deg,#f0fff4,#dcfce7); border:1px solid #bbf7d0; border-radius:8px; padding:10px 14px; font-weight:600; font-size:14px; position:relative; overflow:hidden;">
        <span class="ship-bar-shimmer"></span>
        <span style="position:relative; z-index:1;">🎁 ${P.shipBar || 'Miễn phí vận chuyển &amp; hoàn trả toàn quốc khi mua trong hôm nay'}</span>
      </div>
      <style>
      .ship-bar-shimmer { position:absolute; top:0; left:-100%; width:100%; height:100%; background:linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.6) 50%,transparent 100%); animation:shipBarShimmer 2s ease-in-out infinite; pointer-events:none; z-index:0; }
      @keyframes shipBarShimmer { 0%{left:-100%} 100%{left:100%} }
      </style>

      <div class="return-policy-bar">
        <span class="return-policy-icon">🛡️</span>
        <span class="return-policy-text">${P.returnPolicy.content}</span>
      </div>

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

    ${variantPopupHTML}
    ${comboPopupHTML}

    <section class="section review-section">
      <div class="section-heading">Đánh giá từ khách hàng</div>
      <div id="reviewSummary"></div>
      <div id="reviewList"></div>
    </section>

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

  /* ── ORDER NOTIFICATION ── */
  const orderNotifTop = document.createElement("div");
  orderNotifTop.className = "order-notif-top";
  orderNotifTop.innerHTML = `<div class="order-notif-top-inner"><span class="order-notif-top-icon">🔔</span><span class="order-notif-top-text" id="orderNotifTopText"></span></div>`;
  document.body.appendChild(orderNotifTop);

  (function initTopNotif() {
    const textEl = document.getElementById("orderNotifTopText");

    function showThenHide(entry) {
      textEl.textContent = entry.shortText;
      orderNotifTop.classList.add("show");
      setTimeout(function() {
        orderNotifTop.classList.remove("show");
      }, 5000);
    }

    /* Nếu engine đã sẵn sàng thì subscribe ngay */
    if (window.__liveNotif) {
      window.__liveNotif.subscribe(showThenHide);
    } else {
      /* Fallback: chờ engine khởi động (core.js load sau) */
      var waited = 0;
      var waitInterval = setInterval(function() {
        waited += 50;
        if (window.__liveNotif) {
          clearInterval(waitInterval);
          window.__liveNotif.subscribe(showThenHide);
        } else if (waited > 5000) {
          clearInterval(waitInterval);
        }
      }, 50);
    }
  })();

  /* ── LIVE COUNT ── */
  (function liveCount() {
    const el = document.getElementById("vpLiveCount");
    if (!el) return;
    let current = 148;
    function tick() {
      const delta = Math.floor(Math.random() * 4) + 1;
      current = Math.max(130, Math.min(180, current + (Math.random() < 0.5 ? 1 : -1) * delta));
      el.textContent = current;
      setTimeout(tick, Math.floor(Math.random() * 2001) + 2000);
    }
    setTimeout(tick, 2000);
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
      const idx  = head.dataset.faq;
      const body = document.getElementById("faqBody" + idx);
      const isOpen = head.classList.contains("active");
      document.querySelectorAll(".faq-head").forEach(h => h.classList.remove("active"));
      document.querySelectorAll(".faq-body").forEach(b => b.classList.remove("show"));
      if (!isOpen) { head.classList.add("active"); body.classList.add("show"); }
    });
  });

  /* ── VARIANT SELECTOR (không có biến thể màu) ── */
  document.querySelectorAll(".variant-option").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      document.querySelectorAll(`.variant-option[data-type="${type}"]`).forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  /* ── COMBO SELECTOR (ngoài trang) ── */
  if (!hasComboPopup) {
    document.querySelectorAll(".combo-option").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".combo-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });
  }

  /* ── COMBO POPUP ── */
  if (hasComboPopup) {
    const cpOverlay   = document.getElementById("comboPopupOverlay");
    const cpCloseBtn  = document.getElementById("comboPopupClose");
    const cpHasImages = P.combos.some(c => c.image);
    let cpCurrentSlide  = 0;
    const cpTotalSlides = P.combos.length;

    function cpGoToSlide(idx) {
      if (!cpHasImages) return;
      cpCurrentSlide = idx;
      const cpSlides = document.getElementById("cpSlides");
      if (cpSlides) cpSlides.style.transform = "translateX(-" + (idx * 100) + "%)";
      document.querySelectorAll("#cpDots .variant-popup-dot").forEach((d, i) => d.classList.toggle("active", i === idx));
      document.querySelectorAll("#cpThumbs .variant-popup-thumb").forEach((t, i) => t.classList.toggle("active", i === idx));
      const at = document.querySelectorAll("#cpThumbs .variant-popup-thumb")[idx];
      if (at) at.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    if (cpHasImages) {
      document.querySelectorAll("#cpDots .variant-popup-dot").forEach(dot => {
        dot.addEventListener("click", () => {
          const i = parseInt(dot.dataset.index);
          cpGoToSlide(i);
          const btns = document.querySelectorAll("#comboPopup .combo-option");
          btns.forEach(b => b.classList.remove("active"));
          if (btns[i]) { btns[i].classList.add("active"); btns[i].click(); }
        });
      });
      document.querySelectorAll("#cpThumbs .variant-popup-thumb").forEach(thumb => {
        thumb.addEventListener("click", () => {
          const i = parseInt(thumb.dataset.index);
          cpGoToSlide(i);
          const btns = document.querySelectorAll("#comboPopup .combo-option");
          btns.forEach(b => b.classList.remove("active"));
          if (btns[i]) { btns[i].classList.add("active"); btns[i].click(); }
        });
      });
      let cpSX = 0, cpMX = 0, cpDrag = false, cpHz = null;
      const cpSliderEl = document.getElementById("cpSlider");
      if (cpSliderEl) {
        cpSliderEl.addEventListener("touchstart", e => { cpSX = cpMX = e.touches[0].clientX; cpDrag = true; cpHz = null; }, { passive: true });
        cpSliderEl.addEventListener("touchmove", e => {
          if (!cpDrag) return; cpMX = e.touches[0].clientX;
          const dX = Math.abs(cpMX - cpSX), dY = Math.abs(e.touches[0].clientY - cpSX);
          if (cpHz === null && (dX > 5 || dY > 5)) cpHz = dX >= dY;
          if (cpHz) e.preventDefault();
        }, { passive: false });
        cpSliderEl.addEventListener("touchend", () => {
          if (!cpDrag) return;
          if (cpHz) {
            const diff = cpSX - cpMX;
            const btns = document.querySelectorAll("#comboPopup .combo-option");
            if (diff > 50 && cpCurrentSlide < cpTotalSlides - 1) { cpGoToSlide(cpCurrentSlide + 1); btns.forEach(b => b.classList.remove("active")); if (btns[cpCurrentSlide]) { btns[cpCurrentSlide].classList.add("active"); btns[cpCurrentSlide].click(); } }
            else if (diff < -50 && cpCurrentSlide > 0) { cpGoToSlide(cpCurrentSlide - 1); btns.forEach(b => b.classList.remove("active")); if (btns[cpCurrentSlide]) { btns[cpCurrentSlide].classList.add("active"); btns[cpCurrentSlide].click(); } }
          }
          cpDrag = false; cpHz = null;
        });
      }
    }

    function openComboPopup()  { cpOverlay.classList.add("show");    document.body.style.overflow = "hidden"; }
    function closeComboPopup() { cpOverlay.classList.remove("show"); document.body.style.overflow = "auto"; }
    cpCloseBtn.addEventListener("click", closeComboPopup);
    cpOverlay.addEventListener("click", e => { if (e.target === cpOverlay) closeComboPopup(); });

    document.querySelectorAll("#comboPopup .combo-option").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#comboPopup .combo-option").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const price = parseInt(btn.dataset.price), shipFee = parseInt(btn.dataset.shipfee || "0"), oldPrice = parseInt(btn.dataset.oldprice || P.oldPrice);
        document.querySelector(".cp-price-display").textContent    = Number(price).toLocaleString("vi-VN") + "đ";
        document.querySelector(".cp-oldprice-display").textContent = Number(oldPrice).toLocaleString("vi-VN") + "đ";
        document.querySelector(".cp-discount-display").textContent = "-" + Math.round((1 - price / oldPrice) * 100) + "%";
        const shipEl = document.querySelector(".cp-ship-display");
        if (shipFee > 0) { shipEl.textContent = "🚚 Phí ship: " + Number(shipFee).toLocaleString("vi-VN") + "đ"; shipEl.style.color = "#c2410c"; shipEl.style.background = "#fff7ed"; }
        else             { shipEl.textContent = "🚚 Miễn phí vận chuyển"; shipEl.style.color = "#38a169"; shipEl.style.background = "#f0fff4"; }
        cpGoToSlide(parseInt(btn.dataset.index));
      });
    });

    window.__comboPopup = { open: openComboPopup, close: closeComboPopup };
  }

  /* ── VARIANT POPUP ── */
  if (hasColorVariant) {
    const vpOverlay   = document.getElementById("variantPopupOverlay");
    const vpCloseBtn  = document.getElementById("variantPopupClose");
    const vpSlides    = document.getElementById("vpSlides");
    const vpDots      = document.querySelectorAll(".variant-popup-dot");
    const vpThumbs    = document.querySelectorAll(".variant-popup-thumb");
    const vpColorBtns = document.querySelectorAll(".vp-color-option");
    const colorVariant = P.variants.find(v => v.type === "color");
    const sizeVariant  = P.variants.find(v => v.type === "size");
    let vpCurrentSlide  = 0;
    const vpTotalSlides = colorVariant.options.length;
    let vpSelectedColorName = colorVariant.options[0].name;

    /* ── SIZE IMAGE LIGHTBOX ── */
    const lightbox      = document.getElementById("vpSizeImgLightbox");
    const lightboxImg   = document.getElementById("vpSizeImgLightboxImg");
    const lightboxClose = document.getElementById("vpSizeImgLightboxClose");

    function openLightbox(src) {
      lightboxImg.src = src;
      lightbox.classList.add("show");
    }
    function closeLightbox() {
      lightbox.classList.remove("show");
      lightboxImg.src = "";
    }

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });

    const vpSizeImageWrap = document.getElementById("vpSizeImageWrap");
    const vpSizeImage     = document.getElementById("vpSizeImage");
    if (vpSizeImageWrap && vpSizeImage) {
      vpSizeImageWrap.addEventListener("click", () => {
        if (vpSizeImage.src) openLightbox(vpSizeImage.src);
      });
    }

    /* ── NÚT QUAY LẠI trong orderModal ── */
    if (!document.getElementById("vpBackToVariantBtn")) {
      const modalTop = document.querySelector("#orderModal .modal-top");
      if (modalTop) {
        modalTop.style.cssText = "display:flex; align-items:center; gap:8px; flex-wrap:nowrap;";
        const backBtn = document.createElement("button");
        backBtn.id = "vpBackToVariantBtn";
        backBtn.textContent = "← Chọn size";
        backBtn.style.cssText = [
          "background:none",
          "border:none",
          "color:#2b6cb0",
          "font-size:12px",
          "font-weight:600",
          "padding:0",
          "cursor:pointer",
          "white-space:nowrap",
          "flex-shrink:0"
        ].join(";");
        backBtn.addEventListener("click", () => {
          document.getElementById("orderModal").classList.remove("show");
          document.body.style.overflow = "hidden";
          vpOverlay.classList.add("show");
        });
        modalTop.insertBefore(backBtn, modalTop.firstChild);
      }
    }

    /* ── CẬP NHẬT SIZE UI ── */
    function vpUpdateSizeUI(colorName) {
      if (!sizeVariant) return;
      const sizeImgEl = document.getElementById("vpSizeImage");
      const sizeBtns  = document.querySelectorAll(".vp-other-option[data-type='size']");
      let activeSizeName = null;
      sizeBtns.forEach(b => { if (b.classList.contains("active")) activeSizeName = b.dataset.value; });

      sizeBtns.forEach((btn, idx) => {
        const sizeOpt = sizeVariant.options[idx];
        const soldOut = sizeOpt.soldOutFor && sizeOpt.soldOutFor.includes(colorName);
        btn.disabled = soldOut;
        btn.style.opacity        = soldOut ? "0.45" : "";
        btn.style.cursor         = soldOut ? "not-allowed" : "";
        btn.style.textDecoration = soldOut ? "line-through" : "";
        const tag = btn.querySelector(".vp-soldout-tag");
        if (soldOut) {
          if (!tag) {
            const t = document.createElement("span");
            t.className = "vp-soldout-tag";
            t.style.cssText = "display:block; font-size:9px; color:#e53e3e; font-weight:600; margin-top:2px;";
            t.textContent = "Tạm hết màu này";
            btn.appendChild(t);
          }
          btn.classList.remove("active");
        } else {
          if (tag) tag.remove();
        }
      });

      /* Giữ size cũ nếu còn hàng, không thì lấy size đầu còn hàng */
      let newActiveBtn = null;
      sizeBtns.forEach((btn, idx) => {
        const soldOut = sizeVariant.options[idx].soldOutFor && sizeVariant.options[idx].soldOutFor.includes(colorName);
        if (!soldOut && btn.dataset.value === activeSizeName && !newActiveBtn) newActiveBtn = btn;
      });
      if (!newActiveBtn) {
        sizeBtns.forEach((btn, idx) => {
          const soldOut = sizeVariant.options[idx].soldOutFor && sizeVariant.options[idx].soldOutFor.includes(colorName);
          if (!soldOut && !newActiveBtn) newActiveBtn = btn;
        });
      }
      sizeBtns.forEach(b => b.classList.remove("active"));
      if (newActiveBtn) {
        newActiveBtn.classList.add("active");
        const ai = parseInt(newActiveBtn.dataset.index);
        if (sizeImgEl && sizeVariant.options[ai] && sizeVariant.options[ai].images) {
          sizeImgEl.src = sizeVariant.options[ai].images[colorName] || "";
        }
      }
      vpUpdateSelectedSummary();
    }

    const vpColorCount = colorVariant.options.length;
    function vpUpdateSelectedSummary() {
      const summaryText = document.getElementById("vpSelectedSummaryText");
      if (!summaryText) return;

      const activeSize = document.querySelector(".vp-other-option[data-type='size'].active");
      const sizeText = activeSize ? activeSize.dataset.value : "";

      summaryText.textContent = sizeText
        ? `${vpSelectedColorName} · ${sizeText}`
        : vpSelectedColorName;
    }

    function vpBuildExtraGallerySlides() {
      const extraImages = Array.isArray(P.extraGalleryImages) ? P.extraGalleryImages : [];

      /* Xoá các ảnh xem thêm cũ nếu có */
      vpSlides.querySelectorAll(".vp-slide-extra").forEach(el => el.remove());
      document.querySelectorAll("#vpDots .variant-popup-dot[data-dot-type='extra']").forEach(el => el.remove());
      document.querySelectorAll("#vpThumbs .variant-popup-thumb[data-thumb-type='extra']").forEach(el => el.remove());

      if (!extraImages.length) return;

      extraImages.forEach((item, idx) => {
        const img = item.image || "";
        if (!img) return;

        const label = item.label || `Ảnh tham khảo ${idx + 1}`;
        const slideIndex = vpColorCount + idx;

        /* Slide ảnh xem thêm */
        const slide = document.createElement("div");
        slide.className = "variant-popup-slide vp-slide-extra";
        slide.style.position = "relative";
        slide.innerHTML = `
          <img src="${img}" alt="${label}" loading="lazy" decoding="async" data-extra-slide="true" />
          <div class="vp-size-tag">${label}</div>
        `;
        vpSlides.appendChild(slide);

        /* Dot ảnh xem thêm */
        const dot = document.createElement("div");
        dot.className = "variant-popup-dot";
        dot.dataset.index = slideIndex;
        dot.dataset.dotType = "extra";
        dot.addEventListener("click", () => vpGoToSlide(slideIndex));
        document.getElementById("vpDots").appendChild(dot);

        /* Thumbnail ảnh xem thêm */
        const thumb = document.createElement("div");
        thumb.className = "variant-popup-thumb";
        thumb.dataset.index = slideIndex;
        thumb.dataset.thumbType = "extra";
        thumb.innerHTML = `<img src="${img}" alt="${label}" loading="lazy" decoding="async" />`;

        thumb.addEventListener("click", () => {
          vpGoToSlide(slideIndex);
        });

        document.getElementById("vpThumbs").appendChild(thumb);
      });

      vpSlides.style.width = "";
      vpSlides.querySelectorAll(".variant-popup-slide").forEach(s => {
        s.style.minWidth = "100%";
      });
    }

    function vpGoToSlide(idx) {
      /* Tổng số slides hiện tại = color + size */
      const totalNow = vpSlides.querySelectorAll(".variant-popup-slide").length;
      if (idx < 0 || idx >= totalNow) return;

      vpCurrentSlide = idx;
      vpSlides.style.transform = `translateX(-${idx * 100}%)`;

      /* Highlight dot đang active */
      document.querySelectorAll("#vpDots .variant-popup-dot").forEach((d) => {
        d.classList.toggle("active", parseInt(d.dataset.index) === idx);
      });

      /* Highlight thumbnail đang active, bao gồm cả thumb màu và thumb size */
      document.querySelectorAll("#vpThumbs .variant-popup-thumb").forEach((t) => {
        t.classList.toggle("active", parseInt(t.dataset.index) === idx);
      });

      /* Chỉ active nút màu khi slide hiện tại là ảnh màu */
      const colorIdx = idx < vpColorCount ? idx : -1;

      if (colorIdx >= 0) {
        vpColorBtns.forEach((b, i) => {
          b.classList.toggle("active", i === colorIdx);
        });
      }

      /* Kéo thumbnail active vào giữa */
      const at = document.querySelector(`#vpThumbs .variant-popup-thumb[data-index="${idx}"]`);
      if (at) {
        at.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }

      if (colorIdx >= 0) {
        vpSelectedColorName = colorVariant.options[colorIdx].name;

        const at = document.querySelector(`#vpThumbs .variant-popup-thumb[data-index="${idx}"]`);
        if (at) at.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });

        vpUpdateSizeUI(vpSelectedColorName);
      }

      vpUpdateSelectedSummary();
    }

    vpDots.forEach(dot     => dot.addEventListener("click",   () => vpGoToSlide(parseInt(dot.dataset.index))));
    vpThumbs.forEach(thumb => thumb.addEventListener("click", () => {
      const idx = parseInt(thumb.dataset.index);
      vpGoToSlide(idx);
    }));
    vpColorBtns.forEach(btn => btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index);
      vpGoToSlide(idx);
    }));

    /* Size buttons */
    document.querySelectorAll(".vp-other-option[data-type='size']").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        document.querySelectorAll(".vp-other-option[data-type='size']").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        vpUpdateSelectedSummary();
      });
    });

    /* Các other-option không phải size */
    document.querySelectorAll(".vp-other-option:not([data-type='size'])").forEach(btn => {
      btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        document.querySelectorAll(`.vp-other-option[data-type="${type}"]`).forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      });
    });

    /* Swipe */
    let vpSX = 0, vpMX = 0, vpDrag = false, vpHz = null;
    const vpSlider = document.getElementById("vpSlider");
    vpSlider.addEventListener("touchstart", e => { vpSX = vpMX = e.touches[0].clientX; vpDrag = true; vpHz = null; }, { passive: true });
    vpSlider.addEventListener("touchmove",  e => {
      if (!vpDrag) return; vpMX = e.touches[0].clientX;
      const dX = Math.abs(vpMX - vpSX), dY = Math.abs(e.touches[0].clientY - vpSX);
      if (vpHz === null && (dX > 5 || dY > 5)) vpHz = dX >= dY;
      if (vpHz) e.preventDefault();
    }, { passive: false });
    vpSlider.addEventListener("touchend", () => {
      if (!vpDrag) return;
      if (vpHz) {
        const diff = vpSX - vpMX;
        const totalNow = vpSlides.querySelectorAll(".variant-popup-slide").length;
        if (diff > 50 && vpCurrentSlide < totalNow - 1) vpGoToSlide(vpCurrentSlide + 1);
        else if (diff < -50 && vpCurrentSlide > 0)      vpGoToSlide(vpCurrentSlide - 1);
      }
      vpDrag = false; vpHz = null;
    });

    function openVariantPopup()  { vpOverlay.classList.add("show");    document.body.style.overflow = "hidden"; }
    function closeVariantPopup() { vpOverlay.classList.remove("show"); document.body.style.overflow = "auto"; }
    vpCloseBtn.addEventListener("click", closeVariantPopup);
    vpOverlay.addEventListener("click", e => { if (e.target === vpOverlay) closeVariantPopup(); });

    window.__variantPopup = {
      open: openVariantPopup,
      close: closeVariantPopup,
      getSelectedVariants: function () {
        const result = {};
        const ac = document.querySelector(".vp-color-option.active");
        if (ac) result["color"] = ac.dataset.value;
        document.querySelectorAll(".variant-popup-section").forEach(sec => {
          const ao = sec.querySelector(".vp-other-option.active");
          if (ao) result[ao.dataset.type] = ao.dataset.value;
        });
        return result;
      },
      hasColorVariant: true
    };

    console.log("sizeVariant:", sizeVariant);
    console.log("colorVariant.options[0].name:", colorVariant.options[0].name);
    vpBuildExtraGallerySlides();
    vpUpdateSizeUI(colorVariant.options[0].name);

  } else {
    window.__variantPopup = { hasColorVariant: false };
  }

})();
