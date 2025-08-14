import { Outlet, useLocation } from "react-router-dom";
import LoadingScreen from "../shared/components/LoadingScreen";
import { useCompanyResourceAccess } from "../shared/hooks/useCompanyResourceAccess";

const isPost = (url: string) => /^\/posts\/[0-9]+/.test(url);
const isChat = (url: string) => /^\/chats\/[a-zA-Z0-9]+/.test(url);

const CompanyProtectedResource = () => {
  // Si la compagnie actuelle a le droit d'accéder à la ressource en question
  // (Comment savoir que ^ ?)
  const { pathname } = useLocation();

  let resourceType = "";

  if (isPost(pathname)) resourceType = "post";
  else if (isChat(pathname)) resourceType = "chat";
  else return null;

  const { isLoading, hasAccess } = useCompanyResourceAccess(resourceType);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (hasAccess) {
    return <Outlet />;
  }
};

export default CompanyProtectedResource;
