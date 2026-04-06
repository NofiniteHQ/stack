'use client';
import React, { useState } from "react";
import { Badge, Button, Card, Input, Select, Stepper, useToast } from "@nofinite/nui";
import { StatCard } from "../ui";
import { heroStats, preferredSetupOptions } from "../../data";

export const HeroSection: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const toast = useToast(); // <--- hook to show toasts

  const handleExploreClick = () => toast.show("Opening component flow...", { variant: "success" });
  const handleSaveChanges = () => toast.show("Saved successfully.", { variant: "success" });
  const handleShowAlert = () =>
    toast.show("This is an info alert.", { variant: "default", description: "Accessible toast example" });
  const handleConfirmFlow = () =>
    toast.show("Publish updates?", { variant: "warning", description: "Review your changes before publishing" });

  return (
    <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 p-4 sm:p-6 lg:p-8">
      {/* Left Hero Content */}
      <div className="space-y-6 flex flex-col">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="warning">Open source</Badge>
          <Badge variant="success">React components</Badge>
          <Badge variant="default">Accessible patterns</Badge>
        </div>

        {/* Title & Description */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Build better product interfaces with{" "}
            <span style={{ color: "var(--nui-accent)" }}>NUI</span>
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--nui-fg-subtle)] max-w-full sm:max-w-2xl">
            Use documented components for forms, feedback, overlays, structured data, and guided flows — all in a UI
            system built for real React applications.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button size="lg" onClick={handleExploreClick}>
            Explore components
          </Button>
          <Button size="lg" variant="outline">
            View documentation
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {heroStats.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </div>

      {/* Right Card */}
      <Card className="overflow-hidden border-[var(--nui-border-default)] shadow-sm w-full">
        <Card.Header>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col">
              <p className="text-lg font-semibold">Product UI preview</p>
              <p className="text-sm text-[var(--nui-fg-subtle)]">
                A practical mix of form, workflow, and feedback components.
              </p>
            </div>
            <Badge variant="warning">Live style</Badge>
          </div>
        </Card.Header>

        <Card.Body className="space-y-5">
          {/* Stepper */}
          <div className="rounded-xl border border-[var(--nui-border-default)] bg-[var(--nui-bg-page)] p-4">
            <Stepper steps={["Account", "Workspace", "Finish"]} active={step} onChange={setStep} />
          </div>

          {/* Inputs */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Email address" type="email" />
            <Select placeholder="Preferred setup" options={preferredSetupOptions} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSaveChanges}>Save changes</Button>
            <Button variant="outline" onClick={handleShowAlert}>
              Show alert
            </Button>
            <Button variant="ghost" onClick={handleConfirmFlow}>
              Confirm flow
            </Button>
          </div>
        </Card.Body>
      </Card>
    </section>
  );
};