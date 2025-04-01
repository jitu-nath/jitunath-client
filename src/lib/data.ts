import { UploadedImage } from "@/types/cloudinary";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DocumentEntry {
  // id: string;
  _id: string;
  balamNo: string;
  dholilNo: string;
  pageNo: string;
  year: string ;
  images?: UploadedImage[]; //
}

// export const documentData: DocumentEntry[] = [
//   {
//     id: "1",
//     batchNo: "150",
//     draftNo: "150",
//     pageNo: "(120-130)(150-120)",
//     year: "2024",
//     images:
//       ["https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"],
//   },
//   {
//     id: "2",
//     batchNo: "150",
//     draftNo: "150",
//     pageNo: "(120-130)(150-120)",
//     year: "2024",
//     images:
//     ["https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"]
//   },
//   {
//     id: "3",
//     batchNo: "150",
//     draftNo: "150",
//     pageNo: "(120-130)(150-120)",
//     year: "2024",
//     images:
//     ["https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"]
//   },
//   {
//     id: "4",
//     batchNo: "150",
//     draftNo: "150",
//     pageNo: "(120-130)(150-120)",
//     year: "2024",
//     images:
//     ["https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"]
//   },
//   {
//     id: "5",
//     batchNo: "150",
//     draftNo: "150",
//     pageNo: "(120-130)(150-120)",
//     year: "2024",
//     images:
//     ["https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"]
//   },
//   {
//     id: "6",
//     batchNo: "150",
//     draftNo: "150",
//     pageNo: "(120-130)(150-120)",
//     year: "2024",
//     images:
//     ["https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"]
//   },
//   {
//     id: "7",
//     batchNo: "150",
//     draftNo: "150",
//     pageNo: "(120-130)(150-120)",
//     year: "2024",
//     images:
//     ["https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"]
//   },
// ];

export const years = ["2014", "2015", "2016", "2017", "2018"];

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export const currentUser: User = {
  id: "1",
  name: "Sharon",
  email: "sharon@example.com",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
};
