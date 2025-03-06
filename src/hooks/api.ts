import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

import db from "../api/db.json";

const { classes } = db;

type ClassesType = typeof classes;
type UserDataType = {
  id: string;
  username: string;
  email: string;
  bookings: {
    id: string;
    classId: string;
    status: "upcoming" | "completed" | "cancelled";
    bookedAt: string;
  }[];
};
type UserBookingsType = UserDataType["bookings"];

const fetchUserData = async (userId?: string) => {
  const response = await fetch(
    `${process.env.REACT_APP_SERVER}/users/${userId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }
  const userData = (await response.json()) as UserDataType;
  return userData;
};

// 獲取課程列表
export const useFetchClasses = () => {
  return useQuery<ClassesType>({
    queryKey: ["classes"],
    queryFn: async () => {
      const response = await fetch(`${process.env.REACT_APP_SERVER}/classes`);
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      return response.json();
    },
  });
};

// 獲取用戶預訂
export const useFetchUserBookings = (userId?: string) => {
  return useQuery<UserBookingsType>({
    queryKey: ["users", userId],
    queryFn: async () => {
      const userData = await fetchUserData(userId);
      return userData.bookings;
    },
    enabled: !!userId,
  });
};

// 預訂課程
export const useBookingMutation = (userId?: string, token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classId: string) => {
      //查詢是否已預訂
      const userData = await fetchUserData(userId);

      const hasBooking = userData.bookings.filter(
        (booking) =>
          booking.classId === classId &&
          ["completed", "upcoming"].includes(booking.status)
      );

      if (hasBooking.length > 0) {
        throw Error("You already have this booking!");
      }

      // 創建新的預訂
      const newBooking: UserBookingsType[number] = {
        id: uuidv4(), // 生成唯一ID
        classId,
        status: "upcoming",
        bookedAt: new Date().toISOString(),
      };

      // 更新用戶數據
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...userData,
            bookings: [...userData.bookings, newBooking],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to book class");
      }

      // 更新課程剩餘名額
      const classResponse = await fetch(
        `${process.env.REACT_APP_SERVER}/classes/${classId}`
      );
      const classData = await classResponse.json();

      await fetch(`${process.env.REACT_APP_SERVER}/classes/${classId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          remaining: classData.remaining - 1,
        }),
      });

      return response.json();
    },
    onSuccess: () => {
      // 更新用戶和課程數據
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};

// 取消預訂
export const useCancelMutation = (userId?: string, token?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: string) => {
      const userData = await fetchUserData(userId);
      let updatedClasses;
      const updatedBooking = userData.bookings.map((booking) => {
        if (booking.id === bookingId) {
          updatedClasses = booking.classId;
          return {
            ...booking,
            status: "cancelled",
          };
        }
        return booking;
      });

      // 更新用戶數據
      const response = await fetch(
        `${process.env.REACT_APP_SERVER}/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...userData,
            bookings: updatedBooking,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      const latestBooking = (await response.json()) as UserDataType;

      // 更新課程剩餘名額
      const classResponse = await fetch(
        `${process.env.REACT_APP_SERVER}/classes/${updatedClasses}`
      );
      const classData = await classResponse.json();

      await fetch(`${process.env.REACT_APP_SERVER}/classes/${updatedClasses}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          remaining: classData.remaining + 1,
        }),
      });

      return latestBooking;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", userId] });
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },
  });
};
