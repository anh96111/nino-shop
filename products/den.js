const cldImage = (url, preset) => String(url || "").replace("/image/upload/", `/image/upload/${preset}/`);

const imgCover = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_900,h_900");
const imgContent = url => cldImage(url, "f_auto,q_auto:good,c_limit,w_900");
const imgReview = url => cldImage(url, "f_auto,q_auto:good,c_fill,g_auto,w_260,h_260");

const PRODUCT_CONFIG = {
  id: "den-nang-luong-001",
  slug: "den",
  layout: "shopee-solar",

  name: "Đèn Tích Điện Năng Lượng Mặt Trời",
  displayName: "Đèn Tích Điện Năng Lượng Mặt Trời",
  shortName: "Đèn Tích Điện Năng Lượng Mặt Trời",
  sheetProductName: "Đèn Tích Điện Năng Lượng Mặt Trời",
  sheetName: "den",
  price: 145000,
  oldPrice: 199000,
  currency: "VND",
  category: "Đèn năng lượng mặt trời cảm biến ánh sáng.",

  disableWaterBottleUpsell: true,

  shipBar: "Giao hàng toàn quốc · Thanh toán khi nhận hàng · Được kiểm tra hàng",

  seo: {
    title: "Đèn Tích Điện Năng Lượng Mặt Trời - Giá 145K",
    description: "Đèn tích điện năng lượng mặt trời 40W, tự sạc ban ngày, tự sáng ban đêm, phù hợp sân vườn, cổng, ban công.",
    ogImage: imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779902991/7_bgdywf.jpg")
  },

  subHeading: "Tự sạc ban ngày, tự sáng ban đêm, phù hợp lắp ngoài trời.",
  hookTitle: "Ưu đãi hôm nay",
  soldText: "112.5k",
  sliderTags: [
    "Công suất<br>40W",
    "Sử dụng liên tục<br>8h",
    "Bảo hành 1 đổi 1<br>trong 6 tháng"
  ],

  images: [
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779902991/7_bgdywf.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779903466/8_vbckdv.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779902671/5_zj7qim.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779902669/6_csumkx.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779891565/1_mpmzgp.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779891565/2_d3bcrs.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779901599/44_iqkeyn.jpg"),
    imgCover("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779891561/vn-11134103-7r98o-llrc4dd5nhlr11_lb7ajr.webp")
  ],
  videos: [],

  description: {
    shortHtml: `
      <h3>Sáng mạnh – tự sạc ban ngày – chiếu sáng liên tục đến 8 giờ</h3>
      <p>Bạn cần một chiếc đèn dùng được khi mất điện, lắp ngoài sân, trước cổng, hiên nhà hoặc khu vực không tiện kéo dây điện?</p>
      <p>Đèn tích điện năng lượng mặt trời 40W là lựa chọn phù hợp cho nhu cầu chiếu sáng hằng ngày tại gia đình, cửa hàng nhỏ, sân vườn, nhà trọ hoặc công trình phụ.</p>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779902991/7_bgdywf.jpg")}" alt="Đèn năng lượng mặt trời 40W">
    `,

    fullHtml: `
      <p>Ban ngày đèn sạc bằng ánh nắng mặt trời, buổi tối có thể chiếu sáng liên tục lên đến 8 giờ. Không cần đi dây phức tạp, không tốn thêm tiền điện, dễ lắp và dễ sử dụng.</p>

      <h3>Vì sao nên dùng đèn năng lượng mặt trời 40W?</h3>
      <p>Đèn sử dụng nguồn năng lượng từ ánh nắng mặt trời để sạc pin vào ban ngày. Khi trời tối, bạn có thể bật đèn để chiếu sáng khu vực cần dùng mà không phụ thuộc hoàn toàn vào điện lưới.</p>
      <p>Sản phẩm phù hợp với những vị trí như sân nhà, cổng, hiên, ban công, lối đi, nhà kho, khu vực chăn nuôi, quán nhỏ hoặc nơi thường xuyên cần ánh sáng vào ban đêm.</p>
      <p>Với công suất 40W, đèn cho ánh sáng đủ dùng trong sinh hoạt hằng ngày, giúp không gian sáng hơn, an toàn hơn và tiện hơn khi di chuyển vào buổi tối.</p>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779901599/44_iqkeyn.jpg")}" alt="Lợi ích đèn năng lượng mặt trời 40W">

      <h3>Chiếu sáng liên tục đến 8 giờ</h3>
      <p>Sau khi được sạc bằng ánh nắng ban ngày, đèn có thể chiếu sáng liên tục lên đến 8 giờ, phù hợp dùng từ chiều tối đến đêm.</p>
      <p>Đây là giải pháp tiện lợi cho những gia đình muốn có thêm nguồn sáng dự phòng khi mất điện, hoặc cần chiếu sáng khu vực ngoài trời mà không muốn kéo dây điện xa.</p>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779902669/6_csumkx.jpg")}" alt="Đèn chiếu sáng liên tục đến 8 giờ">

      <h3>Không cần kéo dây điện – dễ lắp đặt</h3>
      <p>Đèn hoạt động bằng năng lượng mặt trời nên không cần lắp đặt hệ thống dây điện phức tạp. Bạn có thể lắp tại nhiều vị trí khác nhau, miễn là tấm pin có thể tiếp xúc tốt với ánh nắng ban ngày.</p>
      <p>Việc lắp đặt đơn giản, phù hợp cả với người dùng gia đình, cửa hàng nhỏ hoặc khu vực sân vườn.</p>

      <h3>Tiết kiệm điện, tiện dùng hằng ngày</h3>
      <p>Sử dụng đèn năng lượng mặt trời giúp giảm phụ thuộc vào điện lưới, đặc biệt phù hợp với khu vực ngoài trời, nơi kéo điện bất tiện hoặc thường cần chiếu sáng vào ban đêm.</p>
      <p>Đèn dùng được cho nhiều nhu cầu khác nhau: chiếu sáng sân, cổng, lối đi, hiên nhà, ban công, nhà kho, vườn hoặc khu vực sinh hoạt ngoài trời.</p>
      <img src="${imgContent("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779902671/5_zj7qim.jpg")}" alt="Đèn năng lượng mặt trời dùng ngoài trời">

      <h3>Thông tin sản phẩm</h3>
      <ul>
        <li>Công suất: 40W</li>
        <li>Nguồn sạc: Năng lượng mặt trời</li>
        <li>Thời gian chiếu sáng: Lên đến 8 giờ</li>
        <li>Phù hợp: Sân, cổng, hiên nhà, lối đi, ban công, nhà kho, cửa hàng nhỏ</li>
        <li>Ưu điểm: Dễ lắp đặt, tiết kiệm điện, tiện sử dụng hằng ngày</li>
      </ul>
    `
  },

  variants: [],

  combos: [
    {
      name: "1 chiếc",
      quantity: 1,
      price: 145000,
      oldPrice: 199000,
      shipFee: 30000,
      note: "Phù hợp mua dùng thử"
    },
    {
      name: "Combo 2 chiếc",
      quantity: 2,
      price: 260000,
      oldPrice: 398000,
      shipFee: 0,
      note: "Phù hợp lắp cổng + sân",
      tag: "Bán chạy",
      tagType: "hot"
    },
    {
      name: "Combo 3 chiếc",
      quantity: 3,
      price: 381000,
      oldPrice: 597000,
      shipFee: 0,
      note: "Phù hợp lắp nhiều vị trí",
      tag: "Tiết kiệm",
      tagType: "save"
    }
  ],

  features: [
    { icon: "☀️", title: "Sạc bằng năng lượng mặt trời", sub: "Không cần đi dây điện" },
    { icon: "🌙", title: "Tự sáng ban đêm", sub: "Phù hợp sân, cổng, ban công" },
    { icon: "💧", title: "Dùng ngoài trời", sub: "Thiết kế phù hợp môi trường ngoài trời" }
  ],

  benefits: [],
  hooks: [],

  returnPolicy: {
    title: "Kiểm tra hàng trước khi thanh toán",
    content: "Khách được kiểm tra hàng trước khi thanh toán. Nếu sản phẩm không đúng mô tả có thể từ chối nhận hàng."
  },

  faqs: [
    {
      q: "Đèn dùng ở đâu phù hợp?",
      a: "Phù hợp lắp ở sân, cổng, ban công, lối đi, khu vực cần chiếu sáng ngoài trời."
    },
    {
      q: "Có được kiểm tra hàng không?",
      a: "Có. Khách được kiểm tra hàng trước khi thanh toán."
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
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Đèn ánh sáng tốt nên mua dùng thử. Sản phẩm tuy nhỏ nhưng ánh sáng chất lượng, mong sẽ sử dụng được lâu dài.",
        media: [
          imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779904649/vn-11134103-7r98o-lluu9tmij07z4b_hhphw2.webp"),
          {
            type: "video",
            src: "https://res.cloudinary.com/dfppbfjkm/video/upload/v1779904653/vn-11110103-6ke16-lluuae4kiyfza3.16000051695136653_rr0ftr.mp4",
            poster: imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779904649/vn-11134103-7r98o-lluu9tmij07z4b_hhphw2.webp")
          }
        ],
        mediaFull: [],
        likes: 18
      },
      {
        name: "Minh Thư",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775668044/637761832_26138729435757097_3914838421337340387_n_1_vslodw.jpg",
        stars: 5,
        date: "2026-02-20 14:30",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Shop ơi mình nhận được hàng rồi. Đóng gói chắc chắn cẩn thận. Sản phẩm tốt. Mình đánh giá 5 sao cảm ơn.",
        media: [
          imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779904661/vn-11134103-7r98o-lpot7rqf6awp18_soxyay.webp")
        ],
        mediaFull: [],
        likes: 12
      },
      {
        name: "Thu Hương",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777442314/496048196_10227521412714146_7242111311152812573_n_cqob7o.jpg",
        stars: 5,
        date: "2026-03-05 20:00",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Shop giao hàng nhanh. Chất lượng sản phẩm đáng tiền mua. Đèn nhỏ gọn mà sáng lắm nha cả nhà. Shop tư vấn nhiệt tình.",
        media: [
          imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779904842/vn-11134103-7r98o-lnlln5a37y0d5b_afsikz.webp")
        ],
        mediaFull: [],
        likes: 25
      },
      {
        name: "Lan Phương",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666154/528684809_10234145965525107_1862972145806632462_n_pjnnbt.jpg",
        stars: 5,
        date: "2026-01-28 11:00",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Giao nhanh đóng gói kĩ, đèn sáng, cánh của đèn gập lên xuống được. Chưa biết sạc bằng ánh sáng mặt trời được không do đèn có pin sẵn chưa test được. Nói chung rất ưng nha, nên mua.",
        media: [
          imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779904961/vn-11134103-7r98o-llluiem51ydrcb_xzlqiu.webp")
        ],
        mediaFull: [],
        likes: 20
      },
      {
        name: "Mỹ Linh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666153/515438282_10161038595011631_4166789956527747626_n_c3roiy.jpg",
        stars: 5,
        date: "2026-02-14 16:45",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Đèn sáng ok mở dễ dàng, có nút điều chỉnh chế độ đèn. Giao hàng nhanh, đóng gói tốt. Mới mua nên chưa biết xài bền không, nếu bền sẽ ủng hộ tiếp.",
        media: [
          imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779904910/vn-11134103-7r98o-lpbw0ilo1v8bd0_onbbsl.webp")
        ],
        mediaFull: [],
        likes: 30
      },
      {
        name: "Thanh Vân",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1775666157/632391822_10164165214234558_5477016556770594214_n_aalvtm.jpg",
        stars: 5,
        date: "2026-03-18 08:30",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Sản phẩm rất tốt, đóng gói chắc chắn giao hàng nhanh. Shop tư vấn hỗ trợ nhiệt tình, nói chung là thấy ưng về chất lượng và cách phục vụ. 5 sao.",
        media: [
          imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779904876/vn-11134103-7r98o-lsaw41gfv9hg06_smfwam.webp")
        ],
        mediaFull: [],
        likes: 14
      },
      {
        name: "Hồng Nhung",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263433/607811273_3686318401504627_2580143465656964454_n_o5tm6p.jpg",
        stars: 5,
        date: "2026-04-02 08:40",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Đã nhận được hàng. Giao hàng nhanh như 1 cơn gió luôn. Shop tư vấn nhiệt tình lắm. Sản phẩm chất lượng giá phải chăng, rất hài lòng ạ.",
        media: [],
        mediaFull: [],
        likes: 14
      },
      {
        name: "Thanh Tùng",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263432/678769426_25775706475437957_4956482442550281485_n_x71xqb.jpg",
        stars: 5,
        date: "2026-03-25 19:10",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Đúng mô tả, đèn sáng lắm ạ. Đặt về hàng còn nguyên vẹn, pin cũng đầy nữa ạ. Không biết sạc xong như thế nào, giá phù hợp đáng mua, mọi người nên thử.",
        media: [],
        mediaFull: [],
        likes: 8
      },
      {
        name: "Bích Ngọc",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263433/472217451_3897875233826229_3182586081425376309_n_mim7vg.jpg",
        stars: 5,
        date: "2026-04-10 10:25",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Đèn đẹp sáng lắm luôn nhé, mọi người yên tâm mua nhé. Vừa tích điện vừa sạc pin vừa dùng ánh nắng mặt trời, rất tuyệt vời.",
        media: [],
        mediaFull: [],
        likes: 22
      },
      {
        name: "Minh Đức",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263432/637485615_1453115166448791_8103813016882458818_n_y3vycz.jpg",
        stars: 5,
        date: "2026-03-30 15:50",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Bóng đèn đẹp lắm, nghe lại còn giá hạt dẻ. Mình mua rồi mà giờ mua thêm 4 cái nữa, cho shop 5 sao.",
        media: [
          imgReview("https://res.cloudinary.com/dfppbfjkm/image/upload/v1779904928/vn-11134103-7ras8-mbq4h0gr7t1xdc_kvkkzm.webp")
        ],
        mediaFull: [],
        likes: 17
      },
      {
        name: "Thu Hà",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263432/608432069_4208202082731817_7593177311780112717_n_s7wuio.jpg",
        stars: 5,
        date: "2026-04-05 21:30",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Đèn khá đẹp và sáng. Hoàn thiện tốt, chất lượng. Khá tiện đi du lịch hay dã ngoại. Sạc năng lượng mặt trời kèm điều khiển. Shop tư vấn nhiệt tình 5 sao.",
        media: [],
        mediaFull: [],
        likes: 11
      },
      {
        name: "Quốc Anh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263431/380661527_1145384113086953_873267480011151541_n_fl2efc.jpg",
        stars: 5,
        date: "2026-04-12 07:15",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Hàng đúng như mô tả tất cả các bóng đều sáng dùng được còn độ bền thì phải dùng một thời gian mới biết được.sẽ mua lại sản phẩm của shop khi cần",
        media: [],
        mediaFull: [],
        likes: 35
      },
      {
        name: "Phương Linh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263431/453992787_3800619243515148_1809283296923042613_n_hdx7eh.jpg",
        stars: 5,
        date: "2026-04-08 13:00",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Đèn đep nha mn sáng để trong phòng được, sac bin đã đầy nhung k biet sai dc bao nhiêu tiếng, tiện lợi, đe gianh sai cup ddien hoặc đi đâu cung dc , k biết sai mà bền k nhưng gio ok nha mn 👍 👍",
        media: [],
        mediaFull: [],
        likes: 19
      },
      {
        name: "Văn Hưng",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263431/637469479_3748582662104448_139579128894954823_n_rijprq.jpg",
        stars: 3,
        date: "2026-03-20 16:20",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Đóng gói cẩn thận, đèn mua về bật lên cũng sáng lắm, chưa biết có giữ pin bền không. Cho shop 5 sao.",
        media: [],
        mediaFull: [],
        likes: 5
      },
      {
        name: "Kim Oanh",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263431/608887444_3826876447447507_2357408524069674573_n_xy3pgs.jpg",
        stars: 5,
        date: "2026-04-15 09:45",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Giao nhận hàng nhanh chóng, hàng được bọc gói cẩn thận, trời có ánh sáng thôi là bóng đèn tự sạc năng lượng rồi, dùng bền hay ko thì chưa biết. Chuẩn bị mưa bão hay cắt điện mong là dùng đc lâu",
        media: [],
        mediaFull: [],
        likes: 27
      },
      {
        name: "Thành Nam",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777263626/330810441_915686159621636_4232321777533105788_n_mwfmla.jpg",
        stars: 4,
        date: "2026-04-18 20:00",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Hàng nhận được đúng như mô tả, giao hàng nhanh, đóng gói cẩn thận. Thử thì cũng thấy sáng nhưng đc lâu không thì chưa biết",
        media: [],
        mediaFull: [],
        likes: 10
      },
      {
        name: "Ngọc Diệp",
        avatar: "https://res.cloudinary.com/dezednxpz/image/upload/w_80,h_80,c_fill,f_webp,q_80/v1777178082/Avt_m%E1%BA%B7c_%C4%91%E1%BB%8Bnh_Facebook_l9xnkz.webp",
        stars: 5,
        date: "2026-04-20 11:30",
        classify: "Đèn năng lượng mặt trời",
        match: "",
        material: "",
        content: "Giao hàng nhanh, sản phẩm đúng mô tả, đèn sáng, chất lượng phải sử dụng nhiều mới đánh giá được, trước mắt cho shop 5 sao",
        media: [],
        mediaFull: [],
        likes: 13
      }
    ]
  },

  policies: [
    { icon: "🚚", text: "Giao hàng toàn quốc" },
    { icon: "💵", text: "Thanh toán khi nhận hàng" },
    { icon: "✅", text: "Được kiểm tra hàng trước khi thanh toán" }
  ]
};