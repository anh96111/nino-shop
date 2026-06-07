const cldImage = (url, preset) =>
  String(url || "").replace("/image/upload/", `/image/upload/${preset}/`);

const imgCover = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_900,h_900");
const imgContent = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_900");
const imgReview = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_260,h_260");
const imgReviewFull = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_1200");
const imgAvatar = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_face,w_80,h_80");

const DEFAULT_AVATAR = imgAvatar(
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689040/Avt_m%E1%BA%B7c_%C4%91%E1%BB%8Bnh_Facebook_isxluz.webp"
);

const PRODUCT_NAME = "Ống nối vòi nước linh hoạt không han rỉ 50cm + tặng đầu nối";
const REVIEW_CLASSIFY = "Ống nối vòi nước linh hoạt 50cm";

const PRODUCT_IMAGES = [
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780852178/ChatGPT_Image_00_09_29_8_thg_6_2026_b6ae6d.png",
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780855120/ChatGPT_Image_00_57_00_8_thg_6_2026_onfjn2.png",
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780851448/ChatGPT_Image_23_09_10_7_thg_6_2026_skjspo.png",
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780851449/ChatGPT_Image_23_49_42_7_thg_6_2026_pxlnq9.png",
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780851448/ChatGPT_Image_23_16_07_7_thg_6_2026_svcino.png",
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780851448/ChatGPT_Image_23_52_38_7_thg_6_2026_nf3zr6.png",
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780851449/ChatGPT_Image_23_47_37_7_thg_6_2026_a6ywvi.png"
];

const DESC_IMAGE_1 = imgContent(
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780851449/ChatGPT_Image_23_47_37_7_thg_6_2026_a6ywvi.png"
);

const DESC_IMAGE_2 = imgContent(
  "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780852178/ChatGPT_Image_00_09_29_8_thg_6_2026_b6ae6d.png"
);

const REVIEW_CONTENTS = [
  `sản phẩm rất tốt và hiệu quả.nhà tôi dùng máy tăng áp nên áp lực nước khi mở vòi rất căng nên bị bắn.lắp sp này vào hạn chế bị bắn nước.mà lại có đầu lọc cặn bẩn.cảm ơn shop❤️❤️❤️`,
  `Lắp vòi này dùng thấy tiện lợi lắm nha, vòi kéo dài ra được các ngóc ngách ở bồn rửa bát, tia nước phun ra mạnh. Giá ok . Cho 5 sao`,
  `Hàng đẹp, giao nhanh dễ lắp đặt sử dụng, hàng đúng mới tả, giá cả hợp lý, sẽ ủng hộ shop lần sau`,
  `Ống có đầu nối rất tiện.có thể chỉnh theo vòi nhà mình để vừa.lắp cũng dễ.mình phụ nữ cũng lắp được.dùng vòi nối này thì nước không bị bắn.có thể chỉnh linh hoạt theo ý mình nữa.nên mua mọi người ạ.`,
  `Đúng tìm được cái vòi lắp ưng í, chứ lúc trước vòi nước mình mua mỗi lần làm gì xả đều bị bắn tung tóe rất khó chịu, nay mua đc em này về dùng k bị bắn nữa 🥰🥰`,
  `Vòi nước bẻ qua lại tiện dụng, nước ra đều và không ồn ào như trước khi gắn vòi vào. Nói chung là ok!`,
  `Tiện lắm nha mn, nhà mình có cái vòi nước ở chỗ sàn nước bên dưới bàn bếp. Lúc trước không biết có cái này nên dùng tạm cái ống nhựa bất tiện vô cùng. Hàng chắc chắn lắm , nên mua nha mn. Tặng shop 5*`,
  `Mình đã nhận được hàng rồi nhé mình rất ưng í, sản phẩm dễ lắp và tiện ích. Mọi người nên mua nha`,
  `Shop uy tín, giao hàng nhanh, đủ số lượng và chất lượng y chan đã quảng cáo. Xin cảm ơn và hẹn gặp lại những đơn hàng sau ạ. Xin chào.`,
  `Nhận rồi ,chưa dùng nhưng cầm thấy chắc chắn, uốn lượn dể dàng .Hy vọng dùng được dài lâu. Với giá tiền này thì cảm thấy rất rẻ. 👍👍👍`,
  `Mình lắp ở bồn rửa bát, dùng tiện hơn hẳn. Vòi mềm dễ chỉnh hướng, rửa quanh thành bồn cũng đỡ phải với tay nhiều.`,
  `Sản phẩm đúng như hình, đầu nối lắp vừa vòi nhà mình. Nước ra đều, không bị tóe mạnh như vòi cũ.`,
  `Đóng gói ổn, nhận hàng không bị móp méo. Ống cầm chắc tay, uốn qua lại thấy khá linh hoạt.`,
  `Mua thử 1 cái về lắp bồn rửa chén, dùng được nên đặt thêm cho nhà mẹ. Giá vậy là hợp lý.`,
  `Lắp không khó, mình tự làm vài phút là xong. Có đầu nối đi kèm nên cũng yên tâm hơn.`,
  `Dùng mấy hôm thấy ổn, nhất là lúc rửa nồi hoặc rửa góc bồn. Vòi kéo hướng nào cũng được.`,
  `Hàng giao đúng mẫu, nhìn bên ngoài chắc hơn mình nghĩ. Nước chảy êm, không bị văng lung tung.`,
  `Nhà mình vòi hơi ngắn, lắp thêm cái này vào thấy tiện hơn nhiều. Rửa đồ không còn bất tiện như trước.`,
  `Ống mềm nhưng không bị lỏng lẻo. Lắp xong nhìn gọn, dùng trong bếp rất hợp.`,
  `Mình mua combo cho 2 bồn rửa, cả hai đều lắp được. Shop giao nhanh, hàng đúng số lượng.`
];

const REVIEW_MEDIA = [
  [
    
  ],
  [
    "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780851447/vn-11134103-7r98o-lpvisltrjumq37_ebxk47.webp"
  ],
  [
    "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780854402/vn-11134103-7ras8-m1qy00sces3j31_sgeyjv.webp",
    "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780854402/vn-11134103-7ras8-m1qqgluoy8nnf0_mf0g77.webp"
  ],
  [
    "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780854511/vn-11134103-820l4-microx660g754e_oxnub1.webp"
  ],
  [
    "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780854511/vn-11134103-81ztc-mohrfpawscula3_c4bubw.webp"
  ],
  [
    "https://res.cloudinary.com/dfppbfjkm/image/upload/v1780854513/vn-11134103-7r98o-lp639tb4vg3y5c_ntpvzs.webp"
  ],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  []
];

const REVIEW_USERS = [
  {
    name: "Ngọc Hà",
    avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775668042/538167066_24575065288755198_3598154797602927391_n_twatvu.jpg"),
    stars: 5,
    date: "2026-03-10 09:15",
    likes: 18
  },
  {
    name: "Minh Thư",
    avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775668044/637761832_26138729435757097_3914838421337340387_n_1_vslodw.jpg"),
    stars: 5,
    date: "2026-03-08 14:30",
    likes: 12
  },
  {
    name: "Thu Hương",
    avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1777442314/496048196_10227521412714146_7242111311152812573_n_cqob7o.jpg"),
    stars: 5,
    date: "2026-03-05 20:00",
    likes: 25
  },
  {
    name: "Lan Phương",
    avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775666154/528684809_10234145965525107_1862972145806632462_n_pjnnbt.jpg"),
    stars: 5,
    date: "2026-03-02 11:00",
    likes: 20
  },
  {
    name: "Mỹ Linh",
    avatar: imgAvatar("https://res.cloudinary.com/dezednxpz/image/upload/v1775666153/515438282_10161038595011631_4166789956527747626_n_c3roiy.jpg"),
    stars: 5,
    date: "2026-02-28 16:45",
    likes: 30
  },
  {
    name: "Hoài An",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-02-24 08:20",
    likes: 16
  },
  {
    name: "Thanh Vân",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-02-21 19:10",
    likes: 22
  },
  {
    name: "Bảo Ngọc",
    avatar: DEFAULT_AVATAR,
    stars: 4,
    date: "2026-02-18 13:40",
    likes: 9
  },
  {
    name: "Quỳnh Chi",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-02-15 21:05",
    likes: 27
  },
  {
    name: "Mai Anh",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-02-11 10:30",
    likes: 14
  },
  {
    name: "Khánh Ly",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-02-07 17:55",
    likes: 19
  },
  {
    name: "Hồng Nhung",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-02-03 09:50",
    likes: 21
  },
  {
    name: "Tú Uyên",
    avatar: DEFAULT_AVATAR,
    stars: 4,
    date: "2026-01-30 15:25",
    likes: 11
  },
  {
    name: "Phương Nhi",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-01-26 12:15",
    likes: 15
  },
  {
    name: "Gia Hân",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-01-22 18:35",
    likes: 24
  },
  {
    name: "Diệu Linh",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-01-18 07:45",
    likes: 26
  },
  {
    name: "Trúc Mai",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-01-15 22:05",
    likes: 13
  },
  {
    name: "Ánh Dương",
    avatar: DEFAULT_AVATAR,
    stars: 4,
    date: "2026-01-11 10:10",
    likes: 8
  },
  {
    name: "Yến Nhi",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-01-08 16:00",
    likes: 17
  },
  {
    name: "Thảo Vy",
    avatar: DEFAULT_AVATAR,
    stars: 5,
    date: "2026-01-04 20:20",
    likes: 29
  }
];

const PRODUCT_CONFIG = {
  id: "voi-nuoc-001",
  slug: "voi",
  layout: "shopee-solar",

  name: PRODUCT_NAME,
  displayName: PRODUCT_NAME,
  shortName: PRODUCT_NAME,
  sheetProductName: PRODUCT_NAME,
  sheetName: "voi",

  price: 120000,
  oldPrice: 120000,
  currency: "VND",
  category: "Ống nối vòi nước linh hoạt 50cm tặng đầu nối đa năng.",
  disableWaterBottleUpsell: true,

  shipBar: "Giao hàng toàn quốc · Thanh toán khi nhận hàng · Được kiểm tra hàng",

  seo: {
    title: "Ống nối vòi nước linh hoạt không han rỉ 50cm + tặng đầu nối - Giá 120K",
    description:
      "Ống nối vòi nước linh hoạt dài 50cm, xoay 360 độ, tăng áp lực nước, hạn chế bắn nước và tặng đầu nối đa năng. Giao toàn quốc, COD.",
    ogImage: imgCover(PRODUCT_IMAGES[0])
  },

  subHeading: "Ống nối vòi nước dài 50cm, xoay 360°, linh hoạt mọi hướng, dễ lắp đặt và tặng kèm đầu nối đa năng.",
  hookTitle: "Ưu đãi hôm nay",
  soldText: "112.5k",

  sliderTags: [
    "Xoay 360°\nlinh hoạt mọi hướng",
    "Tăng áp lực nước\nrửa sạch nhanh",
    "Tặng đầu nối\nlắp đặt dễ dàng"
  ],

  images: PRODUCT_IMAGES.map(imgCover),
  videos: [],

  description: {
    shortHtml: `
      <h3>Ống nối vòi nước linh hoạt 50cm – hạn chế bắn nước, dễ dùng mỗi ngày</h3>
      <p>Ống nối vòi nước linh hoạt xoay 360 theo mọi hướng, vòi nước dài 50cm tặng kèm nối đa năng.</p>
      <p>Thiết kế uốn dẻo, dễ điều chỉnh hướng nước, giúp việc rửa rau, rửa bát và vệ sinh bồn rửa thuận tiện hơn.</p>
    `,
    fullHtml: `
      <p>Ống nối vòi nước linh hoạt xoay 360 theo mọi hướng, vòi nước dài 50cm tặng kèm nối đa năng.</p>

      <ul>
        <li>Ống nối dài vòi nước có cấu trúc có thể uốn dẻo 360 độ thông minh và linh hoạt thực sự đem đến công dụng tuyệt vời cho người sử dụng.</li>
        <li>Dễ dàng biến vòi nước thông thường dài ra giúp dễ dàng vệ sinh hay lau chùi mọi ngóc ngách của bồn rửa nhà bạn.</li>
      </ul>

      <img
        src="${DESC_IMAGE_1}"
        alt="Ống nối vòi nước linh hoạt dễ vệ sinh bồn rửa"
        loading="lazy"
        style="display:block;width:100%;height:auto;border-radius:14px;margin:14px 0;"
      >

      <ul>
        <li>Chất liệu: silicone + kim loại.</li>
        <li>Dễ dàng sử dụng và lắp đặt.</li>
        <li>Tăng áp lực nước tăng cường động lượng nước, làm sạch nhanh hơn.</li>
        <li>Xoay được 360°: dễ dàng điều chỉnh dòng nước theo ý muốn.</li>
        <li>Dễ dàng lắp đặt với đầu vòi phi ren ngoài 20 mm.</li>
      </ul>

      <img
        src="${DESC_IMAGE_2}"
        alt="Ống nối vòi nước tặng kèm đầu nối đa năng"
        loading="lazy"
        style="display:block;width:100%;height:auto;border-radius:14px;margin:14px 0;"
      >

      <ul>
        <li>Shop tặng kèm đầu nối đa năng để dùng cho các vòi không có ren hoặc ren không vừa.</li>
        <li>Chất liệu bền đẹp, dễ dàng vệ sinh.</li>
      </ul>

      <h3>Chi tiết sản phẩm</h3>

      <ul>
        <li>Kích thước: dài 50 cm.</li>
      </ul>
    `
  },

  variants: [],

  combos: [
    {
      name: "1 vòi",
      quantity: 1,
      price: 120000,
      oldPrice: 120000,
      shipFee: 30000,
      note: "Phù hợp mua dùng thử"
    },
    {
      name: "Combo 2 vòi",
      quantity: 2,
      price: 199000,
      oldPrice: 199000,
      shipFee: 10000,
      note: "Phù hợp dùng cho nhiều vị trí trong nhà",
      tag: "Bán chạy",
      tagType: "hot"
    },
    {
      name: "Combo 3 vòi",
      quantity: 3,
      price: 265000,
      oldPrice: 265000,
      shipFee: 0,
      note: "Phù hợp mua cho gia đình",
      tag: "Tiết kiệm",
      tagType: "save"
    }
  ],

  features: [
    {
      icon: "",
      title: "Xoay 360° linh hoạt",
      sub: "Dễ chỉnh hướng nước theo ý muốn"
    },
    {
      icon: "✅",
      title: "Tăng áp lực nước",
      sub: "Rửa sạch nhanh, hạn chế bắn nước"
    },
    {
      icon: "✅",
      title: "Tặng đầu nối đa năng",
      sub: "Dễ lắp với nhiều kiểu vòi khác nhau"
    }
  ],

  benefits: [],
  hooks: [],

  returnPolicy: {
    title: "Kiểm tra hàng trước khi thanh toán",
    content: `Khách được kiểm tra hàng trước khi thanh toán.
Nếu sản phẩm không đúng mô tả có thể từ chối nhận hàng.`
  },

  faqs: [
    {
      q: "Sản phẩm có lắp được cho mọi loại vòi không?",
      a: "Sản phẩm phù hợp với đầu vòi phi ren ngoài 20 mm. Shop có tặng kèm đầu nối đa năng để dùng cho các vòi không có ren hoặc ren không vừa."
    },
    {
      q: "Ống nối có xoay linh hoạt được không?",
      a: "Có. Ống nối có thể uốn dẻo và xoay 360 độ, giúp điều chỉnh hướng nước theo nhu cầu sử dụng."
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
      { star: 4, count: 3, percent: 15 },
      { star: 3, count: 0, percent: 0 },
      { star: 2, count: 0, percent: 0 },
      { star: 1, count: 0, percent: 0 }
    ],
    items: REVIEW_USERS.map((item, index) => ({
        ...item,
        classify: REVIEW_CLASSIFY,
        match: "",
        material: "",
        content: REVIEW_CONTENTS[index],
        media: (REVIEW_MEDIA[index] || []).map(src => ({
            src: imgReview(src),
            fullSrc: imgReviewFull(src)
        })),
        mediaFull: []
        }))
  },

  policies: [
    { icon: "", text: "Giao hàng toàn quốc" },
    { icon: "", text: "Thanh toán khi nhận hàng" },
    { icon: "✅", text: "Được kiểm tra hàng trước khi thanh toán" }
  ]
};