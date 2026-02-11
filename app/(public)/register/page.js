import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Register - AMU AcadNet",
  description: "Join the AMU Academic Network",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('/grid-pattern.svg')]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        {/* Logo removed as it is in Global Navbar */}
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-125">
        <RegisterForm />
      </div>
    </div>
  );
}
