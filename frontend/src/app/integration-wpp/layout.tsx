import DashboardLayout from "../dashboard/layout";


export default function IntegrationWppLayout({
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
