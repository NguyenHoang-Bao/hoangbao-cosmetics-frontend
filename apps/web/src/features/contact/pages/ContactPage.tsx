import { useEffect } from "react";
import ContactHero from "../components/ContactHero";
import ContactInfo from "../components/ContactInfo";
import ContactForm from "../components/ContactForm";
import ContactMap from "../components/ContactMap";

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-gray-50 text-gray-900 min-h-screen">
      <ContactHero />

      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            <ContactInfo />
            <ContactForm />
          </div>
        </div>
      </section>

      <ContactMap />
    </main>
  );
}

export { ContactPage };
