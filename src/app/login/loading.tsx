import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LoginLoading() {
  return (
    <div className="bg-surface-bright min-h-screen flex flex-col pt-16">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-10 animate-pulse">
        <div className="w-full max-w-5xl bg-surface-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-outline-variant/30">
          <div className="hidden md:flex md:w-1/2 bg-university-blue/40"></div>
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface-white space-y-6">
            <div className="h-12 w-full bg-surface-container rounded-xl mb-4"></div>
            <div className="h-8 w-1/2 bg-surface-container-high rounded-xl mb-6"></div>
            <div className="space-y-4">
              <div className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl"></div>
              <div className="h-14 w-full bg-surface-container-lowest border border-outline-variant rounded-xl"></div>
            </div>
            <div className="h-4 w-3/4 bg-surface-container-lowest mt-4 rounded-xl"></div>
            <div className="h-14 w-full bg-surface-container-high rounded-xl mt-8"></div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
