import { useEffect } from "react";
import AboutHero from "../components/AboutHero";
import AboutStory from "../components/AboutStory";
import AboutCoreValues from "../components/AboutCoreValues";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-appBg text-gray-900 min-h-screen">
      <AboutHero />
      <AboutStory />
      <AboutCoreValues />
    </main>
  );
}

export { About as AboutPage };
