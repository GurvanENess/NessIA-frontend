import React from "react";
import InstagramPost from "../../shared/components/InstagramPost";
import { PostData } from "../../shared/entities/PostTypes";

interface PostPreviewProps {
  postData: PostData;
}

const PostPreview: React.FC<PostPreviewProps> = ({ postData }) => {
  return (
    <InstagramPost
      images={postData.images}
      caption={postData.caption}
      hashtags={postData.hashtags}
    />
  );
};

export default PostPreview;
