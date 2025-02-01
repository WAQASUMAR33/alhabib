
import AboutUs from "./components/AboutUs";
import FeaturedPackages from "./components/FeaturedPackages";
import Headers from "./components/Header";
import Herosection from "./components/Herosection";
import Destinations from "./components/PopularDistinations";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import WhyChooseUs from "./components/WhyChooseUs";
import Contact from "./components/ContactInformation";
import Newsletter from "./components/NewsLetter";
import Partners from "./components/PartenerLogos";
import Footer from "./components/Footer";
import NewHeroSection from "./components/NewHeroSection";
import TwoCards from "./components/TwoCardSection";
import CallToAction from "./components/CallToAction";
import WhatsAppButton from "./components/WhatsappPlugin";

export default function Home(){
  return(
    <>
    <WhatsAppButton/>
    <Headers/>
    <NewHeroSection/>
    {/* <Herosection/> */}
    <Services/>
    <AboutUs/>
    <Destinations/>
    <TwoCards/>
    <FeaturedPackages/>
    <Testimonials/>
    <WhyChooseUs/>
    {/* <CallToAction/> */}
    <CallToAction/>
    <Contact/>
    <Newsletter/>
    <Partners/>
    <Footer/>
    </>
  )
}