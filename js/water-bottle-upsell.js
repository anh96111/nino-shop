(function () {
  const WATER_BOTTLE_PRICE = 59000;
  const WATER_BOTTLE_NAME = "Bình nước 750ml";

  const bottleColors = [
    {
      name: "Cam",
      image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_800,f_webp,q_auto/v1779737738/c_sbsl7s.jpg"
    },
    {
      name: "Tím",
      image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_800,f_webp,q_auto/v1779737738/t_szzdgb.jpg"
    },
    {
      name: "Xanh",
      image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_800,f_webp,q_auto/v1779737738/xx_yzjz4q.jpg"
    },
    {
      name: "Xanh ngọc",
      image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_800,f_webp,q_auto/v1779737738/x_bptn9n.jpg"
    }
  ];

  let state = {
    gasUrl: "",
    orderId: "",
    sheetName: "",
    basePayload: null,
    customer: null,
    items: [],
    orderTotal: 0,
    upsellItems: [],
    isSubmitting: false
  };

  function formatMoney(value) {
    return Number(value || 0).toLocaleString("vi-VN") + "đ";
  }

  function getColorData(colorName) {
    return bottleColors.find(c => c.name === colorName) || bottleColors[0];
  }

  function getTotalQty() {
    return state.upsellItems.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  }

  function getUpsellTotal() {
    return getTotalQty() * WATER_BOTTLE_PRICE;
  }

  function injectStyle() {
    if (document.getElementById("nino-water-upsell-style")) return;

    const style = document.createElement("style");
    style.id = "nino-water-upsell-style";
    style.textContent = `
      .nino-water-overlay {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(0,0,0,.58);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px;
      }

      .nino-water-modal {
        position: relative;
        width: 100%;
        max-width: 465px;
        max-height: 92vh;
        overflow-y: auto;
        background: #fff;
        border-radius: 20px;
        padding: 22px 22px 24px;
        box-shadow: 0 18px 45px rgba(0,0,0,.22);
        font-family: Arial, sans-serif;
      }

      .nino-water-close {
        position: absolute;
        top: 14px;
        right: 18px;
        border: none;
        background: transparent;
        font-size: 28px;
        line-height: 1;
        color: #697386;
        cursor: pointer;
        padding: 0;
      }

      .nino-water-success {
        width: fit-content;
        margin: 0 auto 16px;
        padding: 10px 22px;
        border-radius: 999px;
        background: #e8faef;
        color: #05802f;
        font-size: 19px;
        font-weight: 900;
        box-shadow: 0 4px 12px rgba(5, 128, 47, 0.12);
      }

      .nino-water-title {
        margin: 0 30px 12px;
        text-align: center;
        font-size: 22px;
        line-height: 1.2;
        font-weight: 900;
        color: #111;
        white-space: nowrap;
      }

      .nino-water-desc {
        margin: 0 auto 16px;
        max-width: 390px;
        background: #fff7ed;
        border: 1px solid #fed7aa;
        color: #ea580c;
        border-radius: 14px;
        padding: 11px 13px;
        text-align: center;
        font-size: 15px;
        line-height: 1.45;
        font-weight: 800;
      }

      .nino-water-single-slider {
        width: 100%;
        aspect-ratio: 1 / .74;
        background: #f6f6f6;
        border: 1px solid #eee;
        border-radius: 18px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
        cursor: zoom-in;
      }

      .nino-water-single-slider img,
      .nino-water-line-img img,
      .nino-water-thumb img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      .nino-water-single-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
      }

      .nino-water-product-name {
        margin: 0 0 6px;
        font-size: 18px;
        font-weight: 900;
        color: #111;
      }

      .nino-water-price {
        display: flex;
        align-items: baseline;
        gap: 9px;
        white-space: nowrap;
      }

      .nino-water-old-price {
        color: #9b9b9b;
        text-decoration: line-through;
        font-size: 15px;
      }

      .nino-water-new-price {
        color: #f04438;
        font-size: 22px;
        font-weight: 900;
      }

      .nino-water-color-btn {
        border: 1px solid #fed7aa;
        background: #fff7ed;
        color: #ea580c;
        border-radius: 999px;
        padding: 9px 14px;
        font-size: 14px;
        font-weight: 800;
        cursor: pointer;
        white-space: nowrap;
      }

      .nino-water-color-panel {
        display: none;
        gap: 10px;
        overflow-x: auto;
        padding: 10px 2px 2px;
        margin-bottom: 10px;
      }

      .nino-water-color-panel.show {
        display: flex;
      }

      .nino-water-thumb {
        flex: 0 0 auto;
        width: 58px;
        height: 58px;
        border-radius: 14px;
        border: 2px solid transparent;
        background: #f5f5f5;
        padding: 4px;
        cursor: pointer;
      }

      .nino-water-thumb.active {
        border-color: #f97316;
        background: #fff7ed;
      }

      .nino-water-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-bottom: 14px;
      }

      .nino-water-line {
        background: #f7f7f7;
        border-radius: 16px;
        padding: 12px;
        border: 1px solid #eee;
      }

      .nino-water-line-top {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .nino-water-line-img {
        flex: 0 0 78px;
        width: 78px;
        height: 78px;
        border-radius: 14px;
        background: #fff;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: zoom-in;
      }

      .nino-water-line-main {
        flex: 1;
        min-width: 0;
      }

      .nino-water-line-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 8px;
        margin-bottom: 5px;
      }

      .nino-water-line-title {
        margin: 0;
        font-size: 15.5px;
        font-weight: 900;
        color: #111;
        line-height: 1.3;
      }

      .nino-water-remove {
        border: none;
        background: #fee2e2;
        color: #dc2626;
        border-radius: 999px;
        padding: 5px 9px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        white-space: nowrap;
      }

      .nino-water-line-color {
        margin: 0 0 8px;
        font-size: 13.5px;
        color: #666;
      }

      .nino-water-line-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .nino-water-qty {
        display: flex;
        align-items: center;
        border: 1px solid #e5e7eb;
        border-radius: 999px;
        background: #fff;
        overflow: hidden;
      }

      .nino-water-qty button {
        width: 32px;
        height: 32px;
        border: none;
        background: #fff;
        font-size: 20px;
        font-weight: 800;
        cursor: pointer;
        color: #111;
      }

      .nino-water-qty span {
        min-width: 28px;
        text-align: center;
        font-size: 15px;
        font-weight: 900;
        color: #111;
      }

      .nino-water-error {
        display: none;
        margin: 0 0 12px;
        padding: 9px 12px;
        border-radius: 10px;
        background: #fff1f2;
        color: #e11d48;
        font-size: 13.5px;
        font-weight: 800;
        text-align: center;
      }

      .nino-water-error.show {
        display: block;
      }

      .nino-water-note {
        margin: 0 0 14px;
        padding: 11px 14px;
        border-radius: 12px;
        background: #fff3da;
        color: #9b6100;
        text-align: center;
        font-size: 14px;
        line-height: 1.35;
      }

      .nino-water-add {
        width: 100%;
        border: none;
        border-radius: 14px;
        background: #ff4b22;
        color: #fff;
        font-size: 18px;
        font-weight: 900;
        padding: 16px 14px;
        cursor: pointer;
        box-shadow: 0 8px 18px rgba(255,75,34,.22);
      }

      .nino-water-add:disabled {
        opacity: .65;
        cursor: not-allowed;
      }

      .nino-water-skip {
        display: block;
        width: 100%;
        margin: 12px auto 0;
        border: 1px solid #d1d5db;
        border-radius: 12px;
        background: #ffffff;
        color: #374151;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        padding: 12px 14px;
      }

      .nino-water-image-viewer {
        position: fixed;
        inset: 0;
        z-index: 100000;
        background: rgba(0,0,0,.78);
        display: none;
        align-items: center;
        justify-content: center;
        padding: 18px;
      }

      .nino-water-image-viewer.show {
        display: flex;
      }

      .nino-water-image-box {
        position: relative;
        width: 100%;
        max-width: 560px;
        background: #fff;
        border-radius: 18px;
        padding: 16px;
      }

      .nino-water-image-box img {
        width: 100%;
        max-height: 78vh;
        object-fit: contain;
        display: block;
      }

      .nino-water-image-close {
        position: absolute;
        top: -12px;
        right: -12px;
        width: 36px;
        height: 36px;
        border-radius: 999px;
        border: none;
        background: #fff;
        color: #111;
        font-size: 24px;
        font-weight: 900;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,.2);
      }

      .nino-thank-overlay {
        position: fixed;
        inset: 0;
        z-index: 100001;
        background: rgba(0,0,0,.58);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px;
        font-family: Arial, sans-serif;
      }

      .nino-thank-modal {
        width: 100%;
        max-width: 465px;
        max-height: 92vh;
        overflow-y: auto;
        background: #ffffff;
        border-radius: 20px;
        padding: 22px;
        box-shadow: 0 18px 45px rgba(0,0,0,.22);
      }

      .nino-thank-icon {
        text-align: center;
        font-size: 42px;
        margin-bottom: 8px;
      }

      .nino-thank-title {
        text-align: center;
        font-size: 22px;
        font-weight: 900;
        color: #111111;
        margin-bottom: 8px;
      }

      .nino-thank-sub {
        text-align: center;
        font-size: 14px;
        line-height: 1.45;
        color: #555555;
        margin-bottom: 14px;
      }

      .nino-thank-box {
        background: #f9fafb;
        border: 1px solid #eeeeee;
        border-radius: 14px;
        padding: 13px;
        margin-bottom: 12px;
      }

      .nino-thank-section-title {
        font-size: 14px;
        font-weight: 900;
        color: #111111;
        margin-bottom: 10px;
      }

      .nino-thank-customer-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 13.5px;
        margin-bottom: 7px;
      }

      .nino-thank-customer-row span {
        color: #666666;
      }

      .nino-thank-customer-row strong {
        color: #111111;
        text-align: right;
      }

      .nino-thank-address {
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed #dddddd;
        font-size: 13.5px;
        line-height: 1.45;
        color: #374151;
      }

      .nino-thank-item {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 0;
        border-bottom: 1px solid #eeeeee;
      }

      .nino-thank-item:last-child {
        border-bottom: none;
      }

      .nino-thank-item.upsell {
        background: #fff7ed;
        border: 1px solid #fed7aa;
        border-radius: 12px;
        padding: 10px;
        margin-bottom: 8px;
      }

      .nino-thank-item-main {
        flex: 1;
        min-width: 0;
      }

      .nino-thank-item-name {
        font-size: 13.5px;
        font-weight: 800;
        color: #111111;
        line-height: 1.35;
      }

      .nino-thank-item-meta {
        margin-top: 3px;
        font-size: 12px;
        color: #6b7280;
      }

      .nino-thank-item-side {
        flex-shrink: 0;
        text-align: right;
        font-size: 12.5px;
        color: #666666;
      }

      .nino-thank-item-side strong {
        display: block;
        margin-top: 3px;
        color: #ef4444;
        font-size: 13.5px;
      }

      .nino-thank-total-box {
        background: #fff7ed;
        border: 1px solid #fed7aa;
        border-radius: 14px;
        padding: 13px;
        margin-bottom: 14px;
      }

      .nino-thank-total-box > div {
        display: flex;
        justify-content: space-between;
        gap: 10px;
        font-size: 14px;
        margin-bottom: 8px;
      }

      .nino-thank-total-box > div:last-child {
        margin-bottom: 0;
      }

      .nino-thank-total-box span {
        color: #666666;
      }

      .nino-thank-total-box strong {
        color: #111111;
      }

      .nino-thank-total-box .final {
        border-top: 1px dashed #f59e0b;
        padding-top: 9px;
        margin-top: 9px;
        font-size: 16px;
        font-weight: 900;
      }

      .nino-thank-total-box .final strong {
        color: #ef4444;
        font-size: 18px;
      }

      .nino-thank-ship-note {
        margin: -2px 0 14px;
        text-align: center;
        font-size: 12.5px;
        line-height: 1.45;
        color: #6b7280;
      }

      .nino-thank-close {
        width: 100%;
        border: none;
        border-radius: 14px;
        background: #16a34a;
        color: #ffffff;
        font-size: 17px;
        font-weight: 900;
        padding: 15px 14px;
        cursor: pointer;
      }

      @media (max-width: 420px) {
        .nino-water-modal {
          border-radius: 18px;
          padding: 20px 16px 22px;
        }

        .nino-water-title {
          font-size: 19px;
          margin-left: 24px;
          margin-right: 24px;
        }

        .nino-water-desc {
          font-size: 14px;
        }

        .nino-water-product-name {
          font-size: 16px;
        }

        .nino-water-new-price {
          font-size: 20px;
        }

        .nino-water-add {
          font-size: 16px;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function initUpsellItems(items) {
    const safeItems = Array.isArray(items) && items.length ? items : [{}];

    return safeItems.map((item, index) => ({
      id: index + 1,
      bagName: item.product_name || item.name || "Balo chống gù",
      color: "Cam",
      qty: 1,
      colorPanelOpen: false
    }));
  }

  function buildColorPanel(item) {
    return `
      <div class="nino-water-color-panel ${item.colorPanelOpen ? "show" : ""}">
        ${bottleColors.map(color => `
          <button
            type="button"
            class="nino-water-thumb ${item.color === color.name ? "active" : ""}"
            data-action="select-color"
            data-id="${item.id}"
            data-color="${color.name}"
            title="${color.name}"
          >
            <img src="${color.image}" alt="${color.name}">
          </button>
        `).join("")}
      </div>
    `;
  }

  function renderSingle() {
    const item = state.upsellItems[0];
    const color = getColorData(item.color);

    return `
      <div>
        <div class="nino-water-single-slider" data-action="view-image" data-image="${color.image}">
          <img src="${color.image}" alt="Bình nước màu ${item.color}">
        </div>

        <div class="nino-water-single-info">
          <div>
            <h3 class="nino-water-product-name">Bình nước màu ${item.color}</h3>
            <div class="nino-water-price">
              <span class="nino-water-old-price">99.000đ</span>
              <span class="nino-water-new-price">59.000đ</span>
            </div>
          </div>

          <button class="nino-water-color-btn" type="button" data-action="toggle-color" data-id="${item.id}">
            Chọn màu khác
          </button>
        </div>

        ${buildColorPanel(item)}
      </div>
    `;
  }

  function renderMulti() {
    return `
      <div class="nino-water-list">
        ${state.upsellItems.map(item => {
          const color = getColorData(item.color);

          return `
            <div class="nino-water-line">
              <div class="nino-water-line-top">
                <div class="nino-water-line-img" data-action="view-image" data-image="${color.image}">
                  <img src="${color.image}" alt="Bình nước màu ${item.color}">
                </div>

                <div class="nino-water-line-main">
                  <div class="nino-water-line-head">
                    <h3 class="nino-water-line-title">${item.bagName}</h3>

                    <button class="nino-water-remove" type="button" data-action="remove-line" data-id="${item.id}">
                      Xóa
                    </button>
                  </div>

                  <p class="nino-water-line-color">Bình nước màu ${item.color}</p>

                  <div class="nino-water-line-actions">
                    <button class="nino-water-color-btn" type="button" data-action="toggle-color" data-id="${item.id}">
                      Chọn màu khác
                    </button>

                    <div class="nino-water-qty">
                      <button type="button" data-action="change-qty" data-id="${item.id}" data-delta="-1">−</button>
                      <span>${item.qty}</span>
                      <button type="button" data-action="change-qty" data-id="${item.id}" data-delta="1">+</button>
                    </div>
                  </div>
                </div>
              </div>

              ${buildColorPanel(item)}
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function render() {
    const content = document.getElementById("ninoWaterContent");
    const addBtn = document.getElementById("ninoWaterAddBtn");

    if (!content || !addBtn) return;

    content.innerHTML = state.upsellItems.length === 1 ? renderSingle() : renderMulti();
    addBtn.textContent = "Thêm vào đơn vừa đặt +" + formatMoney(getUpsellTotal());
  }

  function showError(message) {
    const errorBox = document.getElementById("ninoWaterError");
    if (!errorBox) return;

    errorBox.textContent = message || "Cần chọn ít nhất 1 bình nước.";
    errorBox.classList.add("show");

    setTimeout(() => {
      errorBox.classList.remove("show");
    }, 1800);
  }

  function closePopup() {
    const overlay = document.getElementById("ninoWaterOverlay");
    if (overlay) overlay.remove();
  }

  function buildOrderItemsHtml(items) {
    const safeItems = Array.isArray(items) ? items : [];

    if (!safeItems.length) {
      return `<div class="nino-thank-empty">Không có sản phẩm.</div>`;
    }

    return safeItems.map(item => {
      const name = item.product_name || item.name || "Sản phẩm";
      const color = item.color ? `Màu: ${item.color}` : "";
      const size = item.size ? `Size: ${item.size}` : "";
      const qty = Number(item.quantity || item.qty || 1);
      const price = Number(item.price || 0);

      return `
        <div class="nino-thank-item">
          <div class="nino-thank-item-main">
            <div class="nino-thank-item-name">${name}</div>
            <div class="nino-thank-item-meta">${[color, size].filter(Boolean).join(" • ")}</div>
          </div>
          <div class="nino-thank-item-side">
            <div>SL: ${qty}</div>
            <strong>${formatMoney(price * qty)}</strong>
          </div>
        </div>
      `;
    }).join("");
  }

  function buildUpsellItemsHtml(upsellItems) {
    const safeItems = Array.isArray(upsellItems) ? upsellItems : [];

    if (!safeItems.length) return "";

    return `
      <div class="nino-thank-section-title">🥤 Bình nước đặt thêm</div>
      ${safeItems.map(item => {
        const qty = Number(item.quantity || 0);
        const price = Number(item.price || WATER_BOTTLE_PRICE);

        return `
          <div class="nino-thank-item upsell">
            <div class="nino-thank-item-main">
              <div class="nino-thank-item-name">${WATER_BOTTLE_NAME} màu ${item.color || ""}</div>
              <div class="nino-thank-item-meta">Gộp chung vào đơn vừa đặt</div>
            </div>
            <div class="nino-thank-item-side">
              <div>SL: ${qty}</div>
              <strong>${formatMoney(price * qty)}</strong>
            </div>
          </div>
        `;
      }).join("")}
    `;
  }

  function showOrderDetailThankModal(options) {
    const opts = options || {};
    const customer = state.customer || {};
    const originalTotal = Number(state.orderTotal || 0);
    const upsellItems = Array.isArray(opts.upsellItems) ? opts.upsellItems : [];
    const upsellTotal = Number(opts.upsellTotal || 0);
    const finalTotal = originalTotal + upsellTotal;

    const oldThank = document.getElementById("ninoOrderDetailThankOverlay");
    if (oldThank) oldThank.remove();

    const overlay = document.createElement("div");
    overlay.id = "ninoOrderDetailThankOverlay";
    overlay.className = "nino-thank-overlay";

    overlay.innerHTML = `
      <div class="nino-thank-modal">
        <div class="nino-thank-icon">✅</div>
        <div class="nino-thank-title">Cảm ơn bạn đã đặt hàng</div>
        <div class="nino-thank-sub">
          Shop đã ghi nhận đơn hàng. Vui lòng giữ điện thoại, shop sẽ liên hệ xác nhận.
        </div>

        <div class="nino-thank-box">
          <div class="nino-thank-section-title">📋 Thông tin nhận hàng</div>

          <div class="nino-thank-customer-row">
            <span>Người nhận</span>
            <strong>${customer.full_name || "—"}</strong>
          </div>

          <div class="nino-thank-customer-row">
            <span>Số điện thoại</span>
            <strong>${customer.phone || "—"}</strong>
          </div>

          <div class="nino-thank-address">
            ${customer.address || "—"}
          </div>
        </div>

        <div class="nino-thank-box">
          <div class="nino-thank-section-title">🛒 Sản phẩm đã đặt</div>
          ${buildOrderItemsHtml(state.items)}
          ${buildUpsellItemsHtml(upsellItems)}
        </div>

        <div class="nino-thank-total-box">
          <div>
            <span>Tổng đơn chính</span>
            <strong>${formatMoney(originalTotal)}</strong>
          </div>

          ${
            upsellTotal > 0
              ? `<div>
                  <span>Bình nước đặt thêm</span>
                  <strong>${formatMoney(upsellTotal)}</strong>
                </div>`
              : ""
          }

          <div class="final">
            <span>Tổng thanh toán khi nhận hàng</span>
            <strong>${formatMoney(finalTotal)}</strong>
          </div>
        </div>

        <div class="nino-thank-ship-note">
          Sau vài hôm bạn vui lòng chú ý điện thoại, Bạn ship sẽ liên hệ. Cảm ơn.
        </div>

        <button class="nino-thank-close" type="button" id="ninoOrderDetailThankClose">
          OK
        </button>
      </div>
    `;

    document.body.appendChild(overlay);

    document.getElementById("ninoOrderDetailThankClose").addEventListener("click", function () {
      overlay.remove();
    });
  }

  function openImageViewer(imageUrl) {
    const viewer = document.getElementById("ninoWaterImageViewer");
    const img = document.getElementById("ninoWaterImageView");

    if (!viewer || !img) return;

    img.src = imageUrl;
    viewer.classList.add("show");
  }

  function closeImageViewer() {
    const viewer = document.getElementById("ninoWaterImageViewer");
    if (viewer) viewer.classList.remove("show");
  }

  function toggleColor(itemId) {
    const item = state.upsellItems.find(i => i.id === itemId);
    if (!item) return;

    item.colorPanelOpen = !item.colorPanelOpen;
    render();
  }

  function selectColor(itemId, colorName) {
    const item = state.upsellItems.find(i => i.id === itemId);
    if (!item) return;

    item.color = colorName;
    item.colorPanelOpen = true;
    render();
  }

  function changeQty(itemId, delta) {
    const item = state.upsellItems.find(i => i.id === itemId);
    if (!item) return;

    const nextQty = item.qty + delta;

    if (nextQty < 0) return;

    if (getTotalQty() === 1 && item.qty === 1 && delta === -1) {
      showError("Cần chọn ít nhất 1 bình nước.");
      return;
    }

    item.qty = nextQty;
    render();
  }

  function removeLine(itemId) {
    const item = state.upsellItems.find(i => i.id === itemId);
    if (!item) return;

    if (getTotalQty() - item.qty < 1) {
      showError("Cần chọn ít nhất 1 bình nước.");
      return;
    }

    state.upsellItems = state.upsellItems.filter(i => i.id !== itemId);
    render();
  }

  function buildUpsellPayloadItems() {
    const result = [];

    state.upsellItems.forEach(item => {
      const qty = Number(item.qty || 0);
      if (qty <= 0) return;

      result.push({
        product_name: WATER_BOTTLE_NAME,
        color: item.color,
        quantity: qty,
        price: WATER_BOTTLE_PRICE
      });
    });

    return result;
  }

  function submitUpsell() {
    if (state.isSubmitting) return;

    const upsellItems = buildUpsellPayloadItems();

    if (!upsellItems.length) {
      showError("Cần chọn ít nhất 1 bình nước.");
      return;
    }

    state.isSubmitting = true;

    const addBtn = document.getElementById("ninoWaterAddBtn");
    if (addBtn) {
      addBtn.disabled = true;
      addBtn.textContent = "Đang thêm vào đơn...";
    }

    const payload = {
      event_type: "upsell_add",
      order_id: state.orderId,
      sheet_name: state.sheetName,
      customer: state.customer || {},
      original_items: state.items || [],
      upsell_items: upsellItems,
      original_total: Number(state.orderTotal || 0),
      upsell_total: getUpsellTotal(),
      total_after_upsell: Number(state.orderTotal || 0) + getUpsellTotal()
    };

    try {
      fetch(state.gasUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error("[Water bottle upsell error]", err);
    }

    closePopup();

    showOrderDetailThankModal({
      hasUpsell: true,
      upsellItems: upsellItems,
      upsellTotal: getUpsellTotal()
    });
  }

  function bindEvents(root) {
    root.addEventListener("click", function (event) {
      const target = event.target.closest("[data-action]");
      if (!target) return;

      const action = target.getAttribute("data-action");
      const id = Number(target.getAttribute("data-id") || 0);

      if (action === "close") {
        closePopup();
        showOrderDetailThankModal({
          hasUpsell: false,
          upsellItems: [],
          upsellTotal: 0
        });
        return;
      }

      if (action === "submit") {
        submitUpsell();
        return;
      }

      if (action === "toggle-color") {
        toggleColor(id);
        return;
      }

      if (action === "select-color") {
        selectColor(id, target.getAttribute("data-color"));
        return;
      }

      if (action === "change-qty") {
        changeQty(id, Number(target.getAttribute("data-delta") || 0));
        return;
      }

      if (action === "remove-line") {
        removeLine(id);
        return;
      }

      if (action === "view-image") {
        openImageViewer(target.getAttribute("data-image"));
        return;
      }

      if (action === "close-image") {
        closeImageViewer();
      }
    });
  }

  function open(options) {
    injectStyle();

    state = {
      gasUrl: options.gasUrl || "",
      orderId: options.orderId || "",
      sheetName: options.sheetName || "",
      basePayload: options.basePayload || null,
      customer: options.customer || {},
      items: Array.isArray(options.items) ? options.items : [],
      orderTotal: Number(options.orderTotal || 0),
      upsellItems: initUpsellItems(options.items),
      isSubmitting: false
    };

    const oldOverlay = document.getElementById("ninoWaterOverlay");
    if (oldOverlay) oldOverlay.remove();

    const overlay = document.createElement("div");
    overlay.id = "ninoWaterOverlay";
    overlay.className = "nino-water-overlay";

    overlay.innerHTML = `
      <div class="nino-water-modal">
        <button class="nino-water-close" type="button" aria-label="Đóng" data-action="close">×</button>

        <div class="nino-water-success">✓ Đặt hàng thành công</div>

        <h2 class="nino-water-title">Thêm bình nước 750ml cho bé</h2>

        <p class="nino-water-desc">
          🔥 Gộp đơn chỉ 59k — tiết kiệm 40k so với mua lẻ 99k 🎁
        </p>

        <div id="ninoWaterContent"></div>

        <div id="ninoWaterError" class="nino-water-error">
          Cần chọn ít nhất 1 bình nước.
        </div>

        <div class="nino-water-note">
          Thêm ngay sẽ được gộp chung vào đơn vừa đặt.
        </div>

        <button class="nino-water-add" type="button" id="ninoWaterAddBtn" data-action="submit">
          Thêm vào đơn vừa đặt +59.000đ
        </button>

        <button class="nino-water-skip" type="button" data-action="close">
          Không cần, tôi chỉ lấy balo
        </button>
      </div>

      <div class="nino-water-image-viewer" id="ninoWaterImageViewer">
        <div class="nino-water-image-box">
          <button class="nino-water-image-close" type="button" data-action="close-image">×</button>
          <img id="ninoWaterImageView" src="" alt="Ảnh bình nước">
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    bindEvents(overlay);
    render();
  }

  window.NinoWaterBottleUpsell = {
    open
  };
})();