import { motion } from "motion/react";
import MindMapGraphic from "./MindMapGraphic";
import SplitHero from "./SplitHero";

interface ActionsOverviewProps {
  actionsData?: any[];
  onNavigateToStep: (stepId: number, pathwayIdx?: number, example?: any) => void;
  heroImage: string;
}

export default function ActionsOverview({ actionsData, onNavigateToStep, heroImage }: ActionsOverviewProps) {
  return (
    <div className="w-full">
      <SplitHero title="Actions" imageUrl={heroImage} imageAlt="Aerial view of a city">
        <div className="space-y-3 body-text-md text-ink-muted">
          <p>
            The Toolkit’s guidance is organized into five Actions that national and subnational governments can take to mobilize finance and deliver urban climate action together.
          </p>
          <p>
            Click “Explore” on any Action to see its Implementation Pathways and key resources below, or click (→) to open the Action page.
          </p>
        </div>
      </SplitHero>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 md:px-12 lg:px-16 pt-8 max-w-7xl mx-auto"
      >
        <MindMapGraphic
          onNavigateToStep={onNavigateToStep}
          actionsData={actionsData}
          showHeading={false}
          showFilter
          layout="vertical"
        />
      </motion.div>
    </div>
  );
}
