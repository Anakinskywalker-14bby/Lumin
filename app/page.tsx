import { Navbar } from "@/components/Navbar";
import Slideshow from "@/components/ui/slideshow";
import { FaceScan } from "@/components/FaceScan";
import { IntroTitle } from "@/components/IntroTitle";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="grain">
      <Navbar />
      <main>
        <Slideshow />
        <FaceScan />
        <IntroTitle />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
