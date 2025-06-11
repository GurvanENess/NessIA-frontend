import React from "react";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

interface InstagramPostProps {
  image: string | null;
  caption: string;
  hashtags: string;
  username?: string;
  profileImage?: string;
  likes?: number;
  comments?: number;
  timestamp?: string;
}

const InstagramPost: React.FC<InstagramPostProps> = ({
  image,
  caption,
  hashtags,
  username = "nessia",
  profileImage = "/assets/nessia_logo.svg",
  likes = 0,
  comments = 0,
  timestamp = "Just now",
}) => {
  return (
    <div className="max-w-[470px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Instagram Post Header */}
      <div className="flex items-center p-3 border-b">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <img
            src={profileImage}
            alt={`${username}'s profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm font-semibold">{username}</p>
        </div>
      </div>

      {/* Post Image */}
      <div className="relative aspect-square">
        <img
          src={image || "/assets/default.jpg"}
          alt="Post content"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-4">
            <button className="hover:opacity-70 transition-opacity">
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:opacity-70 transition-opacity">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button className="hover:opacity-70 transition-opacity">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes */}
        <p className="text-sm font-semibold mb-2">{likes} likes</p>

        {/* Caption */}
        <div className="text-sm mb-2">
          <span className="font-semibold mr-2">{username}</span>
          {caption}
        </div>

        {/* Hashtags */}
        <div className="text-sm text-blue-900">
          {hashtags.split(" ").map((tag, index) => (
            <span key={index} className="mr-1">
              {tag}
            </span>
          ))}
        </div>

        {/* Comments */}
        <p className="text-sm text-gray-500 mt-2">
          View all {comments} comments
        </p>
        <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
      </div>
    </div>
  );
};

export default InstagramPost;
