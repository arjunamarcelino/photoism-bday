export type MediaType = "photo" | "video" | "gif";

export interface Wish {
  id: string;
  author: string;
  mediaType: MediaType;
  mediaUrl: string;
  message: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption?: string;
}

export const wishes: Wish[] = [
  {
    id: "1",
    author: "Yosua",
    mediaType: "photo",
    mediaUrl: "/images/wishes/1.jpeg",
    message: "Kak sharon S.Hut yaa. Semoga di usia yang baru ini, Tuhan selalu menyertai setiap langkahmu, memberi kesehatan, hikmat, dan kekuatan dalam menjalani segala hal."
  },
  {
    id: "2",
    author: "Zz",
    mediaType: "video",
    mediaUrl: "/images/wishes/2.mp4",
    message: ""
  },
  {
    id: "3",
    author: "Tasia",
    mediaType: "photo",
    mediaUrl: "/images/wishes/3.jpg",
    message: "hapibidii kak sharonna✨ may God loves and leads ur way always yaa 🫶🏻"
  },
  {
    id: "4",
    author: "Juna",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday, Ka Sharon! Another year of being awesome. May this year bring you even more joy and laughter!"
  },
  {
    id: "5",
    author: "Nico",
    mediaType: "video",
    mediaUrl: "/images/wishes/5.mp4",
    message: ""
  },
  {
    id: "6",
    author: "Nomi🌧️",
    mediaType: "photo",
    mediaUrl: "/images/wishes/6.jpg",
    message: "Habede kak Sharon, love u gitu"
  },
  {
    id: "7",
    author: "Naya",
    mediaType: "video",
    mediaUrl: "/images/wishes/7.mp4",
    message: "Happy birthday, big sis!💖 \nI’m so glad to have you in my life. Love you and God bless you, Kak Sharon!  \n\n with love, naya💌"
  },
  {
    id: "8",
    author: "Ocen",
    mediaType: "photo",
    mediaUrl: "/images/wishes/8.jpg",
    message: "happy birthday, mba sahrona! \n i hope this new chapter brings you closer to everything you’ve been praying for. may your heart always be filled with peace, no matter what life brings. you deserve all the good things in this world ♡ \n\n WISH LENGKAPNYAA DI PC YA MBA SARON SAYANG, ILYMOREE THAN YOU KNOW \n\n -ceno"
  },
  {
    id: "9",
    author: "Hans",
    mediaType: "video",
    mediaUrl: "/images/wishes/9.mp4",
    message: "Happy birthday kak sharon, Semoga di usia yang bertambah ini semakin bertumbuh juga di dalam iman dan apa yang di cita citakan tercapai. \n\n ~Hans"
  },
  {
    id: "10",
    author: "Ka Pen",
    mediaType: "video",
    mediaUrl: "/images/wishes/10.mp4",
    message: ""
  },
  {
    id: "11",
    author: "Tirta",
    mediaType: "video",
    mediaUrl: "/images/wishes/11.mp4",
    message: ""
  },
  {
    id: "12",
    author: "Bryn",
    mediaType: "photo",
    mediaUrl: "/images/wishes/12.jpeg",
    message: "Happy birthday, Kak Sharon 🎂✨ \nHonestly, I’m really grateful bisa kenal kakak sejauh ini. Dari semua momen pelayanan dan obrolan kita, kakak selalu jadi orang yang hangat dan tulus. \n\nHope this new chapter brings you more joy, peace, and everything good that you deserve. Stay the same kind person ya, don’t change 🤍 \n\nGod bless you always, Kak Serona"
  },
];

export const photos: GalleryPhoto[] = [
  { id: "1", url: "/images/gallery/1.jpeg", caption: "Us being us" },
  { id: "2", url: "/images/gallery/2.jpeg", caption: "Squad goals, always" },
  { id: "3", url: "/images/gallery/3.jpeg", caption: "Together is our favorite place" },
  { id: "4", url: "/images/gallery/4.jpeg", caption: "The whole gang" },
  { id: "5", url: "/images/gallery/5.jpeg", caption: "Good times, good people" },
  { id: "6", url: "/images/gallery/6.jpeg", caption: "We just fit" },
  { id: "7", url: "/images/gallery/7.jpeg", caption: "Forever kind of crew" },
  { id: "8", url: "/images/gallery/8.jpeg", caption: "Grateful for this bunch" },
  { id: "9", url: "/images/gallery/9.jpeg", caption: "Home is wherever we are" },
  { id: "10", url: "/images/gallery/10.jpeg", caption: "Our little world" },
  { id: "11", url: "/images/gallery/11.jpeg", caption: "Here's to many more" },
];
