import React from "react";
import InstagramPost from "../../components/InstagramPost";
import { BasePostData } from "../../types/BaseTypes";

interface PostPreviewProps {
  postData: BasePostData;
}

const PostPreview: React.FC<PostPreviewProps> = ({ postData }) => {
  return (
    <InstagramPost
      image={postData.image}
      caption={postData.caption}
      hashtags={postData.hashtags}
    />
  );
};

export default PostPreview;
