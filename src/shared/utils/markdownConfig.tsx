import { Link } from "react-router-dom";

const markdownConfig = {
  components: {
    h1: ({ ...props }) => (
      <h2 className="text-xl font-semibold my-4" {...props} />
    ),
    h2: ({ ...props }) => (
      <h3 className="text-lg font-semibold my-3" {...props} />
    ),
    h3: ({ ...props }) => (
      <h4 className="text-md font-semibold my-2" {...props} />
    ),
    h4: ({ ...props }) => (
      <h5 className="text-sm font-semibold my-1" {...props} />
    ),
    strong: ({ ...props }) => (
      <span className="text-[#7C3AED] font-semibold" {...props} />
    ),
    a: ({ ...props }) => (
      <Link
        to={props.href}
        className="text-[#9ab927] font-semibold hover:underline"
        {...props}
      />
    ),
    li: ({ ...props }) => (
      <li className="list-[square] list-inside" {...props} />
    ),
  },
};

export default markdownConfig;
