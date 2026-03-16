import { Box } from "@chakra-ui/react";
import Hero from "./components/Hero";
import Stats from "./Stats";
import About from "./components/About";
import SecureFuture from "./SecureFuture";
import Programmes from "./components/Programmes";
import LatestNews from "./components/LatestNews";
import LibrarySection from "./components/LibrarySection";
import ResourcesSection from "./components/ResourcesSection";
import NewsletterSection from "./components/NewsletterSection";

const LandingPage = () => {
  
  return (
    <Box bg="white">
      <Hero id="home" />
      <Stats />
      <About id="about" />
      <SecureFuture />
      <Programmes />
      <LatestNews id="research" />
      <LibrarySection />
      <ResourcesSection />
      <NewsletterSection />
    </Box>
  );
};

export default LandingPage;
