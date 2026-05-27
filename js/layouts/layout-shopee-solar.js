(function renderShopeeSolarLayout() {
  const P = PRODUCT_CONFIG;
  const root = document.getElementById("layoutRoot");

  const formatPrice = n => Number(n || 0).toLocaleString("vi-VN") + "đ";
  const discountPercent = Math.round((1 - P.price / P.oldPrice) * 100);

  const comboHtml = P.combos.map((c, index) => {
    const total = c.price + (c.shipFee || 0);
    return `
      <button
        type="button"
        class="solar-combo-card combo-option ${index === 0 ? "active" : ""}"
        data-combo-card
        data-index="${index}"
        data-price="${c.price}"
        data-shipfee="${c.shipFee || 0}"
      >
        <span class="combo-name">${c.name}</span>
        <span class="combo-price">${formatPrice(c.price)}</span>
        <span class="combo-ship">${c.shipFee ? "Ship " + formatPrice(c.shipFee) : "Miễn phí vận chuyển"}</span>
        <span class="combo-total">Tổng COD: ${formatPrice(total)}</span>
        <span class="combo-note">${c.note || ""}</span>
      </button>
    `;
  }).join("");

  root.innerHTML = `
    <main class="solar-page">
      <section class="solar-product-card">
        <div class="solar-gallery">
          <div id="slider" class="solar-slider">
            <div id="slides" class="solar-slides"></div>
          </div>
          <div id="dots" class="solar-dots"></div>
          <div id="thumbs" class="solar-thumbs"></div>
        </div>

        <div class="solar-info">
          <div class="solar-shop-row">
            <span class="solar-badge">Yêu thích</span>
            <span>Đèn năng lượng mặt trời</span>
          </div>

          <h1>${P.shortName}</h1>

          <div class="solar-rating-row">
            <span>★★★★★</span>
            <strong>5.0</strong>
            <span>|</span>
            <span>Đã bán 1.2k</span>
          </div>

          <div class="solar-price-box">
            <div>
              <span class="price">${formatPrice(P.price)}</span>
              <span class="old-price">${formatPrice(P.oldPrice)}</span>
              <span class="badge-discount">-${discountPercent}%</span>
            </div>
            <p>Giá chưa bao gồm phí vận chuyển theo combo</p>
          </div>

          <div class="solar-section">
            <div class="solar-section-title">Chọn combo</div>
            <div class="solar-combo-list">
              ${comboHtml}
            </div>
          </div>

          <div class="solar-total-box">
            <div>
              <span>Tiền hàng</span>
              <strong id="solarSubtotal">${formatPrice(P.combos[0].price)}</strong>
            </div>
            <div>
              <span>Phí vận chuyển</span>
              <strong id="solarShip">${formatPrice(P.combos[0].shipFee)}</strong>
            </div>
            <div class="solar-total-final">
              <span>Tổng thanh toán khi nhận hàng</span>
              <strong id="solarGrandTotal">${formatPrice(P.combos[0].price + P.combos[0].shipFee)}</strong>
            </div>
          </div>

          <div class="solar-section">
            <div class="solar-section-title">Số lượng</div>
            <div class="qty-box">
              <button id="minusQty" type="button">−</button>
              <input id="quantity" value="1" inputmode="numeric" />
              <button id="plusQty" type="button">+</button>
            </div>
          </div>

          <div class="solar-actions">
            <button id="inlineAddToCartBtn" type="button" class="solar-btn outline">Thêm vào giỏ</button>
            <button id="inlineBuyNowBtn" type="button" class="solar-btn primary">Mua ngay</button>
          </div>
        </div>
      </section>

      <section class="solar-detail-card">
        <h2>Mô tả sản phẩm</h2>
        <p>Nội dung mô tả chi tiết sẽ bổ sung sau.</p>
      </section>

      <section class="solar-detail-card">
        <h2>Đánh giá sản phẩm</h2>
        <div id="reviewList">
          <div class="solar-empty-review">Nội dung đánh giá sẽ bổ sung sau.</div>
        </div>
      </section>

      <div class="solar-bottom-bar">
        <button id="goToCartBtn" type="button" class="solar-cart-btn">
          Giỏ hàng <span id="cartBadge"></span>
        </button>
        <button id="buyNowBtn" type="button" class="solar-buy-btn">Mua ngay</button>
      </div>

      <div id="solarComboPopup" class="solar-popup-overlay">
        <div class="solar-popup">
          <button type="button" id="solarComboClose" class="solar-popup-close">×</button>
          <h3>Chọn combo</h3>

          <div class="solar-combo-list popup-combo-list">
            ${comboHtml}
          </div>

          <div class="solar-popup-actions">
            <button id="cpAddToCartBtn" type="button" class="solar-btn outline">
              Thêm vào giỏ
            </button>
            <button id="cpGoToCartBtn" type="button" class="solar-btn outline">
              Đến giỏ hàng <span id="cpCartBadge"></span>
            </button>
            <button id="cpBuyNowBtn" type="button" class="solar-btn primary">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </main>
  `;

  function updateSolarTotal() {
    const active = document.querySelector(".combo-option.active");
    if (!active) return;

    const price = Number(active.dataset.price || 0);
    const ship = Number(active.dataset.shipfee || 0);

    const subtotal = document.getElementById("solarSubtotal");
    const shipEl = document.getElementById("solarShip");
    const grand = document.getElementById("solarGrandTotal");

    if (subtotal) subtotal.textContent = formatPrice(price);
    if (shipEl) shipEl.textContent = ship > 0 ? formatPrice(ship) : "0đ";
    if (grand) grand.textContent = formatPrice(price + ship);

    document.querySelectorAll(".price").forEach(el => {
      el.textContent = formatPrice(price);
    });
  }

  function syncCombo(index) {
    document.querySelectorAll(".combo-option").forEach(btn => {
      btn.classList.toggle("active", Number(btn.dataset.index) === Number(index));
    });
    updateSolarTotal();
  }

  document.querySelectorAll("[data-combo-card]").forEach(btn => {
    btn.addEventListener("click", () => {
      syncCombo(btn.dataset.index);
    });
  });

  const comboPopup = document.getElementById("solarComboPopup");
  const closeBtn = document.getElementById("solarComboClose");

  window.__comboPopup = {
    open() {
      comboPopup.classList.add("show");
      document.body.style.overflow = "hidden";
    },
    close() {
      comboPopup.classList.remove("show");
      document.body.style.overflow = "auto";
    }
  };

  closeBtn.addEventListener("click", () => window.__comboPopup.close());

  comboPopup.addEventListener("click", e => {
    if (e.target === comboPopup) window.__comboPopup.close();
  });

  updateSolarTotal();
})();