import TabSwitcher from "components/core-ui/tab-switcher/TabSwitcher";
import { useEffect, useState } from "react";
import Warnings from "./warnings/Warnings";
import Alerts from "./alerts/Alerts";
import useAlertsData from "./alerts/hooks/useAlertsData";
import { AlertsDataParams } from "./alerts/core/_modals";
import useWarningsData from "./warnings/hooks/useWarningsData";
import { WarningsDataParams } from "./warnings/core/_modals";

function AlertsNWarnings() {
    const [selectedTab, setSelectedTab] = useState(0);
    const [alertCount, setAlertCount] = useState(null);
    const [warningCount, setWarningCount] = useState(0);

    const [alertListing, setAlertListing] = useState<AlertsDataParams>({
        limit: 10,
        page: 1,
        alertDate: null,
        assignedTo: null,
    });
    const [warningListing, setWarningListing] = useState<WarningsDataParams>({
        limit: 10,
        page: 1,
        warningDate: null,
        assignedTo: null,
    });
    const { alertData, isLoading: alertDataIsLoading, refetch: alertDataRefetch } = useAlertsData(alertListing);
    const { warningData, isLoading: warningDataIsLoading, refetch: warningDataRefetch } = useWarningsData(warningListing);


    useEffect(() => {
        const unreadCount = alertData?.data?.filter((item: any) => !item?.isRead)?.length;
        setAlertCount(unreadCount || 0);
    }, [alertData]);
    useEffect(() => {
        const unreadCount = warningData?.data?.filter((item: any) => !item?.isRead)?.length;
        setWarningCount(unreadCount || 0);
    }, [warningData]);


    const tabsLabel = [
        {
            label: "Alerts"
        },
        {
            label: "Warnings"
        }
    ]

    return (
        <section>
            <TabSwitcher alertCount={alertCount} warningCount={warningCount} selectedTab={selectedTab} onSelectTab={setSelectedTab} tabs={tabsLabel} />
            <div>
                {selectedTab === 0 ? (
                    <Alerts setAlertCount={setAlertCount} alertData={alertData} isLoading={alertDataIsLoading} refetch={alertDataRefetch} setListing={setAlertListing} listing={alertListing} />
                ) : (
                    <Warnings setWarningCount={setWarningCount} warningData={warningData} isLoading={warningDataIsLoading} refetch={warningDataRefetch} setListing={setWarningListing} listing={warningListing} />
                )}
            </div>
        </section>
    )
}

export default AlertsNWarnings;