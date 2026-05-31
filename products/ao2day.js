const cldImage = (url, preset) => String(url || "").replace("/image/upload/", `/image/upload/${preset}/`);

const imgCover = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_900,h_900");
const imgContent = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_900");
const imgReview = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_260,h_260");

const PRODUCT_CONFIG = {
  id: "ao-2-day-001",
  slug: "ao2day",
  layout: "clothing",

  name: "🔥(HOT) Set Jum Kẻ Mix có kèm quần trong",
  displayName: "🔥(HOT) Set Jum Kẻ Mix có kèm quần trong",
  shortName: "Set Jum Kẻ Mix",
  sheetProductName: "Set Jum Kẻ Mix có kèm quần trong",
  sheetName: "ao2day",
  price: 375000,
  oldPrice: 499000,
  currency: "VND",
  category: "Thời trang nữ",

  disableWaterBottleUpsell: true,

  shipBar: "Miễn phí vận chuyển · Được kiểm tra hàng trước khi nhận · Trả hàng nếu không giống mẫu",

  seo: {
    title: "Set Jum Kẻ Mix có kèm quần trong - Giá 375K",
    description: "Set Jum Kẻ Mix có kèm quần trong, thiết kế dễ mặc, phù hợp mặc đi chơi, dạo phố, đi học hoặc đi làm.",
    ogImage: imgCover("https://via.placeholder.com/900x900?text=Set+Jum+Ke+Mix")
  },

  subHeading: "Set Jum Kẻ Mix có kèm quần trong, dáng dễ mặc, phù hợp nhiều vóc dáng.",
  hookTitle: "Ưu đãi hôm nay",
  soldText: "12k",

  shopName: "Nino-clothing",

  sliderTags: [
    "Kiểm tra hàng<br>trước khi nhận",
    "Trả hàng nếu<br>k giống mẫu",
    "Miễn phí<br>vận chuyển"
  ],

  clothing: {
    shopName: "Nino-clothing",
    rankTitle: "🏆 Top sản phẩm bán chạy",
    repurchaseText: "Tỷ lệ khách hàng mua lại 95%",
    ratingText: "4.8/5",
    ratingCountText: "(1.2k)",
    soldText: "12k",
    sizeGuideHtml: `
      <strong>HD chọn size</strong>
      38-45kg: size M<br>
      46-62kg: size L
    `,
    policyTags: [
      {
        icon: "✓",
        text: "Kiểm tra hàng<br>trước khi nhận"
      },
      {
        icon: "↺",
        text: "Trả hàng nếu<br>k giống mẫu"
      },
      {
        icon: "🚚",
        text: "Miễn phí<br>vận chuyển"
      }
    ]
  },

  images: [
    imgCover("https://via.placeholder.com/900x900?text=Anh+san+pham+1"),
    imgCover("https://via.placeholder.com/900x900?text=Anh+san+pham+2"),
    imgCover("https://via.placeholder.com/900x900?text=Anh+san+pham+3"),
    imgCover("https://via.placeholder.com/900x900?text=Anh+san+pham+4")
  ],
  videos: [],

  description: {
    shortHtml: `
      <h3>Set Jum Kẻ Mix có kèm quần trong – dễ mặc, tiện dùng hằng ngày</h3>
      <p>Thiết kế kẻ mix trẻ trung, form dễ mặc, phù hợp đi chơi, dạo phố, đi học hoặc đi làm.</p>
      <p>Sản phẩm có kèm quần trong, giúp người mặc tự tin và thoải mái hơn khi sử dụng.</p>
      <img src="${imgContent("https://via.placeholder.com/900x900?text=Set+Jum+Ke+Mix")}" alt="Set Jum Kẻ Mix có kèm quần trong">
    `,

    fullHtml: `
      <p>Set Jum Kẻ Mix có kèm quần trong là mẫu thời trang nữ phù hợp mặc hằng ngày. Thiết kế đơn giản, trẻ trung, dễ phối cùng giày thể thao, sandal hoặc phụ kiện cơ bản.</p>

      <h3>Thiết kế dễ mặc</h3>
      <p>Kiểu dáng gọn, phù hợp nhiều vóc dáng. Phần họa tiết kẻ mix giúp tổng thể nhìn nổi bật nhưng vẫn dễ ứng dụng trong nhiều hoàn cảnh.</p>
      <img src="${imgContent("https://via.placeholder.com/900x900?text=Anh+chi+tiet+1")}" alt="Thiết kế Set Jum Kẻ Mix">

      <h3>Có kèm quần trong</h3>
      <p>Sản phẩm có kèm quần trong, giúp người mặc thoải mái hơn khi di chuyển, ngồi hoặc hoạt động ngoài trời.</p>
      <img src="${imgContent("https://via.placeholder.com/900x900?text=Anh+chi+tiet+2")}" alt="Set Jum có kèm quần trong">

      <h3>Phù hợp nhiều hoàn cảnh</h3>
      <p>Có thể mặc khi đi chơi, đi học, đi làm, dạo phố hoặc chụp ảnh. Mẫu dễ phối đồ, không cần phối quá cầu kỳ.</p>

      <h3>Thông tin sản phẩm</h3>
      <ul>
        <li>Tên sản phẩm: Set Jum Kẻ Mix có kèm quần trong</li>
        <li>Size: M, L</li>
        <li>Gợi ý size: 38-45kg size M, 46-62kg size L</li>
        <li>Giá bán: 375.000đ</li>
        <li>Giá niêm yết: 499.000đ</li>
        <li>Phù hợp: mặc đi chơi, dạo phố, đi học, đi làm</li>
      </ul>
    `
  },

  variants: [
    {
      type: "size",
      name: "M",
      label: "M",
      price: 375000,
      oldPrice: 499000
    },
    {
      type: "size",
      name: "L",
      label: "L",
      price: 375000,
      oldPrice: 499000
    }
  ],

  defaultVariant: {
    size: "M"
  },

  combos: [
    {
      name: "1 sản phẩm",
      quantity: 1,
      price: 375000,
      oldPrice: 499000,
      shipFee: 0,
      note: "Miễn phí vận chuyển"
    }
  ],

  features: [
    { icon: "👗", title: "Thiết kế dễ mặc", sub: "Phù hợp nhiều vóc dáng" },
    { icon: "✅", title: "Có kèm quần trong", sub: "Thoải mái và tự tin hơn" },
    { icon: "🚚", title: "Miễn phí vận chuyển", sub: "Thanh toán khi nhận hàng" }
  ],

  benefits: [],
  hooks: [],

  returnPolicy: {
    title: "Kiểm tra hàng trước khi nhận",
    content: "Khách được kiểm tra hàng trước khi nhận. Nếu sản phẩm không giống mẫu có thể liên hệ shop để được hỗ trợ đổi trả theo chính sách."
  },

  faqs: [
    {
      q: "Sản phẩm có mấy size?",
      a: "Sản phẩm có 2 size M và L. Gợi ý: 38-45kg chọn size M, 46-62kg chọn size L."
    },
    {
      q: "Có được kiểm tra hàng không?",
      a: "Có. Khách được kiểm tra hàng trước khi nhận."
    },
    {
      q: "Sản phẩm có kèm quần trong không?",
      a: "Có. Set Jum Kẻ Mix có kèm quần trong."
    }
  ],

  reviews: {
    avgScore: 5,
    totalCount: 17,
    bars: [
      { star: 5, count: 11, percent: 65 },
      { star: 4, count: 4,  percent: 24 },
      { star: 3, count: 2,  percent: 11 },
      { star: 2, count: 0,  percent: 0  },
      { star: 1, count: 0,  percent: 0  }
    ],
    items: [
      {
        name: "Ngọc Hà",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775668042/538167066_24575065288755198_3598154797602927391_n_twatvu.jpg",
        stars: 5,
        date: "2026-03-10 09:15",
        classify: "Size M",
        match: "",
        material: "",
        content: "Set mặc xinh, dáng gọn, có quần trong nên rất yên tâm. Mình chọn size M vừa đẹp.",
        media: [
          imgReview("https://via.placeholder.com/260x260?text=Review+1")
        ],
        mediaFull: [],
        likes: 18
      },
      {
        name: "Minh Thư",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775668044/637761832_26138729435757097_3914838421337340387_n_1_vslodw.jpg",
        stars: 5,
        date: "2026-02-20 14:30",
        classify: "Size L",
        match: "",
        material: "",
        content: "Hàng giống ảnh, mặc lên dáng đẹp. Shop đóng gói cẩn thận, giao nhanh.",
        media: [
          imgReview("https://via.placeholder.com/260x260?text=Review+2")
        ],
        mediaFull: [],
        likes: 12
      },
      {
        name: "Thu Hương",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777442314/496048196_10227521412714146_7242111311152812573_n_cqob7o.jpg",
        stars: 5,
        date: "2026-03-05 20:00",
        classify: "Size M",
        match: "",
        material: "",
        content: "Shop giao hàng nhanh. Set mặc trẻ trung, vải ổn, giá này thấy đáng mua.",
        media: [
          imgReview("https://via.placeholder.com/260x260?text=Review+3")
        ],
        mediaFull: [],
        likes: 25
      },
      {
        name: "Lan Phương",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666154/528684809_10234145965525107_1862972145806632462_n_pjnnbt.jpg",
        stars: 5,
        date: "2026-01-28 11:00",
        classify: "Size L",
        match: "",
        material: "",
        content: "Mình mặc size L thấy thoải mái. Form xinh, không bị ngắn quá, có quần trong nên tiện.",
        media: [
          imgReview("https://via.placeholder.com/260x260?text=Review+4")
        ],
        mediaFull: [],
        likes: 20
      },
      {
        name: "Mỹ Linh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666153/515438282_10161038595011631_4166789956527747626_n_c3roiy.jpg",
        stars: 5,
        date: "2026-02-14 16:45",
        classify: "Size M",
        match: "",
        material: "",
        content: "Set bên ngoài xinh hơn ảnh, mặc lên nhìn gọn người. Shop tư vấn size chuẩn.",
        media: [
          imgReview("https://via.placeholder.com/260x260?text=Review+5")
        ],
        mediaFull: [],
        likes: 30
      },
      {
        name: "Thanh Vân",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666157/632391822_10164165214234558_5477016556770594214_n_aalvtm.jpg",
        stars: 5,
        date: "2026-03-18 08:30",
        classify: "Size L",
        match: "",
        material: "",
        content: "Đóng gói kỹ, hàng đúng mẫu, mặc đi chơi rất hợp. Mình hài lòng.",
        media: [
          imgReview("https://via.placeholder.com/260x260?text=Review+6")
        ],
        mediaFull: [],
        likes: 14
      },
      {
        name: "Hồng Nhung",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263433/607811273_3686318401504627_2580143465656964454_n_o5tm6p.jpg",
        stars: 5,
        date: "2026-04-02 08:40",
        classify: "Size M",
        match: "",
        material: "",
        content: "Giao nhanh, shop tư vấn nhiệt tình. Mình 42kg mặc size M vừa đẹp.",
        media: [],
        mediaFull: [],
        likes: 14
      },
      {
        name: "Thanh Trúc",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263432/678769426_25775706475437957_4956482442550281485_n_x71xqb.jpg",
        stars: 5,
        date: "2026-03-25 19:10",
        classify: "Size L",
        match: "",
        material: "",
        content: "Mình 50kg chọn size L mặc thoải mái. Hàng nhận được đúng mô tả.",
        media: [],
        mediaFull: [],
        likes: 8
      },
      {
        name: "Bích Ngọc",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263433/472217451_3897875233826229_3182586081425376309_n_mim7vg.jpg",
        stars: 5,
        date: "2026-04-10 10:25",
        classify: "Size M",
        match: "",
        material: "",
        content: "Set đẹp, mặc lên rất trẻ. Có quần trong nên mình thấy tiện hơn nhiều.",
        media: [],
        mediaFull: [],
        likes: 22
      },
      {
        name: "Mai Chi",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263432/637485615_1453115166448791_8103813016882458818_n_y3vycz.jpg",
        stars: 5,
        date: "2026-03-30 15:50",
        classify: "Size L",
        match: "",
        material: "",
        content: "Mình thích kiểu kẻ mix này, nhìn đơn giản mà nổi. Giá ổn, đáng mua.",
        media: [
          imgReview("https://via.placeholder.com/260x260?text=Review+7")
        ],
        mediaFull: [],
        likes: 17
      },
      {
        name: "Thu Hà",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263432/608432069_4208202082731817_7593177311780112717_n_s7wuio.jpg",
        stars: 5,
        date: "2026-04-05 21:30",
        classify: "Size M",
        match: "",
        material: "",
        content: "Chất ổn, mặc không bị khó chịu. Mình nhận hàng được kiểm tra trước nên yên tâm.",
        media: [],
        mediaFull: [],
        likes: 11
      },
      {
        name: "Khánh Linh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263431/380661527_1145384113086953_873267480011151541_n_fl2efc.jpg",
        stars: 5,
        date: "2026-04-12 07:15",
        classify: "Size L",
        match: "",
        material: "",
        content: "Hàng đúng mẫu, form dễ mặc. Mình đặt size L theo cân nặng shop hướng dẫn là vừa.",
        media: [],
        mediaFull: [],
        likes: 35
      },
      {
        name: "Phương Linh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263431/453992787_3800619243515148_1809283296923042613_n_hdx7eh.jpg",
        stars: 5,
        date: "2026-04-08 13:00",
        classify: "Size M",
        match: "",
        material: "",
        content: "Set xinh nha mọi người. Mình mặc đi chơi bạn bè khen nhiều, shop giao nhanh.",
        media: [],
        mediaFull: [],
        likes: 19
      },
      {
        name: "Vân Anh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263431/637469479_3748582662104448_139579128894954823_n_rijprq.jpg",
        stars: 4,
        date: "2026-03-20 16:20",
        classify: "Size L",
        match: "",
        material: "",
        content: "Đóng gói cẩn thận, hàng giống hình. Mặc ổn, form khá dễ mặc.",
        media: [],
        mediaFull: [],
        likes: 5
      },
      {
        name: "Kim Oanh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263431/608887444_3826876447447507_2357408524069674573_n_xy3pgs.jpg",
        stars: 5,
        date: "2026-04-15 09:45",
        classify: "Size M",
        match: "",
        material: "",
        content: "Shop gửi đúng size, hàng mới, mặc lên xinh. Mình sẽ ủng hộ tiếp.",
        media: [],
        mediaFull: [],
        likes: 27
      },
      {
        name: "Hoài Thương",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263626/330810441_915686159621636_4232321777533105788_n_mwfmla.jpg",
        stars: 4,
        date: "2026-04-18 20:00",
        classify: "Size L",
        match: "",
        material: "",
        content: "Hàng nhận được đúng mô tả, giao nhanh. Mình chọn size L mặc vừa thoải mái.",
        media: [],
        mediaFull: [],
        likes: 10
      },
      {
        name: "Ngọc Diệp",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777178082/Avt_m%E1%BA%B7c_%C4%91%E1%BB%8Bnh_Facebook_l9xnkz.webp",
        stars: 5,
        date: "2026-04-20 11:30",
        classify: "Size M",
        match: "",
        material: "",
        content: "Giao hàng nhanh, sản phẩm đúng mẫu. Có quần trong nên mặc tự tin hơn.",
        media: [],
        mediaFull: [],
        likes: 13
      }
    ]
  },

  policies: [
    { icon: "🚚", text: "Miễn phí vận chuyển" },
    { icon: "💵", text: "Thanh toán khi nhận hàng" },
    { icon: "✅", text: "Được kiểm tra hàng trước khi nhận" }
  ]
};