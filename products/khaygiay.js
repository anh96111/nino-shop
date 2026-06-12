const cldImage = (url, preset) => String(url || "").replace("/image/upload/", `/image/upload/${preset}/`);

const imgCover = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_900,h_900");
const imgContent = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_900");
const imgReview = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_260,h_260");
const imgReviewFull = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_1200");
const imgAvatar = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_face,w_80,h_80");
const videoPoster = url => String(url || "")
  .replace("/video/upload/", "/video/upload/so_0,f_auto,q_auto:good,c_fill,g_auto,w_260,h_260/")
  .replace(/\.(mp4|mov|webm)(\?.*)?$/i, ".jpg");

const DEFAULT_AVATAR = imgAvatar("https://res.cloudinary.com/dfppbfjkm/image/upload/v1780689040/Avt_m%E1%BA%B7c_%C4%91%E1%BB%8Bnh_Facebook_isxluz.webp");

const PRODUCT_CONFIG = {
  id: "khay-giay-001",
  slug: "khaygiay",
  layout: "shopee-solar",

  name: "Khay Đựng Giày Thông Minh Cao Cấp Siêu Dày – 4 Nấc Điều Chỉnh – Tiết Kiệm Không Gian",
  uiName: "Khay Đựng Giày Thông Minh Cao Cấp - Khay Đựng Giày Thông Minh Cao Cấp",
  displayName: "Khay Đựng Giày Thông Minh Cao Cấp Siêu Dày – 4 Nấc Điều Chỉnh – Tiết Kiệm Không Gian",
  shortName: "Khay Đựng Giày Thông Minh Cao Cấp Siêu Dày – 4 Nấc Điều Chỉnh – Tiết Kiệm Không Gian",
  sheetProductName: "Khay Đựng Giày Thông Minh",
  sheetName: "khay giay",
  price: 30000,
  priceUnit: "/ 1 chiếc",
  oldPrice: 30000,
  currency: "VND",
  category: "30.000đ / 1 chiếc – Khay đựng giày thông minh 4 nấc điều chỉnh tiết kiệm không gian.",

  disableWaterBottleUpsell: true,

  shipBar: "Giao hàng toàn quốc · Thanh toán khi nhận hàng · Được kiểm tra hàng",

  seo: {
    title: "Khay Đựng Giày Thông Minh Cao Cấp Siêu Dày – 4 Nấc Điều Chỉnh – Tiết Kiệm Không Gian",
    description: "Khay đựng giày thông minh nhựa PP cao cấp siêu dày, 4 nấc điều chỉnh độ cao, chống trơn, giúp tủ giày gọn gàng và tiết kiệm diện tích gấp đôi.",
    ogImage: imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285861/9_yuzscy.png")
  },

  subHeading: "Nhựa PP cao cấp siêu dày – 4 nấc điều chỉnh – xếp giày gọn gàng, tiết kiệm diện tích tủ giày gấp đôi.",
  hookTitle: "Ưu đãi hôm nay",
  soldText: "112.5k",

  sliderTags: [
    "4 nấc điều chỉnh<br>linh hoạt mọi loại giày",
    "Nhựa PP siêu dày<br>cứng cáp bền lâu",
    "Chống trơn<br>giày dép không bị rơi"
  ],

  images: [
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285862/7_qhn4lc.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285861/9_yuzscy.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285860/6_i193xj.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285860/5_c2fizr.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285861/8_hgltmp.png"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286616/10_x5usth.png")
  ],
  videos: [],

  description: {
    shortHtml: `
      <h3>Khay đựng giày thông minh CAO CẤP SIÊU DÀY – 4 nấc điều chỉnh – tiết kiệm không gian</h3>
      <p>Thay vì để giày dép lộn xộn, tốn diện tích trong tủ đựng giày, khay đựng giày thông minh CAO CẤP SIÊU DÀY này sẽ giúp bạn bảo quản giày dép cực tốt, luôn giữ được sạch sẽ, tiết kiệm diện tích và bố trí ngăn nắp.</p>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285861/9_yuzscy.png")}" alt="Khay đựng giày thông minh cao cấp siêu dày">
    `,
    fullHtml: `
      <h3>Khay đựng giày thông minh CAO CẤP SIÊU DÀY – 4 nấc điều chỉnh – tiết kiệm không gian</h3>
      <p>Thay vì để giày dép lộn xộn, tốn diện tích trong tủ đựng giày, khay đựng giày thông minh CAO CẤP SIÊU DÀY này sẽ giúp bạn bảo quản giày dép cực tốt, luôn giữ được sạch sẽ, tiết kiệm diện tích, bố trí ngăn nắp, tiện lợi và đặc biệt là tô điểm rực rỡ cho không gian tủ giày nhà bạn.</p>
      <p>Khay được thiết kế nhỏ gọn, thanh lịch, có chống trơn giúp dép không bị rơi khi sử dụng kệ.</p>

      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285862/7_qhn4lc.png")}" alt="Khay đựng giày 4 nấc điều chỉnh">

      <h3>Thông tin sản phẩm</h3>
      <ul>
        <li>Chất liệu: Nhựa 100% PP cao cấp siêu dày</li>
        <li>Số nấc điều chỉnh: 4 nấc</li>
        <li>Nấc 01: Độ cao bên trong 5cm</li>
        <li>Nấc 02: Độ cao bên trong 7cm</li>
        <li>Nấc 03: Độ cao bên trong 11cm</li>
        <li>Nấc 04: Độ cao bên trong 15cm</li>
      </ul>

      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285860/6_i193xj.png")}" alt="Chi tiết nấc điều chỉnh khay đựng giày">

      <h3>Ưu điểm nổi bật</h3>
      <ul>
        <li>Thiết kế thông minh dùng để xếp đôi giày hoặc dép chồng lên nhau, giúp tủ giày để được nhiều hơn, tiết kiệm diện tích và làm đẹp không gian.</li>
        <li>Có các đường gân nổi giúp giày không bị trượt ra ngoài.</li>
        <li>Thiết kế 2 tầng để giày, giúp xếp giày dép gọn gàng vào kệ.</li>
        <li>Bề mặt kệ có nhiều răng cưa, giúp giày bám chắc và dễ lấy ra chỉ với 1 ngón tay.</li>
        <li>Thiết kế sang trọng, thanh lịch, chất liệu cao cấp.</li>
      </ul>

      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285860/5_c2fizr.png")}" alt="Ưu điểm khay đựng giày thông minh">
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285861/8_hgltmp.png")}" alt="Khay đựng giày chống trơn">
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286616/10_x5usth.png")}" alt="Khay đựng giày tiết kiệm không gian">
    `
  },

  variants: [],

  combos: [
    
    {
      name: "Combo 20 chiếc",
      quantity: 20,
      price: 398000,
      oldPrice: 398000,
      shipFee: 0,
      note: "Phù hợp mua cho cả nhà",
      tag: "Tiết kiệm",
      tagType: "save"
    },
    {
      name: "Combo 15 chiếc",
      quantity: 15,
      price: 299000,
      oldPrice: 299000,
      shipFee: 9000,
      note: "Phù hợp cho tủ giày gia đình",
      tag: "Bán chạy",
      tagType: "hot"
    },
    {
      name: "Combo 10 chiếc",
      quantity: 10,
      price: 199000,
      oldPrice: 199000,
      shipFee: 25000,
      note: "Phù hợp mua dùng thử cho 1 tủ giày"
    }
  ],

  features: [
    { icon: "🔧", title: "4 nấc điều chỉnh", sub: "Phù hợp mọi loại giày dép, từ dép mỏng đến giày cao cổ" },
    { icon: "🛡️", title: "Nhựa PP siêu dày", sub: "Cứng cáp, bền lâu, chịu lực tốt" },
    { icon: "✅", title: "Chống trơn – chống rơi", sub: "Gân nổi và răng cưa giữ giày bám chắc" }
  ],

  benefits: [],
  hooks: [],

  returnPolicy: {
    title: "Kiểm tra hàng trước khi thanh toán",
    content: "Khách được kiểm tra hàng trước khi thanh toán. Nếu sản phẩm không đúng mô tả có thể từ chối nhận hàng."
  },

  faqs: [
    {
      q: "Khay có dùng được cho giày thể thao nam không?",
      a: "Khay phù hợp với hầu hết các loại giày thông thường. Với giày thể thao nam size lớn, chiều ngang có thể hơi khít — nên đo chiều rộng giày trước khi đặt."
    },
    {
      q: "Cách điều chỉnh nấc cao thấp như thế nào?",
      a: "Ấn chốt bên hông khay rồi kéo hoặc đẩy phần trên để chuyển sang nấc mong muốn. Lưu ý: sau khi khóa chốt thì không tháo ngược lại được."
    },
    {
      q: "Mua combo có được kiểm tra hàng không?",
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
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Wow mình bất ngờ luôn đấy dùng khá tốt dễ lắm và có thể điều chỉnh được độ cao của nó rất là đơn giản tuy nhiên mọi người nên tìm hướng dẫn xem chút vì mình cũng mất một lúc thì mới tìm ra cách để chỉnh cao độ. gần như là ấn chốt thì các bạn sẽ không gỡ ra đc nữa",
        media: [
          {
            type: "video",
            src: "https://res.cloudinary.com/dfppbfjkm/video/upload/v1781286614/vn-11110103-6khw4-lxb0f7onxot586.16000051720087151_njd1ny.mp4",
            poster: videoPoster("https://res.cloudinary.com/dfppbfjkm/video/upload/v1781286614/vn-11110103-6khw4-lxb0f7onxot586.16000051720087151_njd1ny.mp4")
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
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Siêu thích luôn. Hàng chắc chắn, nhựa dày, có nhiều khấc, màu sắc đẹp, giao hàng siêu nhanh. Sẽ mua tiếp đơn sau để bổ sung vào tủ giày",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286606/vn-11134103-7r98o-m0309qvlbc7je5_pjvqee.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286606/vn-11134103-7r98o-m0309qvlbc7je5_pjvqee.webp")
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
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Hàng chất lượng, nhận về y hình. Nên mua nha. Shop giao hàng nhanh, đóng gói cẩn thận, phản hồi nhanh, nhiệt tình. Tủ giầy tiết kiệm diện tích gấp 2 lần luôn. Sẽ quay lại ủng hộ shop.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285861/2_rwpimc.png"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781285861/2_rwpimc.png")
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
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Giao hàng nhanh chóng. Shiper thân thiệt. Sản phẩm rất đẹp. Tủ giày gọn gàng và rộng rãi thêm rất nhiều. Nghìn sao cho sản phẩm. Rất cần thiết cho chiếc tủ giày xinh đẹp",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286603/vn-11134103-820l4-mi2v9ny2k3d341_dze8bu.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286603/vn-11134103-820l4-mi2v9ny2k3d341_dze8bu.webp")
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
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Hàng giao nhanh, nguyên vẹn không nứt vỡ. Mình đã lăn tăn sợ loại mua rẻ dùng không nhựa giòn không được chắc chắn nhưng thực tế nhựa khá đàn hồi.",
        media: [
          {
            type: "video",
            src: "https://res.cloudinary.com/dfppbfjkm/video/upload/v1781286613/vn-11110103-6khwg-m1n51x1sag5vb9.default_dsejru.mp4",
            poster: videoPoster("https://res.cloudinary.com/dfppbfjkm/video/upload/v1781286613/vn-11110103-6khwg-m1n51x1sag5vb9.default_dsejru.mp4")
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
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "tiện lợi, có khay này đỡ tốn diện tích tủ giày hơn bao nhiêu. Nhưng chiều rộng khay bình thường, giày thể thao đàn ông to thì không vừa chiều ngang lắm.",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286603/vn-11134103-7ras8-m4y76trzg1q06e_wy3l4r.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286603/vn-11134103-7ras8-m4y76trzg1q06e_wy3l4r.webp")
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
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Mua tận 2 lần vì quá ưng. Shop hổ trợ khách tốt. Mình mua loại thường nhưng thấy rất oke nè",
        media: [
          {
            src: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286605/vn-11134103-7r98o-ltbwwcm2dwp086_zw8nca.webp"),
            fullSrc: imgReviewFull("https://res.cloudinary.com/dfppbfjkm/image/upload/v1781286605/vn-11134103-7r98o-ltbwwcm2dwp086_zw8nca.webp")
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
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Nhựa tốt, khá bền và đẹp, nên mua nha mọi người",
        media: [],
        mediaFull: [],
        likes: 9
      },
      {
        name: "Quỳnh Chi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-15 21:05",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Sp tốt, giúp tủ giày gọn và chứa được nhiều hơn rất nhiều. Kể cả mấy đôi giày thể thao nam cũng để được luôn nha. Mình sẽ mua thêm, hôm bữa mua thăm dò vì đọc review, giờ mua thêm để xếp hết tủ giày.",
        media: [],
        mediaFull: [],
        likes: 27
      },
      {
        name: "Mai Anh",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-11 10:30",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Sản phẩm bằng nhựa cứng khá to ... giúp giày dép được xếp gọn ...",
        media: [],
        mediaFull: [],
        likes: 14
      },
      {
        name: "Khánh Ly",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-07 17:55",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Dùng được mấy tuần rồi, chưa thấy bị gãy hay biến dạng gì. Nhựa dày thật sự chứ không phải quảng cáo.",
        media: [],
        mediaFull: [],
        likes: 19
      },
      {
        name: "Hồng Nhung",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-02-03 09:50",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Tủ giày nhà mình nhỏ mà để được nhiều hơn hẳn sau khi dùng khay này. Xếp 2 tầng rất gọn.",
        media: [],
        mediaFull: [],
        likes: 21
      },
      {
        name: "Tú Uyên",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-01-30 15:25",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Hàng ổn trong tầm giá. Chỉnh nấc cao thấp khá dễ khi đọc hướng dẫn. Mình mua combo 15 cho cả tủ giày.",
        media: [],
        mediaFull: [],
        likes: 11
      },
      {
        name: "Phương Nhi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-26 12:15",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Đóng gói chắc chắn, nhận hàng không nứt vỡ chiếc nào. Màu sắc đẹp, nhìn tủ giày sáng hơn.",
        media: [],
        mediaFull: [],
        likes: 15
      },
      {
        name: "Gia Hân",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-22 18:35",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Mua combo 20 cho nhà mới, xếp hết tủ giày luôn. Giá hợp lý mà chất lượng vượt kỳ vọng.",
        media: [],
        mediaFull: [],
        likes: 24
      },
      {
        name: "Diệu Linh",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-18 07:45",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Gân nổi bám tốt, giày không bị trượt ra dù để nấc cao nhất. Rất ưng sản phẩm này.",
        media: [],
        mediaFull: [],
        likes: 26
      },
      {
        name: "Trúc Mai",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-15 22:05",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Mua cho bố mẹ dùng, hai ông bà khen tiện. Tủ giày cũ hẹp mà giờ để thêm được gần gấp đôi.",
        media: [],
        mediaFull: [],
        likes: 13
      },
      {
        name: "Ánh Dương",
        avatar: DEFAULT_AVATAR,
        stars: 4,
        date: "2026-01-11 10:10",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Sản phẩm đúng mô tả. Nhựa cứng, không ọp ẹp. Lần sau sẽ mua thêm để xếp hết tủ.",
        media: [],
        mediaFull: [],
        likes: 8
      },
      {
        name: "Yến Nhi",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-08 16:00",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Lần đầu mua loại này, dùng thấy hiệu quả thật. Tủ giày sắp xếp gọn gàng hẳn, lấy giày nhanh hơn.",
        media: [],
        mediaFull: [],
        likes: 17
      },
      {
        name: "Thảo Vy",
        avatar: DEFAULT_AVATAR,
        stars: 5,
        date: "2026-01-04 20:20",
        classify: "Khay đựng giày thông minh",
        match: "",
        material: "",
        content: "Mua combo 20 tiết kiệm ship. Hàng giao đủ, không thiếu chiếc nào. Xếp giày gọn sạch, rất hài lòng.",
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
  ]
};
