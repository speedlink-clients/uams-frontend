import { Box } from "@chakra-ui/react";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import SecureFuture from "./components/SecureFuture";
import Programmes from "./components/Programmes";
import LatestNews from "./components/LatestNews";
import LibrarySection from "./components/LibrarySection";
import ResourcesSection from "./components/ResourcesSection";
import NewsletterSection from "./components/NewsletterSection";

const LandingPage = () => {
  return (
    <Box bg="white">
      <Hero />
      <Stats />
      <About />
      <SecureFuture />
      <Programmes />
      <LatestNews />
      <LibrarySection />
      <ResourcesSection />
      <NewsletterSection />
    </Box>
  );
};

export default LandingPage;
