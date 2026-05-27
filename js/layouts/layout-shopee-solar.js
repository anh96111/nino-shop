(function renderShopeeSolarLayout() {
  const P = PRODUCT_CONFIG;
  const root = document.getElementById("layoutRoot");
  if (!root) return;

  const formatPrice = n => Number(n || 0).toLocaleString("vi-VN") + "đ";
  const discountPercent = Math.round((1 - Number(P.price || 0) / Number(P.oldPrice || 1)) * 100);

  const images = Array.isArray(P.images) && P.images.length ? P.images : [];
  const combos = Array.isArray(P.combos) ? P.combos : [];
  const sliderTags = Array.isArray(P.sliderTags) && P.sliderTags.length
    ? P.sliderTags
    : [
        "Công suất<br>40W",
        "Sử dụng liên tục<br>8h",
        "Bảo hành 1 đổi 1<br>trong 6 tháng"
      ];

  let selectedComboIndex = null;

  const slidesHtml = images.length
    ? images.map((src, index) => `
        <div class="slide">
          <img src="${src}" alt="${P.shortName || P.name || "Sản phẩm"} ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}">
        </div>
      `).join("")
    : `
        <div class="slide slide-placeholder">Ảnh sản phẩm 1</div>
        <div class="slide slide-placeholder">Ảnh sản phẩm 2</div>
        <div class="slide slide-placeholder">Ảnh sản phẩm 3</div>
      `;

  const dotsHtml = (images.length ? images : [1, 2, 3]).map((_, index) => `
    <span class="dot ${index === 0 ? "active" : ""}" data-dot="${index}"></span>
  `).join("");

  const comboHtml = combos.map((c, index) => {
    const tagClass = c.tagType === "save" ? "tag-save" : "tag-hot";
    const shipText = Number(c.shipFee || 0) > 0
      ? "Phí vận chuyển: " + formatPrice(c.shipFee)
      : "Miễn phí vận chuyển";

    return `
      <label class="combo-card" data-combo-card data-index="${index}">
        ${c.tag ? `<span class="combo-tag ${tagClass}">${c.tag}</span>` : ""}
        <input type="radio" name="solarCombo" value="${index}">
        <div class="combo-content">
          <div>
            <div class="combo-name">${c.name || ""}</div>
            <div class="combo-desc">${c.note || ""}</div>
            <div class="combo-ship">${shipText}</div>
          </div>
          <div class="combo-price">${Math.round(Number(c.price || 0) / 1000)}K</div>
        </div>
      </label>
    `;
  }).join("");

  root.innerHTML = `
    <main class="solar-page">
      <section class="solar-hero">
        <div class="solar-brand">
          <div class="solar-brand-nino">Nino</div>
          <div class="solar-brand-vn">Viet Nam</div>
        </div>
        <p class="solar-hero-desc">Đèn năng lượng mặt trời siêu bền.</p>
      </section>

      <section class="solar-product-wrap">
        <div class="solar-gallery">
          <div class="solar-slider">
            <div class="solar-slides" id="solarSlides">
              ${slidesHtml}
            </div>

            <div class="solar-slider-tags">
              ${sliderTags.map(tag => `<div class="solar-slider-tag">${tag}</div>`).join("")}
            </div>
          </div>

          <div class="solar-dots">
            ${dotsHtml}
          </div>
        </div>

        <div class="solar-info">
          <div class="solar-shop-row">
            <span class="solar-fav-badge">Yêu thích</span>
            <span>${P.category || "Đèn năng lượng mặt trời"}</span>
          </div>

          <h1>${P.name || P.shortName || "Đèn Năng Lượng Mặt Trời 40W"}</h1>

          <div class="solar-rating-row">
            <span>★★★★★</span>
            <strong>5.0</strong>
            <span>|</span>
            <span class="solar-sold">Đã bán ${P.soldText || "112.5k"}</span>
          </div>

          <div class="solar-price-box">
            <div class="solar-price-line">
              <span class="solar-price">${formatPrice(P.price)}</span>
              <span class="solar-old-price">${formatPrice(P.oldPrice)}</span>
              <span class="solar-discount">-${discountPercent}%</span>
            </div>
            <p class="solar-price-note">Giá lẻ 1 chiếc, chọn combo để nhận ưu đãi tốt hơn.</p>
          </div>

          <div class="solar-combo-area">
            <div class="solar-section-head">
              <div class="solar-section-title">Chọn combo ưu đãi</div>
              <div class="solar-section-hint" id="solarComboHint">Chưa chọn</div>
            </div>

            <div class="solar-combo-list">
              ${comboHtml}
            </div>

            <div class="solar-notice" id="solarNotice">
              Vui lòng chọn combo trước khi đặt hàng.
            </div>
          </div>

          <div class="solar-content-area">
            <div class="solar-soft-line"></div>

            <div class="solar-content-block">
              <h2>Mô tả sản phẩm</h2>
              <p>Nội dung mô tả chi tiết sẽ bổ sung sau.</p>
            </div>

            <div class="solar-soft-line"></div>

            <div class="solar-content-block">
              <h2>Đánh giá sản phẩm</h2>
              <p>Nội dung đánh giá sẽ bổ sung sau.</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <div class="solar-bottom-bar">
      <button class="solar-bottom-cart" id="solarAddCart">Giỏ hàng</button>
      <button class="solar-bottom-buy" id="solarBuyNow">Mua ngay</button>
    </div>
  `;

  function setSelectedCombo(index) {
    selectedComboIndex = Number(index);

    document.querySelectorAll("[data-combo-card]").forEach(card => {
      const isActive = Number(card.dataset.index) === selectedComboIndex;
      card.classList.toggle("active", isActive);
      const input = card.querySelector("input");
      if (input) input.checked = isActive;
    });

    const combo = combos[selectedComboIndex];
    const hint = document.getElementById("solarComboHint");
    const notice = document.getElementById("solarNotice");

    if (hint && combo) hint.textContent = combo.name;
    if (notice) notice.textContent = "Đã chọn: " + (combo?.name || "");
  }

  function requireCombo() {
    if (selectedComboIndex === null) {
      const notice = document.getElementById("solarNotice");
      if (notice) {
        notice.textContent = "Vui lòng chọn combo trước khi đặt hàng.";
        notice.classList.add("shake");
        setTimeout(() => notice.classList.remove("shake"), 350);
      }
      return null;
    }

    return combos[selectedComboIndex];
  }

  function applyComboToProduct(combo) {
    if (!combo) return;

    window.__selectedSolarCombo = {
      name: combo.name,
      price: Number(combo.price || 0),
      oldPrice: Number(combo.oldPrice || 0),
      shipFee: Number(combo.shipFee || 0),
      note: combo.note || ""
    };

    P.selectedCombo = window.__selectedSolarCombo;
    P.price = Number(combo.price || P.price || 0);
    P.oldPrice = Number(combo.oldPrice || P.oldPrice || 0);
    P.shipFee = Number(combo.shipFee || 0);
  }

  function openCheckout() {
    const combo = requireCombo();
    if (!combo) return;

    applyComboToProduct(combo);

    if (typeof window.openVariantPopup === "function") {
      window.openVariantPopup();
      return;
    }

    if (typeof window.openCheckoutPopup === "function") {
      window.openCheckoutPopup();
      return;
    }

    document.dispatchEvent(new CustomEvent("nino:buy-now", {
      detail: {
        product: P,
        combo: window.__selectedSolarCombo
      }
    }));
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
    }, { passive: true });
  }

  const buyBtn = document.getElementById("solarBuyNow");
  const cartBtn = document.getElementById("solarAddCart");

  if (buyBtn) buyBtn.addEventListener("click", openCheckout);
  if (cartBtn) cartBtn.addEventListener("click", openCheckout);
})();