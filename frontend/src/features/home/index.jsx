import HeroSection from "./components/HeroSection";
import Features from "./components/Features";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";
import Header from "./components/Header";

function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <Features />
      <Pricing />
      <Footer />
    </>
  );
}

export default Home;
