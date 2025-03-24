import axios from "axios";
import { serverDomain } from "..";
import { BlogPost } from "@/src/components/community/type/post";

export async function getMockPost(): Promise<BlogPost> {
  return axios.get(serverDomain + "post/1/contents").then((res) => {
    return res.data;
  });
}
