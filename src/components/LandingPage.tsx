import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, ArrowUpRight, ChevronDown, X } from "lucide-react";
import MindMapGraphic from "./MindMapGraphic";
import CommitmentToImplementationSection from "./CommitmentToImplementationSection";
import HowToUseSection from "./HowToUseSection";
import CountryJourneysPromo from "./CountryJourneysPromo";
import { logoOrDefault } from "./Footer";
import { HomePageContent, defaultHomePageContent } from "../services/airtableService";
import { RoadmapPillar } from "../data/champRoadmapData";
import { ChampPledge } from "../data/champPledgesData";
import { resolveAssetUrl, defaultHeroImage } from "../utils/assetUtils";
import champWordmark from "../assets/champ-wordmark-dark-green.png";

const KEY_PUBLICATIONS = [
  {
    org: "GCoM, Bloomberg and C40 Cities",
    title: "How National Governments can Increase Finance for Subnational Climate Action",
    description:
      "The report presents implementation options, proven financial techniques, and coordination frameworks based on mainstream recognized expert research, leveraging the extensive body of studies conducted by Multilateral Development Banks, other development partners, the United Nations, the International Monetary Fund, and the private sector, including international rating agencies.",
    url: "https://www.c40.org/wp-content/uploads/2025/02/CHAMP-Guidebook-Executive-Summary.pdf",
  },
  {
    org: "LGMA Constituency and Bloomberg",
    title: "The CHAMP Opportunity: A Toolkit for Cities, Towns, States and Regions to Take Action on Climate Change",
    description:
      "The publication highlights the importance of the Coalition for High Ambition Multilevel Partnerships (CHAMP), explores the role of subnational governments in delivering climate goals, and examines how national governments are already supporting climate action in their communities. It demonstrates the opportunities for governments at all levels to work together to accelerate climate ambition and implementation.",
    url: "https://www.cities-and-regions.org/wp-content/uploads/champ-toolkit-subnationals.pdf",
  },
  {
    org: "WRI",
    title: "Stronger NDCs With Cities, States, and Regions: Recommendations for National Governments",
    description:
      "This document supports national governments in strengthening the subnational content of the NDCs to reflect the highest possible ambition and increase the likelihood of implementation.",
    url: "https://www.champ-climate.org/resources/stronger-ndcs-cities-states-and-regions-recommendations-national-governments",
  },
  {
    org: "UN-Habitat",
    title: "Urban Content in NDC 3.0: Cities at the Centre",
    description:
      "This report is the most comprehensive global analysis to date of how cities feature in national climate plans. Drawing on 142 third-generation Nationally Determined Contributions (NDCs 3.0) submitted by mid-April 2026, the report delivers findings across sectors, regions, income groups, and NDC revision cycles, at a scale and depth not previously possible.",
    url: "https://unhabitat.org/urban-content-in-ndc-30-cities-at-the-centre",
  },
  {
    org: "WRI",
    title: "Financing Country Platforms",
    description:
      "This expert note explains how country platforms are a way for governments to align public and private, national and international finance at scale behind country-led plans and policy reforms to deliver climate, nature, and development goals. It seeks to set out the roles different financial actors can play in successful country platforms and aims to inform governments interested in setting up platforms as well as finance providers and others engaged in the process.",
    url: "https://www.wri.org/climate/financing-country-platforms",
  },
  {
    org: "ICLEI",
    title: "Multilevel Governance for Integrated Urban Planning",
    description:
      "This guide explores a practical approach to strengthening multilevel governance based on UrbanShift learnings across nine countries. Through National–Local Dialogues addressing multilevel governance and other high-impact topics for local climate action, national and local governments co-designed pathways to support national targets. The process resulted in eight co-developed Country Roadmaps, owned by participating governments, which outline how multilevel governance can advance coordinated action and collaboration across different levels of government.",
    url: "https://iclei.org/e-library/multilevel-governance-for-integrated-urban-planning/",
  },
];

interface LandingPageProps {
  onStart: () => void;
  onIntro: () => void;
  onNavigateToStep?: (stepId: number, pathwayIdx?: number, example?: any) => void;
  actionsData?: any[];
  homePageData?: HomePageContent;
  onOpenRoadmap?: (componentId?: string) => void;
  onExploreAllActions?: () => void;
  onExploreCountryJourneys?: () => void;
  countryJourneysImage?: string;
  roadmapPillars?: RoadmapPillar[];
  champPledges?: ChampPledge[];
}

function renderFormattedText(text: string) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="text-ink font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function LandingPage({ 
  onStart, 
  onIntro, 
  onNavigateToStep, 
  actionsData,
  homePageData = defaultHomePageContent,
  onOpenRoadmap,
  onExploreAllActions,
  onExploreCountryJourneys,
  countryJourneysImage,
  roadmapPillars,
  champPledges
}: LandingPageProps) {
  const hero = homePageData?.hero || defaultHomePageContent.hero;
  const partnership = homePageData?.partnership || defaultHomePageContent.partnership;
  const [isKeyResourcesOpen, setIsKeyResourcesOpen] = useState(false);
  const [expandedResources, setExpandedResources] = useState<Record<number, boolean>>({});

  const toggleResourceExpand = (idx: number) => {
    setExpandedResources((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isKeyResourcesOpen) {
        setIsKeyResourcesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isKeyResourcesOpen]);

  return (
    <div className="w-full pb-16 overflow-x-hidden">
      {/* Hero: full-bleed photo with the content panel centred on it */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full min-h-[350px] md:min-h-[440px] flex items-center py-10 md:py-14 overflow-hidden group"
      >
        <img
          src={resolveAssetUrl(hero.imageUrl, defaultHeroImage)}
          alt="Aerial view of Stockholm's Södra Länken highway and Slussen transit interchange"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== defaultHeroImage) {
              target.src = defaultHeroImage;
            }
          }}
        />

        {/* Content panel: on the photo, left-aligned with the content column of the sections below */}
        <div className="relative w-full px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
        <div className="w-full max-w-3xl bg-surface flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-8 md:py-10">
          {hero.eyebrow && (
            <span className="text-[11px] text-accent uppercase tracking-[0.15em] mb-2">
              {hero.eyebrow}
            </span>
          )}

          <h1 className="font-display font-bold text-[44px] sm:text-[52px] lg:text-[60px] leading-[1.1] text-dark-green mb-4">
            {hero.titleBadge}{hero.titleBadge && hero.titleMain ? " " : ""}{hero.titleMain || "Toolkit"}
            {hero.titleSub && (
              <span className="block mt-1 font-light text-2xl sm:text-3xl lg:text-4xl">
                {hero.titleSub}
              </span>
            )}
          </h1>

          {hero.description && (
            <p className="body-text-md leading-relaxed">
              {hero.description}
            </p>
          )}
        </div>
        </div>
        </div>
      </motion.div>

      {/* Explore 5 actions: full-bleed grey band */}
      <div className="bg-grey-light">
      <div className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        {/* Expandable Mind Map Section */}
        <motion.div 
          id="five-actions-section"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex flex-col items-center w-full scroll-mt-6"
        >
          <MindMapGraphic 
            onNavigateToStep={onNavigateToStep || (() => {})} 
            actionsData={actionsData} 
            showFilter={false}
            showCardFooter={false}
            cardsNavigate
            onExploreAll={onExploreAllActions}
          />
        </motion.div>
      </div>
      </div>

      {/* Country Journeys promo: full-bleed band */}
      <div>
        <CountryJourneysPromo
          imageUrl={countryJourneysImage}
          imageAlt="City skyline"
          onExplore={onExploreCountryJourneys || (() => {})}
        />
      </div>

      <div className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto mt-14 md:mt-16 space-y-10">
        {/* How to use this Toolkit: carousel, one step per slide */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="w-full"
        >
          <HowToUseSection id="how-to-use" content={homePageData?.howToUse} />
        </motion.div>

      </div>

      {/* From Commitment to Implementation: full-bleed white band */}
      <div className="bg-surface mt-14 md:mt-16">
        <div className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto py-14 md:py-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full"
          >
            <CommitmentToImplementationSection 
              onNavigateToStep={onNavigateToStep}
              onOpenRoadmap={onOpenRoadmap || (() => {})}
              roadmapPillars={roadmapPillars}
              champPledges={champPledges}
            />
          </motion.div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 max-w-7xl mx-auto mt-14 md:mt-16 space-y-10">
        {/* Partnership Section - Original Prominent Composition & Large Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <div className="bg-surface p-10 md:p-12 border border-line flex flex-col gap-10">
            <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
              <div className="md:w-5/12 space-y-6 flex flex-col justify-center">
                <h2 className="title-h2 text-dark-green">
                  {partnership.title || "A Joint Contribution to CHAMP"}
                </h2>
                <p className="body-text leading-relaxed">
                  {renderFormattedText(partnership.description || "This toolkit is a strategic partnership between CCFLA and Viable Cities. A key goal of this toolkit is to showcase impactful multilevel governance initiatives championed in Sweden.")}
                </p>
              </div>

              <div className="md:w-7/12 w-full flex flex-col items-center justify-between gap-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 w-full">
                  {partnership.partner1LogoUrl && (
                    <a 
                      href={partnership.partner1Url || "https://citiesclimatefinance.org"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex justify-end items-center hover:opacity-85 transition-opacity"
                      title={partnership.partner1Name || "Cities Climate Finance Leadership Alliance"}
                    >
                      <img 
                        src={logoOrDefault(partnership.partner1LogoUrl, defaultHomePageContent.partnership.partner1LogoUrl)} 
                        alt={partnership.partner1Name || "CCFLA"} 
                        className="h-32 md:h-40 object-contain mix-blend-multiply" 
                        referrerPolicy="no-referrer"
                      />
                    </a>
                  )}
                  {partnership.partner1LogoUrl && partnership.partner2LogoUrl && (
                    <div className="hidden sm:block w-px h-24 bg-line shrink-0"></div>
                  )}
                  {partnership.partner2LogoUrl && (
                    <a 
                      href={partnership.partner2Url || "https://viablecities.se"} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex justify-start items-center hover:opacity-85 transition-opacity"
                      title={partnership.partner2Name || "Viable Cities"}
                    >
                      <img 
                        src={logoOrDefault(partnership.partner2LogoUrl, defaultHomePageContent.partnership.partner2LogoUrl)} 
                        alt={partnership.partner2Name || "Viable Cities"} 
                        className="h-16 md:h-20 object-contain mix-blend-multiply opacity-90" 
                        referrerPolicy="no-referrer"
                      />
                    </a>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-6 sm:gap-10 pt-6 border-t border-line w-full md:w-11/12">
                  <div className="flex flex-col items-start">
                    <span className="text-ink-muted text-xs uppercase tracking-widest font-semibold mb-4 whitespace-nowrap">
                      For
                    </span>
                    <a
                      href="https://www.champ-climate.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:opacity-85 transition-opacity"
                      title="CHAMP – Coalition for High Ambition Multilevel Partnerships for Climate Action"
                    >
                      <img
                        src={champWordmark}
                        alt="CHAMP – Coalition for High Ambition Multilevel Partnerships for Climate Action"
                        className="w-52 md:w-60 max-w-full h-auto object-contain"
                      />
                    </a>
                  </div>
                  {(partnership.supportedByLogoUrl || partnership.supportedByName) && (
                    <>
                      <div className="hidden sm:block w-px h-20 bg-line shrink-0"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-ink-muted text-xs uppercase tracking-widest font-semibold mb-4 whitespace-nowrap">
                          {partnership.supportedByLabel || "Supported by"}
                        </span>
                        {partnership.supportedByLogoUrl && (
                          <img
                            src={partnership.supportedByLogoUrl}
                            alt={partnership.supportedByName || "Sponsor"}
                            className="w-16 object-contain shadow-sm rounded-sm"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Key Resources on Multilevel Climate Action Section inside the Joint Contribution Box */}
            <div className="pt-8 border-t border-line flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-dark-green mb-1.5">
                  Key Resources on Multilevel Climate Action
                </h3>
                <p className="body-text-md text-ink-muted">
                  Selected publications and guidance informing and complementing the CHAMP Toolkit
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsKeyResourcesOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold uppercase tracking-wider rounded-none hover:bg-dark-green transition-colors cursor-pointer shrink-0 self-start sm:self-center"
              >
                Explore Resources <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Key Resources Popup Modal */}
      <AnimatePresence>
        {isKeyResourcesOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/60 backdrop-blur-xs"
            onClick={() => setIsKeyResourcesOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-line shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden rounded-none"
            >
              <div className="px-6 sm:px-8 py-6 border-b border-line flex items-start justify-between gap-4 bg-paper">
                <div>
                  <h3 className="title-h2 text-dark-green">
                    Key Resources on Multilevel Climate Action
                  </h3>
                  <p className="body-text-sm text-ink-muted mt-1">
                    Selected publications and guidance informing and complementing the CHAMP Toolkit
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsKeyResourcesOpen(false)}
                  className="p-2 text-ink-muted hover:text-ink hover:bg-surface transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  {KEY_PUBLICATIONS.map((item, idx) => {
                    const isExpanded = Boolean(expandedResources[idx]);
                    return (
                      <div
                        key={idx}
                        className="w-full p-5 bg-surface border border-line hover:border-accent transition-all flex flex-col justify-between gap-3 rounded-none"
                      >
                        <div className="flex items-start justify-between gap-4 sm:min-h-[88px]">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex-1 min-w-0"
                          >
                            <span className="block body-text-sm font-semibold text-ink group-hover:text-dark-green leading-snug">
                              <span className="text-accent font-bold">{item.org} – </span>
                              <span>{item.title}</span>
                            </span>
                          </a>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open resource"
                            aria-label={`Open ${item.org} – ${item.title}`}
                            className="shrink-0 p-1 -m-1 text-accent hover:text-dark-green transition-colors mt-0.5"
                          >
                            <ArrowUpRight size={18} />
                          </a>
                        </div>

                        <div className="pt-2.5 border-t border-line/70 flex flex-col mt-auto">
                          <button
                            type="button"
                            onClick={() => toggleResourceExpand(idx)}
                            aria-expanded={isExpanded}
                            className="inline-flex items-center justify-between w-full text-xs font-semibold text-accent hover:text-dark-green transition-colors cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide summary" : "See summary"}</span>
                            <ChevronDown
                              size={15}
                              strokeWidth={2.2}
                              className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                              >
                                <p className="body-text-sm text-ink-muted leading-relaxed pt-3">
                                  {item.description}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


