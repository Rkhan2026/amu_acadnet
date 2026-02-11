import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
