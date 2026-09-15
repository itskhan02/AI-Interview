import { BrainCircuit } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 px-6 py-10 mt-5">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500">
              <BrainCircuit className="h-5 w-5 text-amber-300" />
            </span>
            <span className="gradient-text text-2xl">IntelliPrep.AI</span>
          </div>
          <p className="max-w-md text-sm leading-6 text-slate-400">
            Your personal AI interview coach for technical, HR, and behavioral
            practice with real-time feedback.
          </p>
        </div>

        <nav className="md:col-span-2 md:justify-self-end" aria-label="Footer">
          <ul className="flex flex-wrap gap-4 text-sm text-slate-400">
            <li>
              <a href="#about" className="transition hover:text-cyan-200">
                About
              </a>
            </li>
            <li>
              <a href="#features" className="transition hover:text-cyan-200">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="transition hover:text-cyan-200">
                Pricing
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mx-auto mt-8 flex max-w-6xl flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center">
        <p>© {currentYear} IntelliPrep.AI. Built for ambitious engineers.</p>
        <div className="flex flex-wrap gap-5">
          <a href="#" className="transition hover:text-slate-300">
            Privacy Policy
          </a>
          <a href="#" className="transition hover:text-slate-300">
            Terms of Service
          </a>
          <a href="#" className="transition hover:text-slate-300">
            Cookie Settings
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
