import React, { useState, useMemo } from "react";
import { Card, Tabs, Badge } from "@nofinite/nui";
import { showcaseTabs } from "../../data";
import { OverviewTab, FormsTab, FeedbackTab, DataTab } from "../showcase-tabs";

type TabValue = "overview" | "forms" | "feedback" | "data";

export const ComponentShowcase: React.FC = () => {
  const [tab, setTab] = useState<TabValue>("overview");

  const tabs = useMemo(() => showcaseTabs, []);

  const handleTabChange = (value: string): void => {
    setTab(value as TabValue);
  };

  const renderTabContent = (): React.ReactNode => {
    switch (tab) {
      case "overview":
        return <OverviewTab />;
      case "forms":
        return <FormsTab />;
      case "feedback":
        return <FeedbackTab />;
      case "data":
        return <DataTab />;
      default:
        return null;
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">Component showcase</h2>
          <p className="mt-2 text-[var(--nui-fg-subtle)]">
            Use actual NUI patterns instead of hand-rolled demo controls.
          </p>
        </div>
        <Badge variant="default">Built with documented components</Badge>
      </div>

      <Card className="border-[var(--nui-border-default)]">
        <Card.Body className="space-y-6">
          <Tabs value={tab} onValueChange={handleTabChange} items={tabs} />
          {renderTabContent()}
        </Card.Body>
      </Card>
    </section>
  );
};