const cldImage = (url, preset) =>
  String(url || "").replace("/image/upload/", `/image/upload/${preset}/`);

const imgCover = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_900,h_900");
const imgContent = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_900");
const imgReview = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_260,h_260");
const imgReviewFull = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_1200");
const imgAvatar = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_face,w_80,h_80");

const DEFAULT_AVATAR = imgAvatar("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689040/Avt_m%E1%BA%B7c_%C4%91%E1%BB%8Bnh_Facebook_isxluz.webp");

const PRODUCT_CONFIG = {
  id: "thiet-bi-tro-luc-001",
  slug: "thietbitroluc",
  layout: "shopee-solar",

  name: "Thiết Bị Trợ Lực Khớp Gối Dành Cho Người Lớn Tuổi Khớp Gối Yếu, Lao Động Nặng, Đi Leo Núi, Chạy Bộ",
  displayName: "Thiết Bị Trợ Lực Khớp Gối",
  shortName: "Thiết Bị Trợ Lực Khớp Gối",
  sheetProductName: "Thiết Bị Trợ Lực Khớp Gối",
  sheetName: "thiet bi tro luc",

  price: 269000,
  oldPrice: 439000,
  currency: "VND",
  category: "🏆 SP bán chạy nhất 2026",
  disableWaterBottleUpsell: true,

  shipBar: "Giao hàng toàn quốc · Thanh toán khi nhận hàng · Được kiểm tra hàng",

  seo: {
    title: "Thiết Bị Trợ Lực Khớp Gối - Giá 269K",
    description: "Thiết bị trợ lực khớp gối hỗ trợ vận động, đi lại, lao động nặng, leo núi, chạy bộ và dùng cho người lớn tuổi khớp gối yếu.",
    ogImage: imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024373/7_wheyfw.png")
  },

  subHeading: "Hỗ trợ đầu gối khi vận động, lao động nặng, đi bộ, leo núi, chạy bộ và sinh hoạt hằng ngày.",
  hookTitle: "Ưu đãi hôm nay",
  soldText: "112.5k",

  sliderTags: [
    "Trợ lực đầu gối\nhỗ trợ vận động",
    "Thoáng khí\nđeo thoải mái",
    "Dễ điều chỉnh\nphù hợp nhiều người"
  ],

  images: [
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781027785/9_j3coak.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024373/7_wheyfw.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781027785/10_ligbsh.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781027786/8_nbwtqa.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024372/2_to2xcz.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024373/3_w8joyy.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024373/5_pysqwu.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024397/4_rkg7et.png")
  ],

  videos: [],

  description: {
    shortHtml: `
### Thiết bị trợ lực khớp gối – hỗ trợ vận động nhẹ nhàng hơn

Thiết bị trợ lực khớp gối phù hợp cho người lớn tuổi, người khớp gối yếu, người thường xuyên lao động nặng, đi bộ, leo núi, chạy bộ hoặc cần hỗ trợ đầu gối khi di chuyển.

Thiết kế dây đai điều chỉnh linh hoạt, chất liệu thoáng khí, giúp đeo chắc chắn và thoải mái trong quá trình sử dụng.

`,

    fullHtml: `
### Thông tin sản phẩm

  * Tên sản phẩm: Khung Trợ Lực Khớp Gối Chính Hãng.
  * Chất liệu: Vải Mesh thoáng khí, nhẹ, nhanh khô, bền và đàn hồi tốt.
  * Ván chân ghép bằng lò xo và ốc, hỗ trợ uốn cong đầu gối.
  * Lỗ thoáng khí tạo cảm giác thoải mái khi đeo.
  * Hệ thống 2 dây đai với 3 mức điều chỉnh, phù hợp sử dụng cho nhiều người.

### Công dụng sản phẩm

#### Hỗ trợ khi tập luyện thể thao

  * Trợ lực cho phần đầu gối khi vận động.
  * Giúp tạo sức nâng đầu gối, giúp đôi chân di chuyển linh hoạt hơn.
  * Hạn chế tác động xấu lên khớp gối do tập luyện sai cách.

#### Giảm áp lực khi lao động nặng

  * Khung trợ lực có thể giảm áp lực lên đầu gối tối đa 40kg.
  * Hỗ trợ tốt cho người thường xuyên mang vác, lao động nặng.
  * Giúp đứng vững hơn, bê vác dễ dàng hơn.
  * Hạn chế đau nhức đầu gối do làm việc lâu dài.

#### Hỗ trợ cho người cao tuổi hoặc người cần phục hồi vận động

  * Phù hợp với người khớp gối yếu, đau gối, đi lại khó khăn.
  * Giúp tăng sức bền và sức chống chịu của đôi chân.
  * Tạo lực nâng hỗ trợ di chuyển dễ dàng hơn.
  * Phù hợp sử dụng khi đi bộ, leo cầu thang, tập vận động hoặc sinh hoạt hằng ngày.

`
  },

  variants: [],

  combos: [
    {
      name: "1 đôi",
      quantity: 1,
      price: 269000,
      oldPrice: 439000,
      shipFee: 25000,
      note: "Lựa chọn vừa đủ để trải nghiệm trợ lực khớp gối mỗi ngày"
    },
    {
      name: "Combo 2 đôi",
      quantity: 2,
      price: 475000,
      oldPrice: 878000,
      shipFee: 0,
      note: "Mua 2 đôi tiết kiệm hơn, phù hợp dùng luân phiên hoặc mua cho người thân",
      tag: "Bán chạy",
      tagType: "hot"
    },
    {
      name: "Combo 3 đôi",
      quantity: 3,
      price: 649000,
      oldPrice: 1317000,
      shipFee: 0,
      note: "Tiết kiệm nhất cho gia đình",
      tag: "Tiết kiệm",
      tagType: "save"
    }
  ],

  features: [
    {
      icon: "✅",
      title: "Hỗ trợ vận động",
      sub: "Giúp đầu gối linh hoạt hơn"
    },
    {
      icon: "️",
      title: "Thoáng khí",
      sub: "Đeo lâu vẫn thoải mái"
    },
    {
      icon: "",
      title: "Dễ điều chỉnh",
      sub: "Phù hợp nhiều dáng chân"
    }
  ],

  benefits: [],
  hooks: [],

  returnPolicy: {
    title: "Kiểm tra hàng trước khi thanh toán",
    content: "Khách được kiểm tra hàng trước khi thanh toán.\nNếu sản phẩm không đúng mô tả có thể từ chối nhận hàng."
  },

  faqs: [
    {
      q: "Sản phẩm dùng cho ai?",
      a: "Phù hợp cho người lớn tuổi, người khớp gối yếu, người lao động nặng, người đi bộ, leo núi, chạy bộ hoặc cần hỗ trợ đầu gối khi vận động."
    },
    {
      q: "Có điều chỉnh được độ rộng không?",
      a: "Có. Sản phẩm có hệ thống dây đai điều chỉnh linh hoạt, phù hợp với nhiều dáng chân."
    },
    {
      q: "Có được kiểm tra hàng không?",
      a: "Có.\nKhách được kiểm tra hàng trước khi thanh toán."
    }
  ],

  reviews: {
    avgScore: 5,
    totalCount: 20,
    bars: [
      { star: 5, count: 17, percent: 85 },
      { star: 4, count: 3, percent: 15 },
      { star: 3, count: 0, percent: 0 },
      { star: 2, count: 0, percent: 0 },
      { star: 1, count: 0, percent: 0 }
    ],

    items: [
      {
        name: "Ngọc Hà",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775668042/538167066_24575065288755198_3598154797602927391_n_twatvu.jpg"),
        stars: 5,
        date: "2026-03-10 09:15",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Eo ôi ông e đeo vào đi nhẹ nhàng hơn cười khoái lắm. 5 sao nha shop",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024931/2_a8uq99.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024931/2_a8uq99.webp")
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
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Mình mua đi chạy bộ cảm giác nhẹ chân, chạy rất thích k bị mỏi gối, bố mình chân yếu đeo vào đi rất tốt, sản phẩm rất đáng tiền nhé. Cho shop 5 sao",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024930/1_xkfhql.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024930/1_xkfhql.webp")
          }
        ],
        mediaFull: [],
        likes: 12
      },
      {
        name: "Thu Hương",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1777442314/496048196_10227521412714146_7242111311152812573_n_cqob7o.jpg"),
        stars: 5,
        date: "2026-03-05 20:00",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Hàng xịn nha mua tặng cho ông mình hỗ trợ đi lại do khớp gối của ông yếu, cảm giác đeo vào đi dễ hơn hẳn, 10 điểm",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024933/7_jiyujh.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024933/7_jiyujh.webp")
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
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "cvc hay di chuyển có cái này đeo vào đêm về đỡ mỏi chân hẳn nha, mọi lần về đầu gối nó mỏi nó sưng đau kinh khủng",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024933/6_uvdypq.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024933/6_uvdypq.webp")
          }
        ],
        mediaFull: [],
        likes: 20
      },
      {
        name: "Mỹ Linh",
        avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775666153/515438282_10161038595011631_4166789956527747626_n_c3roiy.jpg"),
        stars: 5,
        date: "2026-02-28 16:45",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "t làm bưng bê đeo vào đúng chân ái",
        media: [
          {
            type: "video",
            src: "https://res.cloudinary.com/dfppbfjkm/video/upload/v1781024931/22_blvwd7.mp4",
            poster: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024373/7_wheyfw.png")
          }
        ],
        mediaFull: [],
        likes: 30
      },
      {
        name: "Hoài An",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-24 08:20",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "ui mua cho ô đeo đang tập vltl ok nha, ô bs cũng hỏi mua ở đâu luôn mà",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024931/3_cvnali.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024931/3_cvnali.webp")
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
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "cảm giác đeo vào thì chạy đc vs vđv đc luôn nha haha",
        media: [
          {
            type: "video",
            src: "https://res.cloudinary.com/dfppbfjkm/video/upload/v1781024932/33_w842mt.mp4",
            poster: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781024372/2_to2xcz.png")
          }
        ],
        mediaFull: [],
        likes: 22
      },
      {
        name: "Bảo Ngọc",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-02-18 13:40",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "ok nha",
        media: [],
        mediaFull: [],
        likes: 9
      },
      {
        name: "Quỳnh Chi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-15 21:05",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Mua cho bố mình đi bộ buổi sáng, bố bảo đeo chắc chân hơn. Dây chỉnh dễ, không bị khó chịu.",
        media: [],
        mediaFull: [],
        likes: 27
      },
      {
        name: "Mai Anh",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-11 10:30",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Chất vải thoáng, đeo vào không bí như mình nghĩ. Giao hàng nhanh, đóng gói ổn.",
        media: [],
        mediaFull: [],
        likes: 14
      },
      {
        name: "Khánh Ly",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-07 17:55",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Mình mua cho mẹ dùng khi lên xuống cầu thang. Mẹ nói đeo vào cảm giác tự tin hơn khi đi lại.",
        media: [],
        mediaFull: [],
        likes: 19
      },
      {
        name: "Hồng Nhung",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-03 09:50",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Nhà có người hay đau gối nên mua thử. Hàng chắc chắn, nhìn bên ngoài đẹp hơn ảnh.",
        media: [],
        mediaFull: [],
        likes: 21
      },
      {
        name: "Tú Uyên",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-01-30 15:25",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Sản phẩm đúng mô tả, dây đeo chắc. Lúc đầu hơi lạ chân, chỉnh lại dây là ổn.",
        media: [],
        mediaFull: [],
        likes: 11
      },
      {
        name: "Phương Nhi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-26 12:15",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Mua combo cho bố mẹ, cả hai đều dùng được. Shop tư vấn nhanh, hàng nhận đúng mẫu.",
        media: [],
        mediaFull: [],
        likes: 15
      },
      {
        name: "Gia Hân",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-22 18:35",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Đeo đi làm cả buổi thấy hỗ trợ gối khá tốt. Không bị tuột nếu siết dây vừa tay.",
        media: [],
        mediaFull: [],
        likes: 24
      },
      {
        name: "Diệu Linh",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-18 07:45",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Chồng mình hay chạy bộ, đeo cái này thấy đỡ nặng gối hơn. Giá vậy là hợp lý.",
        media: [],
        mediaFull: [],
        likes: 26
      },
      {
        name: "Trúc Mai",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-15 22:05",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Hàng cầm chắc tay, lò xo trợ lực nhìn cứng cáp. Mình mua cho ông dùng thử thấy ổn.",
        media: [],
        mediaFull: [],
        likes: 13
      },
      {
        name: "Ánh Dương",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-01-11 10:10",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Dùng ổn trong tầm giá. Nên chỉnh dây vừa chân, siết quá chặt thì hơi khó chịu.",
        media: [],
        mediaFull: [],
        likes: 8
      },
      {
        name: "Yến Nhi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-08 16:00",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Mình đặt cho ba đi lại trong nhà, ba khen đỡ cảm giác yếu chân. Shop giao đúng combo.",
        media: [],
        mediaFull: [],
        likes: 17
      },
      {
        name: "Thảo Vy",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-04 20:20",
        classify: "Thiết bị trợ lực khớp gối",
        match: "",
        material: "",
        content: "Mua combo 3 cho nhà dùng. Sản phẩm chắc, dây đai dễ chỉnh, người lớn tuổi dùng cũng đơn giản.",
        media: [],
        mediaFull: [],
        likes: 29
      }
    ]
  },

  policies: [
    { icon: "", text: "Giao hàng toàn quốc" },
    { icon: "", text: "Thanh toán khi nhận hàng" },
    { icon: "✅", text: "Được kiểm tra hàng trước khi thanh toán" }
  ]
};