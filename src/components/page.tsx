import UniversitiesHeader from "@/components/UniversitiesHeader";
import Universities from "@/components/Universities";
import Footer from "@/components/Footer";

export const metadata = {
  title: 'Nuestras Universidades | UniEvents',
};

export default function UniversitiesPage() {
  return (
    <div className="bg-[#f8fafc]">
      <UniversitiesHeader />
      <Universities />
      <Footer />
    </div>
  );
}