import DashboardLayout from "../dashboard/layout";


export default function WhatsAppGroupsLayout({
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
