import DashboardLayout from "../dashboard/layout";


export default function ConfigUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
        {children}
    </DashboardLayout>
  );
}
