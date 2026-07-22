import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ProfileLoading() {
  return (
    <div className="bg-surface-bright min-h-screen font-body-md flex flex-col pt-20 animate-pulse">
      <Header />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar Skeleton */}
          <div className="col-span-1 space-y-6">
            <div className="bg-surface-white rounded-3xl p-8 shadow-sm border border-outline-variant/30 text-center flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-surface-container-high mb-6"></div>
              <div className="h-6 w-3/4 bg-surface-container mb-4 rounded-xl"></div>
              <div className="h-4 w-1/2 bg-surface-container-low mb-6 rounded-xl"></div>
              <div className="w-full flex justify-center gap-4 border-t border-outline-variant/30 pt-6">
                <div className="h-10 w-24 bg-surface-container rounded-xl"></div>
                <div className="h-10 w-24 bg-surface-container rounded-xl"></div>
              </div>
            </div>
          </div>
          {/* Tickets & Events Skeleton */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="bg-surface-white rounded-3xl p-8 shadow-sm border border-outline-variant/30 min-h-[400px]">
              <div className="h-8 w-48 bg-surface-container-high rounded-xl mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-full h-24 bg-surface-container-lowest border border-outline-variant/50 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
