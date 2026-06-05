const cldImage = (url, preset) => String(url || "").replace("/image/upload/", `/image/upload/${preset}/`);

const imgCover = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_900,h_900");
const imgContent = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_900");
const imgReview = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_260,h_260");
const imgReviewFull = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_1200");
const imgAvatar = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_face,w_80,h_80");

const DEFAULT_AVATAR = imgAvatar("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689040/Avt_m%E1%BA%B7c_%C4%91%E1%BB%8Bnh_Facebook_isxluz.webp");

const PRODUCT_CONFIG = {
  id: "ke-de-do-001",
  slug: "ke",
  layout: "shopee-solar",

  name: "Kệ Để Đồ Cao Cấp Không Gỉ",
  displayName: "Kệ Để Đồ Cao Cấp Không Gỉ",
  shortName: "Kệ Để Đồ Cao Cấp Không Gỉ",
  sheetProductName: "Kệ Để Đồ Cao Cấp Không Gỉ",
  sheetName: "ke",
  price: 169000,
  oldPrice: 169000,
  currency: "VND",
  category: "Kệ để đồ gắn vòi rửa mặt tiện dụng.",

  disableWaterBottleUpsell: true,

  shipBar: "Giao hàng toàn quốc · Thanh toán khi nhận hàng · Được kiểm tra hàng",

  seo: {
    title: "Kệ Để Đồ Cao Cấp Không Gỉ - Giá 169K",
    description: "Kệ để đồ gắn vòi rửa mặt, kim loại sơn tĩnh điện cao cấp, thoát nước nhanh, giúp lavabo gọn gàng và sạch sẽ.",
    ogImage: imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780675955/8_zzksww.jpg")
  },

  subHeading: "Gắn trực tiếp quanh vòi rửa mặt, gọn gàng, tiện lợi, không cần khoan đục.",
  hookTitle: "Ưu đãi hôm nay",
  soldText: "112.5k",
  sliderTags: [
    "Không cần khoan<br>dễ lắp đặt",
    "Thoát nước nhanh<br>luôn khô ráo",
    "Sơn tĩnh điện<br>cao cấp"
  ],

  images: [
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780675955/8_zzksww.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780675955/9_x4d7p8.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780674135/2_jfmlvy.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780674134/7_pixere.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780674134/5_vyanzt.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780674134/6_jayxgw.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780674134/4_fzjtmo.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780674134/1_owvfka.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780674134/3_tvt2z2.jpg")
  ],
  videos: [],

  description: {
    shortHtml: `
      <h3>Kệ để đồ gắn vòi rửa mặt – gọn gàng, tiện lợi cho phòng tắm</h3>
      <p>Kệ để đồ gắn vòi rửa mặt giúp không gian lavabo luôn gọn gàng, sạch sẽ và dễ sử dụng hơn mỗi ngày.</p>
      <p>Thiết kế thông minh gắn trực tiếp quanh vòi nước, không chiếm diện tích mặt bàn, phù hợp với lavabo, phòng tắm và nhà vệ sinh gia đình.</p>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780675955/8_zzksww.jpg")}" alt="Kệ để đồ gắn vòi rửa mặt">
    `,

    fullHtml: `
      <p>Sản phẩm được làm từ <strong>kim loại sơn tĩnh điện cao cấp</strong>, chắc chắn, bền đẹp, hạn chế han gỉ khi tiếp xúc với môi trường ẩm ướt.</p>
      <p>Bề mặt kệ dạng lưới thoáng giúp <strong>thoát nước nhanh</strong>, giữ mỹ phẩm và đồ dùng cá nhân luôn khô ráo, sạch sẽ.</p>

      <p>Kệ có thể dùng để đặt sữa rửa mặt, kem đánh răng, bàn chải, mỹ phẩm, chai lọ skincare, xà phòng và nhiều phụ kiện phòng tắm khác.</p>
      <p>Nhờ thiết kế gọn nhẹ, dễ tháo lắp, bạn có thể vệ sinh kệ nhanh chóng mà không cần khoan đục hay lắp đặt phức tạp.</p>

      <h3>Điểm nổi bật</h3>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689748/10_x1ucgb.jpg")}" alt="Điểm nổi bật kệ để đồ gắn vòi rửa mặt">
      <ul>
        <li>Gắn trực tiếp vào vòi rửa mặt, tiết kiệm diện tích.</li>
        <li>Giúp sắp xếp mỹ phẩm, đồ cá nhân gọn gàng, dễ lấy.</li>
        <li>Khung lưới thoáng, thoát nước nhanh, hạn chế đọng nước.</li>
        <li>Chất liệu kim loại sơn tĩnh điện chắc chắn, bền bỉ.</li>
        <li>Dễ lắp đặt, dễ tháo rời khi cần vệ sinh.</li>
        <li>Phù hợp với lavabo, phòng tắm, nhà vệ sinh hiện đại.</li>
      </ul>

      <h3>Thông tin sản phẩm</h3>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780674134/4_fzjtmo.jpg")}" alt="Thông tin sản phẩm kệ để đồ gắn vòi rửa mặt">
      <ul>
        <li>Tên sản phẩm: Kệ để đồ gắn vòi rửa mặt</li>
        <li>Chất liệu: Kim loại sơn tĩnh điện</li>
        <li>Màu sắc: Đen, Trắng</li>
        <li>Công dụng: Đựng mỹ phẩm, đồ dùng cá nhân, phụ kiện phòng tắm</li>
        <li>Phù hợp: Lavabo, phòng tắm, nhà vệ sinh</li>
      </ul>

      <p>Một chiếc kệ nhỏ nhưng giúp phòng tắm gọn gàng hơn rõ rệt, đồ dùng luôn trong tầm tay và không gian lavabo trông sạch đẹp, hiện đại hơn.</p>
    `
  },

  variants: [],

  combos: [
    {
      name: "1 kệ",
      quantity: 1,
      price: 169000,
      oldPrice: 169000,
      shipFee: 30000,
      note: "Phù hợp mua dùng thử"
    },
    {
      name: "Combo 2 kệ",
      quantity: 2,
      price: 299000,
      oldPrice: 299000,
      shipFee: 15000,
      note: "Phù hợp dùng cho 2 lavabo",
      tag: "Bán chạy",
      tagType: "hot"
    },
    {
      name: "Combo 3 kệ",
      quantity: 3,
      price: 399000,
      oldPrice: 399000,
      shipFee: 0,
      note: "Phù hợp mua cho gia đình",
      tag: "Tiết kiệm",
      tagType: "save"
    }
  ],

  features: [
    { icon: "💧", title: "Thoát nước nhanh", sub: "Giữ đồ dùng luôn khô ráo" },
    { icon: "✅", title: "Không cần khoan đục", sub: "Dễ lắp đặt, dễ tháo rời" },
    { icon: "🛡️", title: "Sơn tĩnh điện cao cấp", sub: "Chắc chắn, hạn chế han gỉ" }
  ],

  benefits: [],
  hooks: [],

  returnPolicy: {
    title: "Kiểm tra hàng trước khi thanh toán",
    content: "Khách được kiểm tra hàng trước khi thanh toán. Nếu sản phẩm không đúng mô tả có thể từ chối nhận hàng."
  },

  faqs: [
    {
      q: "Kệ có cần khoan tường không?",
      a: "Không. Kệ gắn trực tiếp quanh vòi rửa mặt, dễ lắp đặt và tháo rời khi cần vệ sinh."
    },
    {
      q: "Kệ dùng trong phòng tắm có bị han gỉ không?",
      a: "Sản phẩm làm từ kim loại sơn tĩnh điện cao cấp, hạn chế han gỉ khi tiếp xúc với môi trường ẩm ướt."
    },
    {
      q: "Có được kiểm tra hàng không?",
      a: "Có. Khách được kiểm tra hàng trước khi thanh toán."
    }
  ],

  reviews: {
    avgScore: 5,
    totalCount: 20,
    bars: [
      { star: 5, count: 17, percent: 85 },
      { star: 4, count: 3,  percent: 15 },
      { star: 3, count: 0,  percent: 0  },
      { star: 2, count: 0,  percent: 0  },
      { star: 1, count: 0,  percent: 0  }
    ],
    items: [
      {
        name: "Ngọc Hà",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775668042/538167066_24575065288755198_3598154797602927391_n_twatvu.jpg"),
        stars: 5,
        date: "2026-03-10 09:15",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Kệ chắc chắn, để được khá nhiều đồ. Lắp vào lavabo nhìn gọn hơn hẳn, không cần khoan đục nên rất tiện.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689899/rv1_owrqvm.png"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689899/rv1_owrqvm.png")
          }
        ],
        mediaFull: [],
        likes: 18
      },
      {
        name: "Minh Thư",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775668044/637761832_26138729435757097_3914838421337340387_n_1_vslodw.jpg"),
        stars: 5,
        date: "2026-03-08 14:30",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Nhận hàng đúng mẫu, màu đẹp, để sữa rửa mặt với kem đánh răng rất gọn. Shop đóng gói cẩn thận.",
        media: [],
        mediaFull: [],
        likes: 12
      },
      {
        name: "Thu Hương",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1777442314/496048196_10227521412714146_7242111311152812573_n_cqob7o.jpg"),
        stars: 5,
        date: "2026-03-05 20:00",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Kệ thoát nước tốt, dùng trong nhà tắm không bị đọng nước. Nhìn lavabo sạch và gọn hơn nhiều.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689901/rv2_f2ffse.png"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689901/rv2_f2ffse.png")
          }
        ],
        mediaFull: [],
        likes: 25
      },
      {
        name: "Lan Phương",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775666154/528684809_10234145965525107_1862972145806632462_n_pjnnbt.jpg"),
        stars: 5,
        date: "2026-03-02 11:00",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Lắp rất dễ, không phải khoan tường. Kệ nhỏ gọn nhưng để đồ khá thoải mái, đáng mua.",
        media: [],
        mediaFull: [],
        likes: 20
      },
      {
        name: "Mỹ Linh",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775666153/515438282_10161038595011631_4166789956527747626_n_c3roiy.jpg"),
        stars: 5,
        date: "2026-02-28 16:45",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Kệ đẹp, cứng cáp, để chai lọ skincare rất tiện. Mình mua combo cho cả 2 nhà vệ sinh.",
        media: [],
        mediaFull: [],
        likes: 30
      },
      {
        name: "Hoài An",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-24 08:20",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Phòng tắm nhà mình nhỏ nên kệ này rất hợp. Gắn lên vòi xong mặt lavabo thoáng hẳn, lấy đồ cũng tiện.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780691056/rv5_rzhpaw.png"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780691056/rv5_rzhpaw.png")
          }
        ],
        mediaFull: [],
        likes: 16
      },
      {
        name: "Thanh Vân",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-21 19:10",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Mình đặt combo 2, một cái để nhà tắm, một cái để bồn rửa phụ. Chất kệ khá chắc, không ọp ẹp.",
        media: [],
        mediaFull: [],
        likes: 22
      },
      {
        name: "Bảo Ngọc",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-02-18 13:40",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Kệ dùng ổn, để được sữa rửa mặt, bàn chải, kem đánh răng. Giao hơi chậm hơn dự kiến nhưng hàng đúng mẫu.",
        media: [],
        mediaFull: [],
        likes: 9
      },
      {
        name: "Quỳnh Chi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-15 21:05",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Rất thích phần lưới thoát nước, đồ để lên không bị ẩm như trước. Vệ sinh cũng dễ.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689902/rv3_n45k6h.png"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689902/rv3_n45k6h.png")
          }
        ],
        mediaFull: [],
        likes: 27
      },
      {
        name: "Mai Anh",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-11 10:30",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Không cần khoan nên rất hợp nhà thuê. Lắp vào chắc, nhìn phòng tắm gọn hơn nhiều.",
        media: [],
        mediaFull: [],
        likes: 14
      },
      {
        name: "Khánh Ly",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-07 17:55",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Kệ nhỏ nhưng để được nhiều đồ hơn mình nghĩ. Phần hai bên có gờ nên chai lọ không bị rơi.",
        media: [],
        mediaFull: [],
        likes: 19
      },
      {
        name: "Hồng Nhung",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-03 09:50",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Mua về cho mẹ dùng, mẹ khen gọn. Đồ rửa mặt để hết lên kệ, mặt bồn không còn bừa nữa.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689902/rv4_ofbayr.png"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689902/rv4_ofbayr.png")
          }
        ],
        mediaFull: [],
        likes: 21
      },
      {
        name: "Tú Uyên",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-01-30 15:25",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Sản phẩm đúng mô tả, màu trắng nhìn sạch. Nếu nhà có vòi quá to thì nên đo trước, còn lavabo nhà mình vừa đẹp.",
        media: [],
        mediaFull: [],
        likes: 11
      },
      {
        name: "Phương Nhi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-26 12:15",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Đóng gói chắc chắn, nhận hàng không móp méo. Kệ sơn đẹp, sờ không bị sắc cạnh.",
        media: [],
        mediaFull: [],
        likes: 15
      },
      {
        name: "Gia Hân",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-22 18:35",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Mình dùng được hơn một tuần, chưa thấy bong sơn hay han gì. Để trong nhà tắm nhìn rất gọn.",
        media: [],
        mediaFull: [],
        likes: 24
      },
      {
        name: "Diệu Linh",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-18 07:45",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Kệ hợp với nhà có nhiều đồ skincare. Mình để 4 chai nhỏ với bàn chải vẫn ổn.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780691052/ChatGPT_Image_03_23_48_6_thg_6_2026_vzaaj2.png"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780691052/ChatGPT_Image_03_23_48_6_thg_6_2026_vzaaj2.png")
          }
        ],
        mediaFull: [],
        likes: 26
      },
      {
        name: "Trúc Mai",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-15 22:05",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Ban đầu sợ kệ nhỏ, nhận hàng thấy kích thước vừa lavabo. Gắn vào nhìn khá chắc.",
        media: [],
        mediaFull: [],
        likes: 13
      },
      {
        name: "Ánh Dương",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-01-11 10:10",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Hàng ổn trong tầm giá. Dùng để sắp xếp đồ cá nhân rất tiện, nhất là chỗ bồn rửa hay bị đọng nước.",
        media: [],
        mediaFull: [],
        likes: 8
      },
      {
        name: "Yến Nhi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-08 16:00",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Kệ nhẹ nhưng không yếu. Mình thích nhất là tháo ra lau rửa nhanh, không phải cố định lên tường.",
        media: [],
        mediaFull: [],
        likes: 17
      },
      {
        name: "Thảo Vy",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-04 20:20",
        classify: "Kệ để đồ gắn vòi rửa mặt",
        match: "",
        material: "",
        content: "Mua combo 3 cho nhà mình và nhà bố mẹ. Sản phẩm hữu ích, nhìn phòng tắm sạch sẽ hơn rõ.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780691256/ChatGPT_Image_03_27_26_6_thg_6_2026_tqya7u.png"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780691256/ChatGPT_Image_03_27_26_6_thg_6_2026_tqya7u.png")
          }
        ],
        mediaFull: [],
        likes: 29
      }
    ]
  },

  policies: [
    { icon: "🚚", text: "Giao hàng toàn quốc" },
    { icon: "💵", text: "Thanh toán khi nhận hàng" },
    { icon: "✅", text: "Được kiểm tra hàng trước khi thanh toán" }
  ]
};