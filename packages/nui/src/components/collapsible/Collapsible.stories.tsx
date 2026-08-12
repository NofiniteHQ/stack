import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';
import { Settings2 } from 'lucide-react';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Data Display/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg 
    className={`text-muted transition-transform duration-200 ease-in-out w-4 h-4 group-data-[state=open]:text-primary ${className}`}
    width="20" height="20" viewBox="0 0 24 24" 
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapsible>
        <CollapsibleTrigger>
          Click to expand
          <ChevronIcon className="group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          This is the hidden content inside the collapsible. Notice how it smoothly animates open using framer-motion!
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const OpenByDefault: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapsible defaultOpen>
        <CollapsibleTrigger>
          Already open
          <ChevronIcon className="group-data-[state=open]:rotate-180" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          This content is visible immediately.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};

export const CustomLayout: Story = {
  render: () => (
    <div className="w-[400px]">
      <Collapsible>
        <CollapsibleTrigger className="justify-start gap-3">
          <Settings2 className="w-5 h-5 text-muted group-data-[state=open]:text-primary" />
          Advanced Settings
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-8">
          By using Compound Components (Collapsible, CollapsibleTrigger, CollapsibleContent), you have complete flexibility to compose the trigger exactly how you want. You can put icons on the left, right, or nowhere at all!
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
