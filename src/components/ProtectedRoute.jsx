import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(); // Using getUser

      if (error) {
        console.error("Error fetching user:", error);
        setIsAdmin(false);
        return;
      }

      if (user) {
        // Query the users table to check if the user is an admin
        const { data, error: adminError } = await supabase
          .from("users")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        if (adminError) {
          console.error("Error fetching admin status:", adminError);
          setIsAdmin(false);
        } else {
          setIsAdmin(data.is_admin);
        }
      } else {
        setIsAdmin(false); // No user, so not an admin
      }
    };

    getUser();
  }, []);

  if (isAdmin === null) {
    return <div>Loading...</div>; // Show a loading spinner while checking
  }

  if (!isAdmin) {
    return <Navigate to="/" />; // Redirect to home if not an admin
  }

  return children; // Render protected content if admin
};

export default ProtectedRoute;
