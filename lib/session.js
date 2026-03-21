import { cookies } from "next/headers";

export const setSession = async (user) => {
  (await cookies()).set("session", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
};

export const getSession = async () => {
  const session = (await cookies()).get("session");
  if (!session) return null;

  try {
    const user = JSON.parse(session.value);
    return user;
  } catch (_error) {
    return null;
  }
};

export const deleteSession = async () => {
  (await cookies()).delete("session");
};
