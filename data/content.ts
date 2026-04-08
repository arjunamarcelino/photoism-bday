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
    mediaUrl: "/images/wishes/arjuna.jpg",
    message: ""
  },
  {
    id: "2",
    author: "Zz",
    mediaType: "video",
    mediaUrl: "/images/wishes/friend2.jpg",
    message: "Ka Sharon! Another year of being awesome. May this year bring you even more joy and laughter!"
  },
  {
    id: "3",
    author: "Tasia",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
  {
    id: "4",
    author: "Juna",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
  {
    id: "5",
    author: "Nico",
    mediaType: "video",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
  {
    id: "6",
    author: "Nomi",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
  {
    id: "7",
    author: "Naya",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
  {
    id: "8",
    author: "Ocen",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
  {
    id: "9",
    author: "Hans",
    mediaType: "video",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
  {
    id: "10",
    author: "Ka Pen",
    mediaType: "video",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
  {
    id: "11",
    author: "Tirta",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
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
