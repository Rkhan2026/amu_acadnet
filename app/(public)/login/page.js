import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Login - AMU AcadNet",
  description: "Sign in to your AMU AcadNet account.",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo is in Navbar, keeping this clean */}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
