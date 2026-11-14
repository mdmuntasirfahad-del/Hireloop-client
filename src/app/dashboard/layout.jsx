import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = ({ children }) => {
    return (
        <div className="min-h-[calc(100vh-72px)] bg-surface text-white">
            <DashboardSidebar />

            <div className="min-w-0 lg:pl-[272px]">{children}</div>
        </div>
    );
};

export default DashboardLayout;
