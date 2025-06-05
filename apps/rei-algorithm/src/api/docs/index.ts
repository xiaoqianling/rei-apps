import { Descendant } from "slate";
import { axiosInstance } from "..";

export async function getDocsByID(id: string): Promise<Descendant[]> {
  return axiosInstance
    .get(`/docs/${id}`)
    .then((res) => res.data)
    .then((res) => {
      console.log(res);
      return res.content;
    });
}
