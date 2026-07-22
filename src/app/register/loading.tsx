import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RegisterLoading() {
  return (
    <div className="bg-surface-bright min-h-screen flex flex-col pt-16 animate-pulse">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-10">
        <div className="w-full max-w-3xl bg-surface-white rounded-3xl shadow-xl p-8 md:p-12 border border-outline-variant/30 space-y-8">
          <div className="flex flex-col items-center">
            <div className="h-12 w-64 bg-surface-container-high rounded-xl mb-4"></div>
            <div className="h-4 w-96 bg-surface-container rounded-lg"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl"></div>
            <div className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl"></div>
            <div className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl"></div>
            <div className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl"></div>
          </div>
          <div className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl"></div>
          <div className="h-14 w-full bg-surface-container-high rounded-xl mt-8"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
