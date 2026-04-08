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
    author: "Arjuna",
    mediaType: "photo",
    mediaUrl: "/images/wishes/arjuna.jpg",
    message: "Happy birthday Ka Sharon! Wishing you all the best on your special day. You're an amazing person and I'm grateful to have you in our circle!"
  },
  {
    id: "2",
    author: "Friend 2",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend2.jpg",
    message: "Ka Sharon! Another year of being awesome. May this year bring you even more joy and laughter!"
  },
  {
    id: "3",
    author: "Friend 3",
    mediaType: "photo",
    mediaUrl: "/images/wishes/friend3.jpg",
    message: "Happy birthday to the most wonderful person! Keep shining bright, Ka Sharon!"
  },
];

export const photos: GalleryPhoto[] = [
  {
    id: "1",
    url: "/images/gallery/group1.jpg",
    caption: "The whole gang together",
  },
  {
    id: "2",
    url: "/images/gallery/group2.jpg",
    caption: "Fun times",
  },
  {
    id: "3",
    url: "/images/gallery/group3.jpg",
    caption: "Memories we cherish",
  },
];
