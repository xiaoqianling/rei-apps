import { ContentTypes } from "@/src/components/community/type/content";

export type ContentBlockResponseDTO = {
  type: ContentTypes;
  // 未反序列化
  metadata: string;
};
