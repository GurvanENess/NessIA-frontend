import React from "react";
import InstagramPost from "../../components/InstagramPost";

interface PostData {
  image: string | null;
  caption: string;
  hashtags: string;
}

interface PostPreviewProps {
  postData: PostData;
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
