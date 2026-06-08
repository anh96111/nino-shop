const cldImage = (url, preset) => String(url || "").replace("/image/upload/", `/image/upload/${preset}/`);

const imgCover = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_900,h_900");
const imgContent = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_900");
const imgReview = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_260,h_260");
const imgReviewFull = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_1200");
const imgAvatar = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_face,w_80,h_80");

const DEFAULT_AVATAR = imgAvatar("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689040/Avt_m%E1%BA%B7c_%C4%91%E1%BB%8Bnh_Facebook_isxluz.webp");

const PRODUCT_CONFIG = {
  id: "ban-hoc-chong-gu-chong-can-001",
  slug: "ban",
  layout: "shopee-solar",

  name: "Bàn học ĐIỀU CHỈNH TƯ THẾ ngồi cho bé - CHỐNG CẬN - CHỐNG GÙ - Chuẩn Nhật Bản",
  uiName: "Bàn học điều chỉnh tư thế ngồi cho bé",
  displayName: "Bàn học ĐIỀU CHỈNH TƯ THẾ ngồi cho bé - CHỐNG CẬN - CHỐNG GÙ - Chuẩn Nhật Bản",
  shortName: "Bàn học điều chỉnh tư thế ngồi cho bé",
  sheetProductName: "Bàn học chống cận chống gù",
  sheetName: "ban",
  price: 385000,
  oldPrice: 485000,
  currency: "VND",
  category: "Bàn học điều chỉnh tư thế cho bé",

  disableWaterBottleUpsell: true,

  shipBar: "Miễn phí vận chuyển · Thanh toán khi nhận hàng · Được kiểm tra hàng",

  extraBagGift: {
    enabled: true,
    image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_800,f_webp,q_auto/v1779385612/x4_irdvni.jpg",
    initialStock: 14
  },

  seo: {
    title: "Bàn học điều chỉnh tư thế ngồi cho bé - Chống cận, chống gù - Giá 385K",
    description: "Bàn học điều chỉnh tư thế ngồi cho bé, mặt bàn nghiêng 12 độ, giá đỡ sách điều chỉnh linh hoạt, hỗ trợ bé ngồi học đúng tư thế, hạn chế cúi đầu khi học bài.",
    ogImage: imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780911896/12_xlwggl.png")
  },

  subHeading: "Mặt bàn nghiêng 12 độ, giá đỡ sách điều chỉnh linh hoạt, hỗ trợ bé ngồi học đúng tư thế mỗi ngày.",
  hookTitle: "Ưu đãi hôm nay",
  soldText: "112.7k",

  sliderTags: [
    "Mặt bàn nghiêng<br>12 độ",
    "Điều chỉnh tư thế<br>ngồi học",
    "Tặng túi học thêm<br>khi mua combo"
  ],

  images: [
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780911896/12_xlwggl.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780935166/1_nibmn1.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780935169/2_lx3uo6.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780935168/3_v2wzqi.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780911895/2_m5bjkb.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780911895/10_wdnwlw.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780911895/4_a58nw7.png")
  ],

  videos: [],

  description: {
    shortHtml: `
      <h3>THÔNG TIN SẢN PHẨM</h3>
      <p><strong>Bàn học điều chỉnh tư thế ngồi cho bé</strong> giúp bé ngồi học đúng khoảng cách, hạn chế cúi đầu quá thấp khi viết bài hoặc đọc sách.</p>
      <p>Thiết kế mặt bàn nghiêng khoa học, kết hợp giá đỡ sách có thể điều chỉnh, phù hợp cho nhiều hoạt động học tập hằng ngày của bé.</p>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780935166/1_nibmn1.png")}" alt="Bàn học điều chỉnh tư thế ngồi cho bé">
    `,

    fullHtml: `
      <h3>THÔNG SỐ KĨ THUẬT</h3>

      <p><strong>Thiết kế công thái học giúp hỗ trợ chống cận - chống gù.</strong></p>
      <p>Sản phẩm hỗ trợ bé giữ khoảng cách ngồi học hợp lý, hạn chế tình trạng cúi sát mặt xuống bàn khi viết bài, đọc sách hoặc làm bài tập.</p>

      <ul>
        <li>Thiết kế công thái học, hỗ trợ bé ngồi học đúng tư thế.</li>
        <li>Dùng được trong nhiều hoạt động học tập của bé như viết bài, đọc sách, vẽ tranh.</li>
        <li>Được nhiều phụ huynh lựa chọn nhờ thiết kế khoa học và dễ sử dụng.</li>
        <li>Dáng ngồi thoải mái, hạn chế mỏi cổ, mỏi vai khi học lâu.</li>
        <li>Dùng được cho nhiều lứa tuổi khác nhau.</li>
      </ul>

      <h3>THÔNG SỐ KỸ THUẬT</h3>

      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780935168/3_v2wzqi.png")}" alt="Thông số kỹ thuật bàn học điều chỉnh tư thế">

      <ul>
        <li>Kích thước mặt bàn: 37 x 47 cm.</li>
        <li>Kích thước giá đỡ sách: 21 x 30.5 cm.</li>
        <li>Màu sắc: Xanh Dương.</li>
        <li>Chất liệu: Nhựa ABS nguyên sinh an toàn cho trẻ.</li>
        <li>Giá kẹp sách có thể điều chỉnh độ nghiêng phù hợp với trẻ.</li>
        <li>Giá đỡ chống gù có thể điều chỉnh chiều cao từ 9.5 - 15cm.</li>
        <li>Sản phẩm bàn học thông minh 2 trong 1 giúp điều chỉnh tư thế ngồi cho bé, chuẩn khoa học về khoảng cách ngồi và góc nhìn.</li>
      </ul>

      <h3>HỖ TRỢ BÉ NGỒI HỌC ĐÚNG TƯ THẾ</h3>
      <p>Mặt bàn nghiêng 12 độ giúp bé không cần cúi đầu quá thấp khi viết bài. Nhờ đó bé có thể duy trì dáng ngồi thoải mái hơn trong quá trình học.</p>

      <h3>GIÁ ĐỠ SÁCH ĐIỀU CHỈNH LINH HOẠT</h3>
      <p>Giá đỡ sách giúp bé đặt sách, vở hoặc tài liệu học tập ngay phía trước tầm nhìn, thuận tiện khi đọc bài, chép bài và luyện viết.</p>

      <h3>PHÙ HỢP CHO GÓC HỌC TẬP TẠI NHÀ</h3>
      <p>Bàn có kích thước gọn, dễ đặt trên bàn học, bàn làm việc hoặc góc học tập riêng của bé. Phù hợp cho học sinh tiểu học và các bé đang cần rèn tư thế ngồi học đúng.</p>
    `
  },

  variants: [
    {
      type: "extra_bag_color",
      label: "Màu túi học thêm",
      options: [
        {
          name: "Xanh",
          image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_500,f_webp,q_auto/v1779385612/x4_irdvni.jpg"
        },
        {
          name: "Nâu",
          image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_500,f_webp,q_auto/v1779385612/x3_z5poxu.jpg"
        },
        {
          name: "Hồng",
          image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_500,f_webp,q_auto/v1779385612/c1_cxneiz.jpg"
        },
        {
          name: "Navy",
          image: "https://res.cloudinary.com/dfppbfjkm/image/upload/w_500,f_webp,q_auto/v1779385611/x2_fatdti.jpg"
        }
      ]
    }
  ],

  combos: [
    {
      name: "1 bàn",
      quantity: 1,
      price: 385000,
      oldPrice: 485000,
      shipFee: 0,
      note: "Miễn phí vận chuyển",
      showExtraBagVariant: false
    },
    {
      name: "Combo 2 bàn",
      quantity: 2,
      price: 699000,
      oldPrice: 970000,
      shipFee: 0,
      note: "Miễn phí vận chuyển, tặng túi học thêm",
      tag: "Bán chạy",
      tagType: "hot",
      showExtraBagVariant: true,
      giftText: "Tặng túi học thêm"
    },
    {
      name: "Combo 3 bàn",
      quantity: 3,
      price: 999000,
      oldPrice: 1455000,
      shipFee: 0,
      note: "Tặng 1 túi học thêm",
      tag: "Tiết kiệm",
      tagType: "save",
      showExtraBagVariant: true,
      giftText: "Tặng 1 túi học thêm"
    }
  ],

  features: [
    { icon: "✅", title: "Mặt bàn nghiêng 12 độ", sub: "Hỗ trợ bé hạn chế cúi đầu khi học" },
    { icon: "🛡️", title: "Nhựa ABS nguyên sinh", sub: "An toàn, chắc chắn, dễ vệ sinh" },
    { icon: "🎁", title: "Mua combo có quà tặng", sub: "Tặng túi học thêm theo combo ưu đãi" }
  ],

  benefits: [],
  hooks: [],

  returnPolicy: {
    title: "Kiểm tra hàng trước khi thanh toán",
    content: "Khách được kiểm tra hàng trước khi thanh toán. Nếu sản phẩm không đúng mô tả có thể từ chối nhận hàng."
  },

  faqs: [
    {
      q: "Bàn có phù hợp cho bé tiểu học không?",
      a: "Có. Bàn phù hợp cho bé ngồi viết bài, đọc sách, vẽ tranh và học tập hằng ngày tại nhà."
    },
    {
      q: "Mặt bàn nghiêng có khó viết không?",
      a: "Không. Mặt bàn nghiêng 12 độ giúp bé hạn chế cúi đầu quá thấp, vẫn thuận tiện khi viết bài và đọc sách."
    },
    {
      q: "Combo có được tặng túi học thêm không?",
      a: "Có. Combo 2 bàn và combo 3 bàn có tặng túi học thêm theo chương trình ưu đãi."
    },
    {
      q: "Có được chọn màu túi học thêm không?",
      a: "Có. Khi chọn combo có quà tặng, khách có thể chọn màu túi học thêm theo các màu đang còn hàng."
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
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Từ khi mua bàn này, con mình thấy ngồi học thoải mái hơn. Mặt bàn nghiêng nên viết sẽ không bị mỏi tay và đỡ phải cúi xuống nhiều hơn.",
        media: [],
        mediaFull: [],
        likes: 18
      },
      {
        name: "Minh Thư",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775668044/637761832_26138729435757097_3914838421337340387_n_1_vslodw.jpg"),
        stars: 5,
        date: "2026-03-08 14:30",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Sản phẩm đóng hộp cực kì chắc chắn. Kệ ưng lắm, rất tốt cho con ngồi học. Cho shop 5 sao nhé.",
        media: [],
        mediaFull: [],
        likes: 12
      },
      {
        name: "Thu Hương",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1777442314/496048196_10227521412714146_7242111311152812573_n_cqob7o.jpg"),
        stars: 5,
        date: "2026-03-05 20:00",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Mặt bàn nghiêng 12 độ giúp bé nhà mình không phải cúi đầu nhiều khi bé viết bài, ngoài ra có thêm giá để sách có thể điều chỉnh rất tiện lợi.",
        media: [],
        mediaFull: [],
        likes: 25
      },
      {
        name: "Lan Phương",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775666154/528684809_10234145965525107_1862972145806632462_n_pjnnbt.jpg"),
        stars: 5,
        date: "2026-03-02 11:00",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Thiết kế của mặt bàn rất hợp lý và khoa học nên có thể giúp con tôi hình thành thói quen ngồi học đúng tư thế.",
        media: [],
        mediaFull: [],
        likes: 20
      },
      {
        name: "Mỹ Linh",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775666153/515438282_10161038595011631_4166789956527747626_n_c3roiy.jpg"),
        stars: 5,
        date: "2026-02-28 16:45",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Lần thứ 2 mua món này của shop rùi, chất lượng tốt, giá cả rất hợp lý, nhờ shop ship gấp làm quà sinh nhật cho đứa cháu là shop ok luôn 👌 10 điểm cho shop 😊",
        media: [],
        mediaFull: [],
        likes: 30
      },
      {
        name: "Hoài An",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-24 08:20",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Sản phẩm chuẩn. Chất lượng tốt. Giao cũng khá nhanh. Hàng nội địa tq ok phết. Xài đc hữu ích.",
        media: [],
        mediaFull: [],
        likes: 16
      },
      {
        name: "Thanh Vân",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-21 19:10",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Hàng ngon bổ rẻ, shipper nhiệt tình vui tính, lại còn được khuyến mại. Cảm ơn shop nhiều nhé. He he",
        media: [],
        mediaFull: [],
        likes: 22
      },
      {
        name: "Bảo Ngọc",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-02-18 13:40",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Hàng rất đúng với quảng cáo, màu sắc rất đẹp, chất lượng sản phẩm rất tốt, tôi rất hài lòng.",
        media: [],
        mediaFull: [],
        likes: 9
      },
      {
        name: "Quỳnh Chi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-15 21:05",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Sản phẩm tuyêt vòi shop đóng gói kĩ giao hàng nhanh sẽ ung ho shop.",
        media: [],
        mediaFull: [],
        likes: 27
      },
      {
        name: "Mai Anh",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-11 10:30",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Ok Minh da nhan được hang rồi nhé ung ho shop nua nếu minh mua lai nua nhé hihi.",
        media: [],
        mediaFull: [],
        likes: 14
      },
      {
        name: "Khánh Ly",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-07 17:55",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Bàn nhìn ngoài đẹp hơn ảnh, nhựa dày dặn, bé nhà mình rất thích cái phần để sách phía trước. Ngồi học thấy ngay ngắn hơn.",
        media: [],
        mediaFull: [],
        likes: 19
      },
      {
        name: "Hồng Nhung",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-03 09:50",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Mình mua cho bé lớp 2 dùng, đặt lên bàn học cũ rất vừa. Bé viết bài không còn nằm bò ra bàn như trước nữa.",
        media: [],
        mediaFull: [],
        likes: 21
      },
      {
        name: "Tú Uyên",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-01-30 15:25",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Hàng dùng ổn trong tầm giá, đóng gói chắc. Giá đỡ sách chỉnh được nên bé đọc bài tiện hơn. Giao hơi lâu xíu nhưng nhận hàng ok.",
        media: [],
        mediaFull: [],
        likes: 11
      },
      {
        name: "Phương Nhi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-26 12:15",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Bàn chắc chắn, không bị ọp ẹp. Mặt bàn nghiêng vừa phải, bé viết không bị trượt vở, nhìn khá khoa học.",
        media: [],
        mediaFull: [],
        likes: 15
      },
      {
        name: "Gia Hân",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-22 18:35",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Mua combo 2 cho hai bé, được tặng thêm túi học thêm nên thấy khá hời. Shop tư vấn nhanh, hàng đúng mẫu.",
        media: [],
        mediaFull: [],
        likes: 24
      },
      {
        name: "Diệu Linh",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-18 07:45",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Bé nhà mình hay cúi sát vở, dùng cái bàn này thấy đỡ hơn. Phần kê sách tiện, vừa học bài vừa nhìn sách dễ hơn.",
        media: [],
        mediaFull: [],
        likes: 26
      },
      {
        name: "Trúc Mai",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-15 22:05",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Hàng nhận đúng như quảng cáo. Màu xanh sạch đẹp, các góc bo mềm nên mình yên tâm cho con dùng.",
        media: [],
        mediaFull: [],
        likes: 13
      },
      {
        name: "Ánh Dương",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-01-11 10:10",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Sản phẩm hữu ích, nhất là với bé mới vào lớp 1. Bàn không quá to, để trên bàn học hiện tại vẫn gọn.",
        media: [],
        mediaFull: [],
        likes: 8
      },
      {
        name: "Yến Nhi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-08 16:00",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Mình thấy phần điều chỉnh chiều cao khá tiện, bé ngồi học nhìn đỡ gù lưng hơn. Chất liệu nhựa cũng dễ lau.",
        media: [],
        mediaFull: [],
        likes: 17
      },
      {
        name: "Thảo Vy",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-04 20:20",
        classify: "Bàn học điều chỉnh tư thế",
        match: "",
        material: "",
        content: "Đặt combo 3 chia cho mấy cháu trong nhà. Hàng đóng gói cẩn thận, đủ quà tặng, bé nào cũng thích.",
        media: [],
        mediaFull: [],
        likes: 29
      }
    ]
  },

    policies: [
        { icon: "🚚", text: "Giao hàng toàn quốc" },
        { icon: "💵", text: "Thanh toán khi nhận hàng" },
        { icon: "✅", text: "Được kiểm tra hàng trước khi thanh toán" }
    ],

    orderNotification: {
        enabled: true,
        subText: "Vừa đặt hàng trên Nino Việt Nam",
        items: [
        "1 bàn học điều chỉnh tư thế",
        "Combo 2 bàn học điều chỉnh tư thế",
        "Combo 3 bàn học điều chỉnh tư thế"
        ]
    }
};