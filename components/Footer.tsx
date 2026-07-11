import { Logo } from "@/components/Logo";

export function Footer() {
  return (
    <footer className="border-t border-frost/[0.07] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:flex-row md:justify-between md:px-8 md:text-left">
        <Logo />
        <p className="hud !tracking-[0.18em]">
          © {new Date().getFullYear()} LUMIN · RECOMMENDATIONS FROM BRANDS YOU ALREADY LOVE
        </p>
      </div>
    </footer>
  );
}
