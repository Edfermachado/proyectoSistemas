import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomeLoading() {
  return (
    <div className="bg-surface-bright min-h-screen flex flex-col pt-16 animate-pulse">
      <Header />
      <main className="flex-grow">
        {/* Hero Skeleton */}
        <div className="w-full h-[60vh] bg-surface-container-high flex flex-col items-center justify-center p-8 space-y-6">
          <div className="h-12 w-3/4 md:w-1/2 bg-surface-container-highest rounded-xl"></div>
          <div className="h-6 w-1/2 md:w-1/3 bg-surface-container rounded-lg"></div>
          <div className="h-12 w-48 bg-university-blue/30 rounded-xl mt-6"></div>
        </div>
        
        {/* Content Section Skeleton */}
        <div className="max-w-7xl mx-auto w-full px-4 py-16 space-y-16">
          <div>
            <div className="h-10 w-64 bg-surface-container-high rounded-xl mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-72 w-full bg-surface-container-lowest rounded-3xl border border-outline-variant/30"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
