import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import LoadingScreen from "../LoadingScreen";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { loading, user } = useAuth();

  if(loading) {
    return <LoadingScreen text="Checking permissions..." />;
  } 

  console.log(user)

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoute;
