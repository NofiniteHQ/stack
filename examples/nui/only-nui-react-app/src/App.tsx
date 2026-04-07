'use client';

import React, { useState } from 'react';
import {
  useTheme,
  nui,
  Accordion,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Popover,
  Select,
  Stepper,
  Table,
  Tabs,
  Tooltip,
  RadioGroup,
  DatePicker,
  Breadcrumbs,
  Drawer,
  CommandPalette,
  ContextMenu,
  Dropdown
} from '@nofinite/nui';

function ThemeExample() {
  const { theme, resolved, setTheme } = useTheme();

  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Theme switcher</h3>
      </Card.Header>
      <Card.Body>
        <p style={{ marginTop: 0 }}>
          Selected: <strong>{theme}</strong> · Active: <strong>{resolved}</strong>
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button onClick={() => setTheme('light')}>Light</Button>
          <Button onClick={() => setTheme('dark')}>Dark</Button>
          <Button onClick={() => setTheme('system')}>System</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

function DialogExample() {
  const handleDelete = async () => {
    const isConfirmed = await nui.confirm(
      'Are you absolutely sure? All data will be permanently removed.',
      {
        title: 'Delete Account',
        confirmText: 'Yes, Delete',
        isDanger: true,
      }
    );

    if (!isConfirmed) {
      nui.toast('Action cancelled.');
      return;
    }

    nui.success('Account deleted successfully.');
  };


  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Dialog</h3>
      </Card.Header>
      <Card.Body>
        <p style={{ marginTop: 0 }}>
          Open a dialog using the NUI dialog system.
        </p>
        <Button variant="danger" onClick={handleDelete}>
          Open dialog
        </Button>
      </Card.Body>
    </Card>
  );
}

function FormExample() {
  const [role, setRole] = React.useState('designer');

  const options = [
    { value: 'designer', label: 'Designer' },
    { value: 'developer', label: 'Developer' },
    { value: 'founder', label: 'Founder' },
  ];

  const selectedLabel =
    options.find((opt) => opt.value === role)?.label || 'Select role';

  return (
    <Card style={{ maxWidth: 520 }}>
      <Card.Header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h3 style={{ margin: 0 }}>Create Project</h3>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>
            Set up a new project with basic details.
          </p>
        </div>
      </Card.Header>

      <Card.Body>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log({ role });
          }}
        >
          <div style={{ display: 'grid', gap: 16 }}>

            {/* Inputs */}
            <Input
              label="Project name"
              placeholder="NUI landing page"
            />

            <Input
              label="Email"
              type="email"
              placeholder="hello@example.com"
            />

            {/* Dropdown as Select */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 14, fontWeight: 500 }}>
                Role
              </label>

              <Dropdown>
                <Dropdown.Trigger>
                  <div
                    style={{
                      padding: '10px 12px',
                      border: '1px solid var(--nui-border-default)',
                      borderRadius: 8,
                      background: 'var(--nui-bg-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    {selectedLabel}
                  </div>
                </Dropdown.Trigger>

                <Dropdown.Menu>
                  {options.map((opt) => (
                    <Dropdown.Item
                      key={opt.value}
                      onSelect={() => setRole(opt.value)}
                    >
                      {opt.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginTop: 8,
              }}
            >
              <button
                type="submit"
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--nui-color-primary)',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Create Project
              </button>
            </div>

          </div>
        </form>
      </Card.Body>
    </Card>
  );
}
function StepperExample() {

  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Stepper</h3>
      </Card.Header>
      <Card.Body>
        <Stepper
          active={1}
          steps={[
            { label: 'Account', description: 'Create credentials' },
            { label: 'Profile', description: 'Personal details' },
            { label: 'Confirm', optional: true },
          ]}
        />

      </Card.Body>
    </Card>
  );
}

function AccordionExample() {
  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Accordion</h3>
      </Card.Header>
      <Card.Body>
        <Accordion
          items={[
            {
              id: "faq1",
              title: 'Why use NUI?',
              content:
                'It gives you accessible building blocks for common product UI patterns.',
            },
            {
              id: "faq2",
              title: 'Can I theme it?',
              content:
                'Yes. The useTheme hook lets you switch between light, dark, and system theme.',
            },
            {
              id: "faq3",
              title: 'Do I need utility CSS?',
              content:
                'No. You can compose a full page with NUI components and minimal inline layout styles.',
            },
          ]}
        />
      </Card.Body>
    </Card>
  );
}

function TableExample() {
  const data = [
    { id: 1, name: 'Aarav', plan: 'Pro', status: 'Active' },
    { id: 2, name: 'Mira', plan: 'Starter', status: 'Pending' },
    { id: 3, name: 'Kabir', plan: 'Enterprise', status: 'Active' },
  ];

  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Table</h3>
      </Card.Header>
      <Card.Body>
        <Table
          rowKey="id"
          data={data}
          columns={[
            {
              key: 'name',
              label: 'Name',
              render: (row) => row.name,
            },
            {
              key: 'plan',
              label: 'Plan',
              render: (row) => row.plan,
            },
            {
              key: 'status',
              label: 'Status',
              render: (row) => (
                <Badge variant={row.status === 'Active' ? 'success' : 'warning'}>
                  {row.status}
                </Badge>
              ),
            },
          ]}
        />
      </Card.Body>
    </Card>
  );
}

function ButtonExample() {
  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Buttons</h3>
      </Card.Header>
      <Card.Body>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </div>

      </Card.Body>
    </Card>
  );
}

function Section() {
  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Card</h3>
      </Card.Header>
      <Card.Body>
        This is a simple card use it and show your creativity
      </Card.Body>
    </Card>
  );
}

function ChoiceExample() {
  const [billing, setBilling] = React.useState('monthly');
  const [analytics, setAnalytics] = React.useState(true);
  const [notifications, setNotifications] = React.useState(false);

  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Checkbox &amp; Radio</h3>
      </Card.Header>
      <Card.Body>
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Checkbox
              checked={analytics}
              onChange={setAnalytics}
              label="Enable workspace analytics"
            />

            <Checkbox
              checked={notifications}
              onChange={setNotifications}
              label="Allow email notifications"
            />
          </div>

          {/* Radio Group */}
          <div style={{ display: 'grid', gap: 10 }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Billing cycle</p>

            <RadioGroup
              value={billing}
              onChange={setBilling}
              orientation="horizontal"
            >
              <label>
                <RadioGroup.Item value="monthly" />
                Monthly
              </label>

              <label>
                <RadioGroup.Item value="yearly" />
                Yearly
              </label>
            </RadioGroup>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

function TabsExample() {
  const [tab, setTab] = useState('account');

  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Tabs</h3>
      </Card.Header>
      <Card.Body>

        <div style={{ display: 'grid', gap: 14 }}>
          <Tabs defaultValue='overview' onChange={setTab}>
            <Tabs.List >
              <Tabs.Trigger value="overview" >overview</Tabs.Trigger>
              <Tabs.Trigger value="activity">activity</Tabs.Trigger>
              <Tabs.Trigger value="setting">setting</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="overview">
              <p style={{ margin: 0 }}>
                Overview content: project summary, quick stats, and recent status.
              </p>
            </Tabs.Content>
            <Tabs.Content value="activity"><p style={{ margin: 0 }}>
              Activity content: timeline items, team actions, and recent updates.
            </p></Tabs.Content>
            <Tabs.Content value="setting"><p style={{ margin: 0 }}>
              Settings content: preferences, permissions, and workspace controls.
            </p></Tabs.Content>
          </Tabs>
        </div >
      </Card.Body>
    </Card>

  );
}

function DatePickerExample() {
  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>DatePicker</h3>
      </Card.Header>
      <Card.Body>

        <DatePicker
          minDate="2026-01-01"
          maxDate="2026-12-31"
          onChange={(d) => console.log(d)}
        />
      </Card.Body>
    </Card>

  );
}

function BreadcrumbsExample() {
  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Breadcrumbs</h3>
      </Card.Header>
      <Card.Body>

        <div style={{ display: 'grid', gap: 10 }}>
          <Breadcrumbs
            items={[
              {
                label: 'Home',
                onClick: () => nui.toast('Home clicked'),
              },
              {
                label: 'Profile',
                onClick: () => nui.toast('Profile clicked'),
              },
              { label: 'Edit Profile' },
            ]}
          />
        </div>
      </Card.Body>
    </Card >
  );
}
function DrawerExample() {
  const [right, setRight] = React.useState(false);
  const [left, setLeft] = React.useState(false);
  const [top, setTop] = React.useState(false);
  const [bottom, setBottom] = React.useState(false);

  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Drawer</h3>
      </Card.Header>
      <Card.Body>
        <div
          style={{
            display: 'grid',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Button onClick={() => setRight(true)}>Open right drawer</Button>
            <Button onClick={() => setLeft(true)}>Open left drawer</Button>
            <Button onClick={() => setTop(true)}>Open top drawer</Button>
            <Button onClick={() => setBottom(true)}>Open bottom sheet</Button>
          </div>

          {/* Right drawer */}
          <Drawer
            open={right}
            onClose={() => {
              nui.toast('Right drawer closed');
              setRight(false);
            }}
            position="right"
          >
            <div style={{ padding: 24, maxWidth: 320 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                  Right panel
                </h3>
                <Button variant="ghost" onClick={() => setRight(false)}>
                  Close
                </Button>
              </div>
              <p style={{ margin: '16px 0 0', color: 'var(--nui-fg-subtle)' }}>
                Slides from the right side of the viewport.
                Use for contextual panels, details, or supplementary controls.
              </p>
            </div>
          </Drawer>

          {/* Left drawer */}
          <Drawer
            open={left}
            onClose={() => {
              nui.toast('Left drawer closed');
              setLeft(false);
            }}
            position="left"
          >
            <div style={{ padding: 24, maxWidth: 320 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                  Left sidebar
                </h3>
                <Button variant="ghost" onClick={() => setLeft(false)}>
                  Close
                </Button>
              </div>
              <p style={{ margin: '16px 0 0', color: 'var(--nui-fg-subtle)' }}>
                Slides from the left side.
                Works well as a persistent navigation or settings drawer.
              </p>
            </div>
          </Drawer>

          {/* Top drawer */}
          <Drawer
            open={top}
            onClose={() => {
              nui.toast('Top drawer closed');
              setTop(false);
            }}
            position="top"
          >
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                  Top drawer
                </h3>
                <Button variant="ghost" onClick={() => setTop(false)}>
                  Close
                </Button>
              </div>
              <p style={{ margin: '16px 0 0', color: 'var(--nui-fg-subtle)' }}>
                Slides from the top of the viewport.
                Good for notifications or quick action bars that don’t cover the whole screen.
              </p>
            </div>
          </Drawer>

          {/* Bottom sheet */}
          <Drawer
            open={bottom}
            onClose={() => {
              nui.toast('Bottom sheet closed');
              setBottom(false);
            }}
            position="bottom"
          >
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>
                  Bottom sheet
                </h3>
                <Button variant="ghost" onClick={() => setBottom(false)}>
                  Close
                </Button>
              </div>
              <p style={{ margin: '16px 0 0', color: 'var(--nui-fg-subtle)' }}>
                Slides from the bottom.
                Use this pattern for mobile-style actions or compact menus on small screens.
              </p>
            </div>
          </Drawer>
        </div>
      </Card.Body>
    </Card>
  );
}
function CommandPaletteExample() {
  const [open, setOpen] = useState(true)
  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>CommandPalette</h3>
      </Card.Header>
      <Card.Body>
        <div
          onClick={() => setOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            border: '1px solid var(--nui-border-default)',
            borderRadius: 8,
            background: 'var(--nui-bg-surface)',
            cursor: 'pointer',
          }}
        >
          <span style={{ opacity: 0.6 }}>Search commands...</span>
          <kbd style={{ fontSize: 12 }}>Ctrl + K</kbd>
        </div>
        <CommandPalette
          sections={[
            {
              title: 'Navigation',
              items: [
                {
                  id: 'home', label: 'Go Home', onSelect: () => {
                    nui.success('Navigated to Home');
                    setOpen(false);
                  },
                },
                {
                  id: 'profile',
                  label: 'Open Profile',
                  onSelect: () => {
                    nui.success('Profile opened');
                    setOpen(false);
                  },
                },
              ],
            },
          ]}
        />
        <h4>Press <kbd>Ctrl</kbd>+<kbd>K</kbd> to open command palette</h4>
      </Card.Body>
    </Card>
  );
}

function ContextMenuExample() {
  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>ContextMenu</h3>
      </Card.Header>
      <Card.Body>

        <ContextMenu
          items={[
            { label: 'Rename', onSelect: () => nui.success('Rename') },
            { label: 'Duplicate', onSelect: () => nui.success('Duplicate') },
            { type: 'separator' },
            { label: 'Delete', danger: true, onSelect: () => nui.success('Delete') },
          ]}
        >
          <div>Right click me</div>
        </ContextMenu>
      </Card.Body>
    </Card >
  )
}
function BadgeExample() {
  return (
    <Card>
      <Card.Header>
        <h3 style={{ margin: 0 }}>Badges</h3>
      </Card.Header>
      <Card.Body>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Badge>New</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Card.Body>
    </Card>
  );
}

function DemoPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--nui-bg-page)',
        color: 'var(--nui-fg-default)',
      }}
    >
      <div
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '32px 16px 64px',
        }}
      >
        <section
          style={{
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Badge variant="outline">NUI only</Badge>
              <Badge variant="success">Single page</Badge>
              <Badge variant="warning">Component examples</Badge>
            </div>

            <div>
              <h1 style={{ margin: 0, fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                NUI Component Gallery
              </h1>
              <p
                style={{
                  margin: '12px 0 0',
                  color: 'var(--nui-fg-subtle)',
                  maxWidth: 720,
                  lineHeight: 1.7,
                }}
              >
                This page uses NUI components directly to demonstrate common UI
                building blocks in one simple screen.
              </p>
            </div>
          </div>

        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          <ThemeExample />
          <Section />
          <ButtonExample />
          <TableExample />
          <FormExample />
          <AccordionExample />
          <DialogExample />
          <BadgeExample />
          <BreadcrumbsExample />
        </section>

        <section style={{ marginTop: 16, display: "Flex", flexDirection: 'column', gap: 16 }}>
          <StepperExample />
        </section>
        <section
          style={{
            marginTop: 16,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 16,
          }}
        >
          <DatePickerExample />
          <ChoiceExample />
          <ContextMenuExample />
          <DrawerExample />
          <TabsExample />
          <CommandPaletteExample />
        </section>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <DemoPage />
  );
}