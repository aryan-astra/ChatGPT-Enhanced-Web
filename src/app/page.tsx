import Header from "@/components/sections/header";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import Architecture from "@/components/sections/architecture";
import Privacy from "@/components/sections/privacy";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Architecture />
        <Privacy />
      </main>
      <Footer />
    </>
  );
}
