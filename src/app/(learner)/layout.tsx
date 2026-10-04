import { AppNavigationShell } from "@/components/app-navigation-shell";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNavigationShell />
      <div className="flex-1 flex flex-col">{children}</div>
    </>
  );
}
