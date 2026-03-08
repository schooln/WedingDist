import heroBackgroundImage from "../assets/img_source/to1.jpg?url";
import heroCoupleImage from "../assets/img_source/to2.jpg?url";
import brideProfileImage from "../assets/img_source/codau.jpg?url";
import groomProfileImage from "../assets/img_source/chure.jpg?url";
import galleryPhoto01 from "../assets/img_source/to1.jpg?url";
import galleryPhoto02 from "../assets/img_source/to3.jpg?url";
import galleryPhoto03 from "../assets/img_source/nho1.jpg?url";
import galleryPhoto04 from "../assets/img_source/nho2.jpg?url";
import galleryPhoto05 from "../assets/img_source/nho3.jpg?url";
import galleryPhoto06 from "../assets/img_source/nho4.jpg?url";
import galleryPhoto07 from "../assets/img_source/nho5.jpg?url";
import galleryPhoto08 from "../assets/img_source/nho6.jpg?url";
import galleryPhoto09 from "../assets/img_source/nho7.jpg?url";
import galleryPhoto010 from "../assets/img_source/nho8.jpg?url";
import brideQrImage from "../assets/img_source/qr_co_dau.jpg?url";
import groomQrImage from "../assets/img_source/qr_chu_re.jpg?url";

export const weddingDate = new Date("2026-03-22T08:00:00+07:00");

export const heroContent = {
  groom: "Xuân Trường",
  bride: "Minh Tâm",
  subtitle: "Một hành trình mới sắp bắt đầu!!!",
  date: "Chủ nhật, 22.03.2026",
  location: "Tây Đô, Vĩnh Lộc, Thanh Hóa",
  heroImage: heroCoupleImage,
  heroImageAlt: "Ảnh cưới của cô dâu chú rể",
  background: heroBackgroundImage,
};

export const invitationMessage = {
  title: "Trân trọng kính mời",
  message: [
    "Trong không khí hân hoan của ngày trọng đại, gia đình {{hostPronoun}} xin gửi tới {{guestPronoun}} lời mời chân thành nhất.",
    "Chúng {{hostPronoun}} trân trọng sự hiện diện của {{guestPronoun}} trong ngày lễ thành hôn. Sự góp mặt của {{guestPronoun}} làm cho ngày vui của {{hostPronoun}} thêm trọn vẹn",
    "",
  ],
};

export const coupleProfiles = [
  {
    role: "Cô dâu",
    name: "Minh Tâm",
    description:
      "Yêu sự bình yên và luôn tìm thấy niềm vui trong những điều giản dị của gia đình. Quen với việc chăm chút mọi thứ thật tươm tất, ngăn nắp và sạch sẽ. Hy vọng sẽ tiếp tục gìn giữ, vun vén những yêu thương nhỏ bé ấy cho tổ ấm của riêng mình",
    image: brideProfileImage,
    avatarPosition: "64% 22%",
  },
  {
    role: "Chú rể",
    name: "Xuân Trường",
    description:
      "Sống chân thành, điềm đạm và luôn xem gia đình là điều quý giá nhất. Tin rằng hạnh phúc được xây nên từ sự yêu thương, trách nhiệm và những điều bình dị được gìn giữ mỗi ngày. Hy vọng sẽ cùng vun đắp một tổ ấm nhỏ bằng tất cả sự bao dung và chân thành của mình",
    image: groomProfileImage,
    avatarPosition: "50% 18%",
  },
];

export const timelineContent = {
  title: "Thời gian & Địa điểm",
  steps: [
    {
      time: "09:00",
      title: "Giờ đón dâu",
      detail: "Gia đình nhà gái đón tiếp quan khách thân tình.",
      icon: "🌸",
    },
    {
      time: "09:30",
      title: "Lễ rước dâu",
      detail: "Hai họ làm lễ vu quy và trao lời chúc phúc.",
      icon: "💍",
    },
    {
      time: "10:30",
      title: "Thành hôn",
      detail: "Lễ thành hôn",
      icon: "🏠",
    },
    {
      time: "11:00",
      title: "Chụp ảnh lưu niệm",
      detail:
        "Mọi người cùng nhau lưu giữ lại những bức ảnh ảnh kỷ niệm tuyệt vời nhất.",
      icon: "🌸",
    },
  ],
};

export const familyVenues = [
  {
    title: "Lễ Vu Quy • Nhà gái",
    time: "09:00 • 22/03/2026",
    address: "Thôn Phù Lưu, Xã Tây Đô, Huyện Vĩnh Lộc, Thanh Hóa",
    note: "(Sửa lại) Sự hiện diện của {{guestPronoun}} đã làm cho ngày đặc biệt của {{hostPronoun}} thêm trọn vẹn",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.987654321!2d105.223456!3d19.993210!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3130ccccccccdddd%3A0xfedcba987654321!2zVGhvbiBQaMO6IEzGsMahLCBUw6J5IMSQw7QsIFbhu4tuZyBM4buZYywgVGhhbmggSMOgIQ!5e0!3m2!1svi!2svi!4v1700000000001!5m2!1svi!2svi",
    mapLink: "https://maps.app.goo.gl/C7Ft64rQt4NvoK9t8",
    marker: "Note Nhà gái",
  },
  {
    title: "Lễ Thành Hôn • Nhà trai",
    time: "10:30 • 22/03/2026",
    address: "Thôn Bèo, Xã Tây Đô, Huyện Vĩnh Lộc, Thanh Hóa",
    note: "Cảm ơn {{guestPronoun}} vì đã trở thành một phần quan trọng trong ngày trọng đại này",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.123456789!2d105.123456!3d19.983210!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3130aaaaaaaabbbb%3A0x123456789abcdef!2zVGhvbiBC4buHbywgVOG6p3kgxJDhu5csIFbhu4tuZyBM4buZYywgVGhhbmggSMOgIQ!5e0!3m2!1svi!2svi!4v1700000000000!5m2!1svi!2svi",
    mapLink: "https://maps.app.goo.gl/Zj18CZUdHzi1pn8G6",
    marker: "Nhà trai",
  },
];

export const galleryContent = {
  title: "Album cưới",
  subtitle: "Những khoảnh khắc ngọt ngào nhất của {{hostPronoun}} ^^.",
  photos: [
    {
      id: "photo-1",
      image: galleryPhoto01,
      alt: "Khoảnh khắc cưới 01",
      orientation: "portrait",
    },
    {
      id: "photo-2",
      image: galleryPhoto02,
      alt: "Khoảnh khắc cưới 02",
      orientation: "portrait",
    },
    {
      id: "photo-3",
      image: galleryPhoto03,
      alt: "Khoảnh khắc cưới 03",
      orientation: "portrait",
    },
    {
      id: "photo-4",
      image: galleryPhoto04,
      alt: "Khoảnh khắc cưới 04",
      orientation: "portrait",
    },
    {
      id: "photo-5",
      image: galleryPhoto05,
      alt: "Khoảnh khắc cưới 05",
      orientation: "portrait",
    },
    {
      id: "photo-6",
      image: galleryPhoto06,
      alt: "Khoảnh khắc cưới 06",
      orientation: "portrait",
    },
    {
      id: "photo-7",
      image: galleryPhoto07,
      alt: "Khoảnh khắc cưới 07",
      orientation: "portrait",
    },
    {
      id: "photo-8",
      image: galleryPhoto08,
      alt: "Khoảnh khắc cưới 08",
      orientation: "portrait",
    },
    {
      id: "photo-9",
      image: galleryPhoto09,
      alt: "Khoảnh khắc cưới 09",
      orientation: "portrait",
    },
    {
      id: "photo-10",
      image: galleryPhoto010,
      alt: "Khoảnh khắc cưới 10",
      orientation: "portrait",
    },
  ],
};

export const initialWishes = [
  {
    name: "Ngọc Lan",
    message:
      "Chúc hai bạn luôn giữ được sự thấu hiểu và bình yên như ngày đầu.",
    createdAt: "2 ngày trước",
  },
  {
    name: "Anh Tuấn",
    message: "Hẹn gặp hai bạn trong lễ cưới để cùng nâng ly chúc mừng!",
    createdAt: "Hôm qua",
  },
];

export const giftContent = {
  title: "Gửi yêu thương",
  message:
    "Nếu không thể đến tham dự, {{guestPronoun}} có thể gửi lời chúc và yêu thương qua thông tin sau:",
  accounts: [
    {
      label: "Nhà gái",
      bank: "VietinBank",
      name: "Trịnh Minh Tâm",
      number: "1020 0378 4556",
      qrCode: brideQrImage,
      note: "A-Hihi!!!",
    },
    {
      label: "Nhà trai",
      bank: "TPBank",
      name: "Nguyễn Xuân Trường",
      number: "9899 2798 888",
      qrCode: groomQrImage,
      note: "A-Hihi!!!",
    },
  ],
};

export const footerContent = {
  brideName: "Minh Tâm",
  groomName: "Xuân Trường",
  date: "22.03.2026",
  message:
    "Cảm ơn {{guestPronoun}} đã dành tình cảm cho chúng {{hostPronoun}}!\nSự hiện diện của {{guestPronoun}} chính là món quà ý nghĩa nhất, và chúng {{hostPronoun}} vô cùng trân quý khi được cùng {{guestPronoun}} chia sẻ niềm hạnh phúc trong ngày trọng đại này",
  designCredit: "© Designed by Tâm & Trường (code)",
};
