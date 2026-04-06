import React, { useState, type ChangeEvent } from "react";
import { Card, Button, Input, Select, Stepper, nui } from "@nofinite/nui";
import { frameworkOptions } from "../../data";

export const FormsTab: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [framework, setFramework] = useState<string>("");
  const [step, setStep] = useState<number>(1);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleFrameworkChange = (value: string): void => {
    setFramework(value);
  };

  const handleSignup = async (): Promise<void> => {
    if (!email || !password || !framework) {
      await nui.alert({
        title: "Complete the form",
        description: "Add your email, password, and preferred framework.",
        variant: "warning",
      });
      return;
    }
    nui.success("Account flow submitted.");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <Card>
        <Card.Header>Create account</Card.Header>
        <Card.Body className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Framework</label>
            <Select
              placeholder="Choose framework"
              value={framework}
              onChange={handleFrameworkChange}
              options={frameworkOptions}
            />
          </div>

          <Button className="w-full sm:w-auto" onClick={handleSignup}>
            Create account
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>Progress flow</Card.Header>
        <Card.Body className="space-y-4">
          <Stepper
            steps={["Info", "Team", "Review"]}
            active={step}
            onChange={setStep}
          />
          <p className="text-sm leading-6 text-[var(--nui-fg-subtle)]">
            Stepper works well for onboarding, multi-step forms, and sequential
            product flows.
          </p>
        </Card.Body>
      </Card>
    </div>
  );
};