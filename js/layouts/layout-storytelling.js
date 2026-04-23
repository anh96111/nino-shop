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

  root.innerHTML = `

    <!-- ============ P1 — HERO: Gallery + Tên SP ============ -->
    <section class="gallery-wrap">
      <div class="slider" id="slider">
        <div class="slides" id="slides"></div>
        <div class="dots" id="dots"></div>
      </div>
      <div class="thumbs" id="thumbs"></div>
    </section>

    <section class="section hero-section">
      <h1 class="product-title">${P.shortName}</h1>
      <div class="product-sub">${P.subHeading}</div>
    </section>

    <!-- ============ P2 — HOOK ============ -->
    <section class="section hook-section">
      <div class="hook-title">${P.hooks.length} lý do bạn nên chọn sản phẩm này</div>
      <div class="hook-list">
        ${P.hooks.map(h => `
          <div class="hook-item">
            <span class="hook-icon">${h.icon}</span>
            <span class="hook-text">${h.text}</span>
          </div>
        `).join("")}
      </div>
    </section>

    <!-- ============ P3 — BENEFITS (chứng minh công dụng) ============ -->
    <section class="section benefits-section">
      ${P.benefits.map((b, i) => `
        <div class="benefit-block ${i % 2 === 0 ? "img-left" : "img-right"}">
          <div class="benefit-img">
            <img src="${b.image}" alt="${b.title}" loading="lazy" decoding="async" width="600" height="600" />
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

      <div class="price-row">
        <span class="price">${Number(P.price).toLocaleString("vi-VN")}đ</span>
        <span class="old-price">${Number(P.oldPrice).toLocaleString("vi-VN")}đ</span>
        <span class="badge-discount">${P.discount}</span>
      </div>

      <div class="sold-tag">Đã bán ${P.soldCount}</div>

      <!-- VARIANTS -->
      ${P.variants.length ? `
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
      <div class="ship-bar">🚚 Miễn phí vận chuyển &amp; hoàn trả toàn quốc khi mua trong hôm nay</div>

      <!-- RETURN POLICY -->
      <div class="return-policy-bar">
        <span class="return-policy-icon">🛡️</span>
        <span class="return-policy-text">${P.returnPolicy.content}</span>
      </div>

      <!-- SALE COUNTDOWN -->
      <div class="sale-bar">
        <span>🔥 Ưu đãi hôm nay</span>
        <span>Kết thúc sau <strong id="countdown">15:00</strong></span>
      </div>

      <!-- QTY + CTA -->
      <div class="section-label">Số lượng</div>
      <div class="qty-wrap">
        <button class="qty-btn" id="minusQty">−</button>
        <input class="qty-input" type="number" id="quantity" value="1" min="1" />
        <button class="qty-btn" id="plusQty">+</button>
      </div>
      <div class="cta-row">
        <button class="btn-ghost" id="inlineAddToCartBtn">Thêm vào giỏ</button>
        <button class="btn-solid" id="inlineBuyNowBtn">Mua ngay</button>
      </div>
    </section>

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

  /* ── REVIEW SUMMARY (render riêng vì cần logic bars) ── */
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
      
      // Đóng tất cả
      document.querySelectorAll(".faq-head").forEach(h => h.classList.remove("active"));
      document.querySelectorAll(".faq-body").forEach(b => b.classList.remove("show"));

      // Mở cái được click (nếu đang đóng)
      if (!isOpen) {
        head.classList.add("active");
        body.classList.add("show");
      }
    });
  });

  /* ── VARIANT SELECTOR ── */
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

})();
