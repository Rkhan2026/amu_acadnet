"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { clearCurrentUser, notifyUserChange } from "@/lib/utils/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const fetchUser = useCallback(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          setUser(null);
          setLoading(false);
        } else {
          setUser(data.user);
          setLoading(false);
        }
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchUser();
    window.addEventListener("user-updated", fetchUser);
    return () => window.removeEventListener("user-updated", fetchUser);
  }, [fetchUser]);

  useEffect(() => {
    if (!loading && !user) {
      const isPublicPath =
        pathname === "/home" ||
        pathname === "/explore" ||
        (pathname.startsWith("/projects/") && pathname !== "/projects/create");

      if (!isPublicPath) {
        router.push("/login");
      }
    }
  }, [user, loading, pathname, router]);

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
    clearCurrentUser();
    notifyUserChange();
    router.push("/login");
  };

  return { user, loading, logout, router };
}
