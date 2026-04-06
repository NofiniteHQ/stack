import React from "react";
import "@nofinite/nuicss";

import { Header, Footer } from "./components/layout";
import {
  HeroSection,
  FeatureCardsSection,
  ComponentShowcase,
  UserManagementSection,
  CTASection,
} from "./components/sections";

const App: React.FC = () => {

  return (
    <div

      className="min-h-screen bg-(--nui-bg-page) text-(--nui-fg-default)"
    >
      {/* Background gradient */}
      <div className="absolute inset-x-0 top-0 h-[28rem] pointer-events-none bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_55%)]" />

      <Header />

      <main className="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 py-8 sm:px-6 sm:py-12 lg:gap-24 lg:px-8 lg:py-16">
        <HeroSection />
        <FeatureCardsSection />
        <ComponentShowcase />
        <UserManagementSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
};

export default App;