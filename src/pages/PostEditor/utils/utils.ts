export const getHashtags = (text: string): string => {
  const regex = /#[a-zA-ZÀ-Ÿ-.]+/g;
  const matches = text.match(regex);
  return matches ? matches.join(" ") : "";
};

export const getContent = (text: string): string => {
  return text.replace(/#[a-zA-ZÀ-Ÿ-.]+/g, "").trim();
};
