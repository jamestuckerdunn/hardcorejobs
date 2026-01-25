import {
  HeroSection,
  FeaturedJobsSection,
  ValuePropsSection,
  HowItWorksSection,
  PledgeSection,
  ForEmployersSection,
  FAQSection,
  FinalCTASection,
} from "@/components/home";

export default function Home() {
  return (
    <div className="bg-black">
      <HeroSection />
      <FeaturedJobsSection />
      <ValuePropsSection />
      <HowItWorksSection />
      <PledgeSection />
      <ForEmployersSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}
