import React, { useEffect } from "react";
import InstagramPost from "../../../../shared/components/InstagramPost";
import { Post } from "../../../Posts/entities/PostTypes";

interface PreviewTabProps {
  post: Post;
  onEdit: () => void;
  onSchedule: () => void;
}

const PreviewTab: React.FC<PreviewTabProps> = ({
  post,
  onEdit,
  onSchedule,
}) => {
  useEffect(() => {});
  return (
    <div className="flex flex-col items-center">
      <InstagramPost
        images={
          post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls : []
        }
        caption={post.description}
        hashtags={(post.hashtags || []).join(" ")}
        className="max-w-[400px]"
      />
      <div className="flex gap-3 mt-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Modifier
        </button>
        <button
          onClick={onSchedule}
          className="flex items-center gap-2 px-4 py-2 text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Programmer
        </button>
      </div>
    </div>
  );
};

export default PreviewTab;
