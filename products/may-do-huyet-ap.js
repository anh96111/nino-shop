const PRODUCT_CONFIG = {

  // ── CƠ BẢN ──
  id:        "may-do-huyet-ap-bap-tay-001",
  slug:      "may-do-huyet-ap",
  name:      "Chỉ 30 Giây Đo Tại Nhà – Máy Đo Huyết Áp Bắp Tay Giọng Nói Tiếng Việt Giúp Phát Hiện Sớm Nguy Cơ Đột Quỵ, Tim Mạch - BH 12 tháng.",
  shortName: "Máy Đo Huyết Áp Bắp Tay Giọng Nói Tiếng Việt",
  price:     259000,
  oldPrice:  518000,
  discount:  "-50%",
  currency:  "VND",
  sheetName: "may do hp",
  category:  "Sức khỏe",
  soldCount: "12.000+",

  // ── SEO / OG ──
  seo: {
    title:       "Chỉ 30 Giây Đo Tại Nhà – Máy Đo Huyết Áp Bắp Tay Giọng Nói Tiếng Việt Giúp Phát Hiện Sớm Nguy Cơ Đột Quỵ, Tim Mạch - BH 12 tháng.",
    description: "Máy đo huyết áp bắp tay giọng nói tiếng Việt – đo chính xác 30 giây, lưu 99 kết quả, bảo hành 12 tháng 1 đổi 1. Giao toàn quốc, COD, miễn phí ship.",
    ogImage:     "https://res.cloudinary.com/dezednxpz/image/upload/w_600,h_600,c_fill,f_webp,q_80/v1776178687/6_sml4x4.jpg"
  },

  // ── SUB HEADING ──
  subHeading: "Đo sau 30 giây · Màn hình lớn · Bảo hành 12 tháng",

  // ── HERO BULLETS ──
  heroBullets: [
    { icon: "👴", text: "Người lớn tuổi tự dùng được — bấm 1 nút, máy tự đọc" },
    { icon: "🔊", text: "Đọc kết quả tiếng Việt rõ ràng" },
    { icon: "📦", text: "COD — kiểm tra hàng trước khi thanh toán" }
  ],

  // ── CẢNH BÁO ──
  warningTag: "⚠️ 7/10 người trên 35 tuổi không biết mình bị cao huyết áp",

  // ── SOCIAL PROOF ──
  socialRow: {
    rating: "4.8/5",
    text:   "Được nhiều gia đình tin dùng theo dõi huyết áp tại nhà"
  },

  // ── GALLERY ──
  images: [
    "https://res.cloudinary.com/dezednxpz/image/upload/v1776736352/33_sxegbo.jpg",
    "https://res.cloudinary.com/dezednxpz/image/upload/w_600,h_600,c_fill,f_webp,q_80/v1776179181/vn-11134207-820l4-mijjqwi3l6o1e7_kylibz.webp",
    "https://res.cloudinary.com/dezednxpz/image/upload/w_600,h_600,c_fill,f_webp,q_80/v1776179181/vn-11134207-820l4-mhzpj3yj0idi96_ffyb9b.webp",
    "https://res.cloudinary.com/dezednxpz/image/upload/w_600,h_600,c_fill,f_webp,q_80/v1776179146/Girl_measures_father_s_202604142138_hyshj7.jpg"
  ],
  videos: [],

  // ── COMBO / BIẾN THỂ ──
  // Mảng rỗng = SP không có biến thể
  // Ví dụ SP có biến thể:
  // variants: [
  //   { type: "color", label: "Màu sắc", options: ["Đen", "Trắng", "Xanh"] },
  //   { type: "size",  label: "Size",     options: ["S", "M", "L", "XL"] }
  // ]
  variants: [],

  // ── TÍNH NĂNG ──
  features: [
    { icon: "🔊", title: "Giọng tiếng Việt",     sub: "Đọc kết quả rõ, người lớn tuổi tự dùng được" },
    { icon: "💾", title: "Lưu 99 kết quả",       sub: "Theo dõi lịch sử cho 2 người dùng riêng" },
    { icon: "🖥️", title: "Màn hình LCD lớn",      sub: "Hiển thị huyết áp + nhịp tim cùng lúc" },
    { icon: "🔌", title: "Sạc Mini USB",          sub: "Dùng sạc điện thoại thông thường" },
    { icon: "⏱️", title: "30 giây có kết quả",    sub: "Nhanh, chính xác, không mất thời gian" },
    { icon: "🛡️", title: "BH 12 tháng",           sub: "1 đổi 1 nếu lỗi kỹ thuật" }
  ],

  // ── MÔ TẢ CHI TIẾT (HTML) ──
  descriptionHTML: `
    <div class="d-title">Bạn có chắc huyết áp đang an toàn?</div>
    <p>Huyết áp cao không có triệu chứng rõ ràng — nhiều người chỉ biết mình mắc bệnh sau khi đã xảy ra biến chứng nghiêm trọng. Đây là lý do huyết áp được gọi là <strong>"kẻ giết người thầm lặng"</strong>.</p>

    <img src="https://res.cloudinary.com/dezednxpz/image/upload/w_600,h_600,c_fill,f_webp,q_80/v1776179146/Girl_measures_father_s_202604142138_hyshj7.jpg" loading="lazy" decoding="async" width="600" height="600" style="width:100%; border-radius:10px; margin:12px 0;" />

    <div class="d-highlight">
      Bạn thường xuyên đau đầu, chóng mặt, mất ngủ — hay tê tay chân, tim đập nhanh bất thường?<br>
      Gia đình có người từng cao huyết áp hoặc đột quỵ?<br><br>
      <strong>70% người 35+ tại Việt Nam không biết mình bị cao huyết áp cho đến khi quá muộn.</strong>
    </div>

    <div class="d-title">Theo dõi huyết áp tại nhà — đơn giản hơn bạn nghĩ</div>
    <p>Không cần đến bệnh viện, không cần kiến thức y tế chuyên sâu. Chỉ cần đeo vòng bít, bấm một nút — 30 giây sau máy đọc kết quả bằng tiếng Việt rõ ràng.</p>

    <img src="https://res.cloudinary.com/dezednxpz/image/upload/w_600,h_600,c_fill,f_webp,q_80/v1776179312/vn-11134207-820l4-mhzpj3yiz3t222_ya2pxm.webp" loading="lazy" decoding="async" width="600" height="600" style="width:100%; border-radius:10px; margin:12px 0;" />

    <ul class="d-check-list">
      <li>Đo chính xác huyết áp &amp; nhịp tim chỉ sau 30 giây</li>
      <li>Giọng đọc tiếng Việt — người lớn tuổi không cần nhờ con cháu đọc số</li>
      <li>Theo dõi liên tục, phát hiện bất thường sớm</li>
      <li>Chủ động kiểm soát sức khỏe mỗi ngày tại nhà</li>
    </ul>

    <div class="d-title">Đặc biệt phù hợp</div>
    <ul class="d-check-list">
      <li>Người từ 35 tuổi trở lên</li>
      <li>Người có tiền sử huyết áp, tim mạch</li>
      <li>Gia đình có người lớn tuổi cần theo dõi sức khỏe thường xuyên</li>
    </ul>

    <div class="d-title">Thông số kỹ thuật</div>
    <table class="d-spec-table">
      <tbody>
        <tr><td>Phương pháp đo</td><td>Oscillometric</td></tr>
        <tr><td>Độ chính xác</td><td>± 3 mmHg</td></tr>
        <tr><td>Khoảng đo</td><td>0 – 280 mmHg</td></tr>
        <tr><td>Đo nhịp tim</td><td>40 – 195 lần/phút (± 5%)</td></tr>
        <tr><td>Lưu trữ</td><td>99 kết quả / 2 người dùng</td></tr>
        <tr><td>Nguồn điện</td><td>4 pin AAA hoặc Mini USB</td></tr>
        <tr><td>Tự động tắt</td><td>Sau 1 phút không thao tác</td></tr>
        <tr><td>Bảo hành</td><td>12 tháng — 1 đổi 1</td></tr>
      </tbody>
    </table>

    <div class="d-box-set">
      <div class="d-box-set-title">🎁 Bộ sản phẩm bao gồm</div>
      <div class="d-box-item">Máy đo huyết áp điện tử bắp tay</div>
      <div class="d-box-item">Vòng bít bắp tay</div>
      <div class="d-box-item">Hướng dẫn sử dụng tiếng Việt</div>
      <div class="d-box-item">Túi đựng tiện lợi</div>
    </div>

    <div class="d-cta-end">
      <strong>Đừng đợi cơ thể "lên tiếng" mới bắt đầu quan tâm đến sức khỏe.</strong><br><br>
      Đặt hàng hôm nay — kiểm tra hàng trước khi thanh toán, bảo hành 12 tháng 1 đổi 1, giao toàn quốc miễn phí.
    </div>
  `,

  // ── CHÍNH SÁCH TRẢ HÀNG ──
  returnPolicy: {
    title: "🛡️ Bảo hành 12 tháng 1 đổi 1 & Hoàn tiền nếu không đúng mô tả",
    content: `Bảo hành <strong>12 tháng — 1 đổi 1</strong> nếu lỗi kỹ thuật. Hoàn tiền 100% nếu sản phẩm không đúng mô tả. Kiểm tra hàng trước khi thanh toán (COD) — không gây khó dễ.`
  },

  // ── FAQ ──
  faqs: [
    { q: "Máy có đọc kết quả tiếng Việt không?", a: "Có — giọng đọc tiếng Việt rõ ràng, chuẩn, không bị ngọng." },
    { q: "Người cao tuổi tự dùng được không?",    a: "Có — chỉ bấm 1 nút, 30 giây có kết quả, máy tự đọc." },
    { q: "Bảo hành bao lâu?",                     a: "12 tháng — 1 đổi 1 nếu lỗi kỹ thuật." },
    { q: "Nguồn điện sử dụng như thế nào?",       a: "Dùng 4 pin AAA hoặc cắm sạc qua cổng Mini USB như sạc điện thoại." },
    { q: "Có kiểm tra hàng trước khi thanh toán không?", a: "Có — kiểm tra tại chỗ trước khi trả tiền cho shipper." }
  ],

  // ── REVIEWS ──
  reviews: {
    avgScore:   4.8,
    totalCount: 7,
    bars: [
      { star: 5, count: 6, percent: 85 },
      { star: 4, count: 1, percent: 15 },
      { star: 3, count: 0, percent: 0 },
      { star: 2, count: 0, percent: 0 },
      { star: 1, count: 0, percent: 0 }
    ],
    items: [
      {
        name: "minhchau_nguyen82",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775668042/538167066_24575065288755198_3598154797602927391_n_twatvu.jpg",
        stars: 5, date: "2026-03-15 09:22",
        classify: "Máy đo huyết áp bắp tay",
        match: "Đúng như mô tả", material: "Chắc chắn",
        content: "Mua cho ba 72 tuổi dùng. Ba tự đo được ngay không cần hướng dẫn nhiều, giọng đọc tiếng Việt rõ ràng nghe rất dễ. Đo thử so với máy phòng khám gần nhà chênh không đáng kể. Hài lòng lắm, đáng tiền.",
        media: ["https://res.cloudinary.com/dezednxpz/image/upload/w_200,h_200,c_fill,f_webp,q_80/v1776179673/7_u5mv2x.jpg"],
        likes: 24
      },
      {
        name: "Lan Anh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775668044/637761832_26138729435757097_3914838421337340387_n_1_vslodw.jpg",
        stars: 5, date: "2026-02-28 14:07",
        classify: "Máy đo huyết áp bắp tay",
        match: "Đúng", material: "Tốt",
        content: "Mẹ mình bị huyết áp cao nên cần theo dõi hàng ngày. Máy đọc kết quả tiếng Việt nên mẹ không cần nhờ con đọc số nữa. Lưu được 99 lần đo rất tiện theo dõi lịch sử. Shop đóng gói cẩn thận, giao nhanh hơn dự kiến.",
        media: ["https://res.cloudinary.com/dezednxpz/image/upload/w_200,h_200,c_fill,f_webp,q_80/v1776177557/2_zq8dv3.jpg"],
        likes: 41
      },
      {
        name: "tranvanhung_hp",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775668484/655123654_4399537900363500_7679473754360228153_n_jb2ppc.jpg",
        stars: 5, date: "2026-03-08 20:31",
        classify: "Máy đo huyết áp bắp tay",
        match: "Đúng mô tả", material: "Ổn định",
        content: "Dùng được 3 tuần, đo sáng tối đều đặn. Kết quả ổn định, không thấy sai lệch giữa các lần đo liên tiếp. Cắm sạc qua USB tiện không cần mua pin. Màn hình to chữ rõ người già nhìn thoải mái.",
        media: ["https://res.cloudinary.com/dezednxpz/image/upload/w_200,h_200,c_fill,f_webp,q_80/v1776179146/vn-11134103-7r98o-lotlcupjii4w73_emxoe9.webp"],
        likes: 18
      },
      {
        name: "Hương Trần",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666154/528684809_10234145965525107_1862972145806632462_n_pjnnbt.jpg",
        stars: 5, date: "2026-01-19 11:55",
        classify: "Máy đo huyết áp bắp tay",
        match: "Đúng mô tả", material: "Sang trọng",
        content: "Mua tặng bố dịp Tết. Hộp đựng đẹp, có túi đựng kèm rất tiện. Bố dùng thử ngay tại chỗ, máy đọc tiếng Việt rõ, bố thích lắm. Cảm ơn shop tư vấn nhiệt tình.",
        media: ["https://res.cloudinary.com/dezednxpz/image/upload/w_200,h_200,c_fill,f_webp,q_80/v1776179145/vn-11134103-81ztc-ml75ugphw26ba5_ekha0j.webp"],
        likes: 33
      },
      {
        name: "bacsi_noidru",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666153/515438282_10161038595011631_4166789956527747626_n_c3roiy.jpg",
        stars: 5, date: "2026-03-21 16:44",
        classify: "Máy đo huyết áp bắp tay",
        match: "Kiểm chứng được", material: "Chính xác, ổn định",
        content: "Mình làm trong ngành y, khá khắt khe khi chọn máy đo huyết áp gia đình. Máy dùng phương pháp Oscillometric chuẩn, đo thử 5 lần so với máy thủy ngân — sai lệch trong ngưỡng cho phép. Phù hợp theo dõi tại nhà, đặc biệt người có tiền sử tim mạch.",
        media: ["https://res.cloudinary.com/dezednxpz/image/upload/w_200,h_200,c_fill,f_webp,q_80/v1776179144/vn-11134103-7ras8-m0ydwpdbjxnx37_iun6r4.webp"],
        likes: 57
      },
      {
        name: "nguyetanh_sg",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666157/632391822_10164165214234558_5477016556770594214_n_aalvtm.jpg",
        stars: 4, date: "2026-02-11 08:19",
        classify: "Máy đo huyết áp bắp tay",
        match: "Tốt", material: "Ổn",
        content: "Máy dùng ổn, giọng đọc tiếng Việt rõ không bị ngọng. Trừ 1 sao vì lần đầu phải đọc hướng dẫn mới biết đeo băng đúng vị trí. Sau khi quen thì rất nhanh, 30 giây là có kết quả. Sẽ giới thiệu cho người thân.",
        media: ["https://res.cloudinary.com/dezednxpz/image/upload/w_200,h_200,c_fill,f_webp,q_80/v1776179146/vn-11134103-7r98o-lzt88t30inc126_jjf1n0.webp"],
        likes: 9
      },
      {
        name: "phuong_thanh_hn",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666156/608669903_10236803308436120_5728387328273075460_n_we3otz.jpg",
        stars: 5, date: "2026-03-30 21:03",
        classify: "Máy đo huyết áp bắp tay",
        match: "Đúng", material: "Bền, chắc",
        content: "Cả nhà 2 người già dùng chung được vì máy lưu riêng 2 tài khoản. Tự động tắt sau 1 phút tiết kiệm pin. Bảo hành 12 tháng yên tâm hơn nhiều chỗ khác chỉ 3 tháng. Đặt lần 2 rồi, mua thêm cho nhà ngoại.",
        media: ["https://res.cloudinary.com/dezednxpz/image/upload/w_200,h_200,c_fill,f_webp,q_80/v1776177557/5_xphrfb.jpg"],
        likes: 15
      }
    ]
  },

  // ── CHÍNH SÁCH HIỂN THỊ (section cuối) ──
  policies: [
    { icon: "🛡️", text: `Bảo hành <strong>12 tháng 1 đổi 1</strong> — đổi mới nếu lỗi kỹ thuật` },
    { icon: "🚚", text: `Giao toàn quốc 2–5 ngày. Nội thành HN/HCM 1–2 ngày. <strong>Miễn phí ship &amp; trả hàng</strong>` },
    { icon: "💳", text: `Thanh toán khi nhận hàng (COD) — kiểm tra trước khi trả tiền` },
    { icon: "↩️", text: `Hoàn tiền ngay nếu sản phẩm không đúng mô tả` }
  ]
};
