import React from "react";

const PostEditor: React.FC = () => {
  return (
    <div className="flex flex-col h-screen font-commissioner">
      <div className="flex-grow p-5 overflow-y-auto">
        <div className="flex border-b border-gray-200 mb-5">
          <button className="pb-2 px-5 text-base cursor-pointer text-gray-600 relative">
            Aperçu
          </button>
          <button className="pb-2 px-5 text-base cursor-pointer text-purple-700 font-semibold relative after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-0.5 after:bg-purple-700">
            Modifier
          </button>
        </div>

        <div className="rounded-lg p-5 mb-5 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Image</h3>
          </div>
          <div className="border-2 bg-white border-dashed border-gray-200 rounded-lg min-h-[200px] flex justify-center items-center relative overflow-hidden">
            <img
              src="/assets/nessia_title.svg"
              alt="Placeholder"
              className="max-w-full max-h-full object-contain"
            />
            <button className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full w-8 h-8 flex justify-center items-center cursor-pointer shadow">
              ✏️
            </button>
          </div>
        </div>

        <div className="rounded-lg p-5 mb-5 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Légende</h3>
          </div>
          <textarea
            className="w-full p-2 border border-gray-200 rounded-md text-base box-border resize-y min-h-[100px] bg-white"
            placeholder="Embrace summer vibes with our new collection! ☀️"
            rows={4}
            defaultValue="Embrace summer vibes with our new collection! ☀️"
          ></textarea>
        </div>

        <div className="rounded-lg p-5 mb-5 shadow-sm">
          <div className="flex items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Hashtags</h3>
          </div>
          <input
            type="text"
            className="w-full p-2 border border-gray-200 rounded-md text-base box-border mb-1 bg-white"
            placeholder="#summer #fashion #newcollection"
            defaultValue="#summer #fashion #newcollection"
          />
          <p className="text-xs text-gray-500">
            Séparez les hashtags par des espaces
          </p>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
