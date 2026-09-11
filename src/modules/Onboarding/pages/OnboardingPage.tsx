import { Navbar } from '../components/Navbar';

export function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-brand-black mb-6">
            aqui haras tu magia amor
          </h1>
          {/* te amito */}
        </div>
      </main>
    </div>
  );
}
