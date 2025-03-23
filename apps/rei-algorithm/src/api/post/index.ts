import axios from "axios";
import { serverDomain } from "..";
import { BlogPost } from "@/src/components/community/type/post";

export async function getMockPost(): Promise<BlogPost> {
  console.log(serverDomain + "post/1/contents");
  return axios.get(serverDomain + "post/1/contents");
}
