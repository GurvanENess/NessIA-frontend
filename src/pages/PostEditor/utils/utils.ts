import { PostData } from "../../../shared/entities/PostTypes";

export const getHashtags = (text: string): string => {
  return JSON.parse(text).join(" ");
};

export const getContent = (text: string): string => {
  return text.replace(/#[a-zA-ZÀ-Ÿ-.]+/g, "").trim();
};

const formatHashtagsToDb = (hashtags: string): string => {
  return JSON.stringify(hashtags.split(" "));
};

export const formatPostToDb = (
  postData: PostData
): { content: string; hashtags: string } => {
  const result = {
    content: postData.caption,
    hashtags: formatHashtagsToDb(postData.hashtags),
  };

  return result;
};
