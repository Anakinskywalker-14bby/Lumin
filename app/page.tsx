import { Navbar } from "@/components/Navbar";
import Slideshow from "@/components/ui/slideshow";
import { Investigator, WOMAN, MAN } from "@/components/Investigator";
import { IntroTitle } from "@/components/IntroTitle";
import { Waitlist } from "@/components/Waitlist";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="grain">
      <Navbar />
      <main>
        <Slideshow />
        <Investigator subject={WOMAN} />
        <Investigator subject={MAN} />
        <IntroTitle />
        <Waitlist />
      </main>
      <Footer />
    </div>
  );
}
