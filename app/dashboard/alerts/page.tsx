"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Plus,
  Trash2,
  MapPin,
  DollarSign,
  Globe,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface JobAlert {
  id: string;
  keywords: string[];
  locations: string[];
  minSalary: number;
  remoteOnly: boolean;
  frequency: "instant" | "daily" | "weekly";
  active: boolean;
  createdAt: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<{
    keywords: string;
    locations: string;
    minSalary: string;
    remoteOnly: boolean;
    frequency: "instant" | "daily" | "weekly";
  }>({
    keywords: "",
    locations: "",
    minSalary: "100000",
    remoteOnly: false,
    frequency: "daily",
  });

  const handleCreate = () => {
    const newAlert: JobAlert = {
      id: Date.now().toString(),
      keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
      locations: formData.locations.split(",").map((l) => l.trim()).filter(Boolean),
      minSalary: parseInt(formData.minSalary) || 100000,
      remoteOnly: formData.remoteOnly,
      frequency: formData.frequency,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setAlerts((prev) => [...prev, newAlert]);
    setFormData({
      keywords: "",
      locations: "",
      minSalary: "100000",
      remoteOnly: false,
      frequency: "daily",
    });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const handleToggle = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, active: !alert.active } : alert
      )
    );
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="border-b border-neutral-800 bg-neutral-950">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                Job Alerts
              </h1>
              <p className="mt-1 text-neutral-400">
                Get notified when new jobs match your criteria
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Alert
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Create Alert Form */}
        {showForm && (
          <div className="border border-neutral-800 p-6 mb-8">
            <h3 className="text-lg font-bold uppercase tracking-tight text-white mb-6">
              Create New Alert
            </h3>
            <div className="space-y-4">
              <Input
                label="Keywords"
                placeholder="Sales, SDR, Tech (comma separated)"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
                hint="Enter job titles or keywords you're interested in"
              />
              <Input
                label="Locations"
                placeholder="Remote, Austin TX, New York (comma separated)"
                value={formData.locations}
                onChange={(e) =>
                  setFormData({ ...formData, locations: e.target.value })
                }
                hint="Leave empty to receive alerts for all locations"
              />
              <Input
                label="Minimum Salary"
                type="number"
                placeholder="100000"
                value={formData.minSalary}
                onChange={(e) =>
                  setFormData({ ...formData, minSalary: e.target.value })
                }
              />
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                  Frequency
                </label>
                <div className="flex gap-2">
                  {(["instant", "daily", "weekly"] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() =>
                        setFormData({ ...formData, frequency: freq })
                      }
                      className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                        formData.frequency === freq
                          ? "bg-white text-black"
                          : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800"
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remoteOnly"
                  checked={formData.remoteOnly}
                  onChange={(e) =>
                    setFormData({ ...formData, remoteOnly: e.target.checked })
                  }
                  className="h-4 w-4 bg-neutral-900 border-neutral-700"
                />
                <label
                  htmlFor="remoteOnly"
                  className="text-sm text-neutral-400"
                >
                  Remote jobs only
                </label>
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleCreate}>Create Alert</Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Alerts List */}
        {alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border p-6 transition-colors ${
                  alert.active
                    ? "border-neutral-800"
                    : "border-neutral-900 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    {alert.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {alert.keywords.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-neutral-900 px-2 py-1 text-xs font-medium text-white"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500">
                      {alert.locations.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.locations.join(", ")}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${(alert.minSalary / 1000).toFixed(0)}K+
                      </span>
                      {alert.remoteOnly && (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          Remote only
                        </span>
                      )}
                      <span className="capitalize">{alert.frequency}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggle(alert.id)}
                      className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                        alert.active
                          ? "bg-emerald-950 text-emerald-400"
                          : "bg-neutral-900 text-neutral-500"
                      }`}
                    >
                      {alert.active ? "Active" : "Paused"}
                    </button>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !showForm ? (
          <div className="border border-neutral-800 p-12 text-center">
            <Bell className="h-12 w-12 text-neutral-700 mx-auto" />
            <h3 className="mt-4 text-lg font-bold text-white">No Job Alerts</h3>
            <p className="mt-2 text-neutral-400">
              Create an alert to get notified when new jobs match your criteria.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              leftIcon={<Plus className="h-4 w-4" />}
              className="mt-6"
            >
              Create Your First Alert
            </Button>
          </div>
        ) : null}

        {/* Info */}
        <div className="mt-8 border border-neutral-800 bg-neutral-950 p-6">
          <h4 className="font-bold text-white">How Job Alerts Work</h4>
          <ul className="mt-4 space-y-2 text-sm text-neutral-400">
            <li>• We check for new jobs matching your criteria regularly</li>
            <li>• Instant alerts notify you immediately when a match is found</li>
            <li>• Daily/weekly digests summarize all new matching jobs</li>
            <li>• You can pause or delete alerts at any time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
