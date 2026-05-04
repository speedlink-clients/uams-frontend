import { Box } from "@chakra-ui/react";
import Hero from "../../../components/shared/Hero";
import Stats from "../../../components/shared/Stats";
import About from "../../../components/shared/About";
import SecureFuture from "../../../components/shared/SecureFuture";
import Programmes from "../../../components/shared/Programmes";
import LatestNews from "../../../components/shared/LatestNews";
import LibrarySection from "../../../components/shared/LibrarySection";
import ResourcesSection from "../../../components/shared/ResourcesSection";
import NewsletterSection from "../../../components/shared/NewsletterSection";

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
