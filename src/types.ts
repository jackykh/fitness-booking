// 定義預訂課程的類型
export interface BookedClass {
  id: string;
  classId: string;
  userId: string;
  className: string;
  date: string;
  time: string;
  instructor: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  tokenExpiration: number;
  // 其他可能的用戶屬性
}
