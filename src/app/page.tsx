"use client";

import { MainDashboard } from "@/components/dashboard/main-dashboard";
import { ToastProvider } from "@/components/ui/toast";

export default function Home() {
  return (
    <ToastProvider>
      <MainDashboard />
    </ToastProvider>
  );
}
