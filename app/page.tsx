import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { BrandWorld } from "@/components/BrandWorld";
import { Configurator } from "@/components/Configurator";
import { Science } from "@/components/Science";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BrandWorld />
        <Science />
        <Configurator />
      </main>
      <Footer />
    </>
  );
}
