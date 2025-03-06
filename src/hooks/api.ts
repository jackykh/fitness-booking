import { useQuery } from "@tanstack/react-query";
import db from "../api/db.json";

const { classes } = db;

async function fetchData<T>(path: string): Promise<T> {
  const response = await fetch(`${process.env.REACT_APP_SERVER}/${path}`);
  if (!response.ok) {
    throw new Error("Fetch data fail!");
  }
  const data = await response.json();
  return data;
}

export const useFetchClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: () => fetchData<typeof classes>("classes"),
  });
};
