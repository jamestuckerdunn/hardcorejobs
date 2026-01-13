"use client";

import { clsx } from "clsx";
import { createContext, useContext, useState } from "react";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
}

interface TabsProps {
  defaultTab: string;
  children: React.ReactNode;
  className?: string;
  onChange?: (tab: string) => void;
}

export function Tabs({ defaultTab, children, className, onChange }: TabsProps) {
  const [activeTab, setActiveTabState] = useState(defaultTab);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    onChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      className={clsx(
        "flex border-b border-neutral-800 overflow-x-auto",
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function Tab({ value, children, className }: TabProps) {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={clsx(
        "px-4 py-3 text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-all",
        "border-b-2 -mb-px",
        isActive
          ? "text-white border-white"
          : "text-neutral-500 border-transparent hover:text-neutral-300",
        className
      )}
    >
      {children}
    </button>
  );
}

interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div role="tabpanel" className={clsx("py-4", className)}>
      {children}
    </div>
  );
}

// Simple pill tabs variant
interface PillTabsProps {
  tabs: { value: string; label: string; count?: number }[];
  activeTab: string;
  onChange: (tab: string) => void;
  className?: string;
}

export function PillTabs({ tabs, activeTab, onChange, className }: PillTabsProps) {
  return (
    <div className={clsx("flex gap-2 flex-wrap", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            "px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all",
            activeTab === tab.value
              ? "bg-white text-black"
              : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className="ml-2 text-neutral-600">
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
