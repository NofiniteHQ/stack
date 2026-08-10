import React from 'react';
import { Tabs, TabsProps } from './Tabs';

export interface DataTabItem {
 value: string;
 label?: React.ReactNode;
 title?: React.ReactNode;
 content: React.ReactNode;
}

export interface DataTabsProps extends Omit<TabsProps, 'children'> {
 tabs: DataTabItem[];
}

export const DataTabs = React.forwardRef<HTMLDivElement, DataTabsProps>(
 ({ tabs, ...props }, ref) => {
 return (
 <Tabs ref={ref} {...props}>
 <Tabs.List>
 {tabs.map((tab) => (
 <Tabs.Trigger key={tab.value} value={tab.value}>
 {tab.label || tab.title}
 </Tabs.Trigger>
 ))}
 </Tabs.List>
 {tabs.map((tab) => (
 <Tabs.Content key={tab.value} value={tab.value}>
 {tab.content}
 </Tabs.Content>
 ))}
 </Tabs>
 );
 }
);
DataTabs.displayName = 'DataTabs';
