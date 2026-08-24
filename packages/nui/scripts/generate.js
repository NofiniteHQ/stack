/* eslint-disable */
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getTemplates = (componentName) => {
  const kebabName = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  
  const componentTemplate = `import React from 'react';
import { cn, Slot } from '../../utils';

export interface ${componentName}Props extends React.HTMLAttributes<HTMLDivElement> {
  /** Renders the component using its child element */
  asChild?: boolean;
}

/**
 * ${componentName}
 * * A beautifully crafted ${componentName} component.
 */
export function ${componentName}({ className, asChild, ...props }: ${componentName}Props) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp 
      className={cn("${kebabName}", className)} 
      {...props}
    />
  );
}
`;

  const testTemplate = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders correctly', () => {
    render(<${componentName}>Test</${componentName}>);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<${componentName}>Accessible Content</${componentName}>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
`;

  const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import { within, expect } from '@storybook/test';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: 'Components/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {
    children: '${componentName} Content',
  },
};

export const InteractiveTest: Story = {
  args: {
    children: 'Interactive',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const element = canvas.getByText('Interactive');
    await expect(element).toBeInTheDocument();
  },
};
`;

  return { componentTemplate, testTemplate, storyTemplate };
};

rl.question('What is the name of your new component? (e.g. Button, DatePicker): ', (name) => {
  const componentName = name.trim();
  if (!componentName) {
    console.error('Component name is required!');
    process.exit(1);
  }

  // Ensure PascalCase
  if (componentName[0] !== componentName[0].toUpperCase()) {
    console.error('Component name must be PascalCase (e.g. MyComponent)');
    process.exit(1);
  }

  const folderName = componentName.toLowerCase();
  const targetDir = path.join(__dirname, '..', 'src', 'components', folderName);

  if (fs.existsSync(targetDir)) {
    console.error(\`Component \${componentName} already exists!\`);
    process.exit(1);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  const { componentTemplate, testTemplate, storyTemplate } = getTemplates(componentName);

  fs.writeFileSync(path.join(targetDir, \`\${componentName}.tsx\`), componentTemplate);
  fs.writeFileSync(path.join(targetDir, \`\${componentName}.test.tsx\`), testTemplate);
  fs.writeFileSync(path.join(targetDir, \`\${componentName}.stories.tsx\`), storyTemplate);
  fs.writeFileSync(path.join(targetDir, \`index.ts\`), \`export * from './\${componentName}';\\n\`);

  // Update root exports
  const indexFile = path.join(__dirname, '..', 'src', 'components', 'index.ts');
  if (fs.existsSync(indexFile)) {
    let indexContent = fs.readFileSync(indexFile, 'utf8');
    indexContent += \`export * from './\${folderName}';\\n\`;
    fs.writeFileSync(indexFile, indexContent);
  }

  console.log(\`✅ Successfully generated \${componentName}!\`);
  console.log(\`📂 Location: src/components/\${folderName}\`);
  process.exit(0);
});
