/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useHeaderProps } from 'components/core/use-header-props';
// import useBack from 'hooks/use-back';
import TabSwitcher from '../components/tab-switcher';
import useServiceData from '../core/hooks/service';
import Phases from './components/phases';
import Billing from './components/billing';
import Details from './components/details';
import Reports from './components/reports';
import useGetAllCaseById from '../core/hooks/useGetAllCaseById';
import TimeSheetReport from './components/TimeSheetReport';
import useGetBillingCaseById from '../core/hooks/useGetBillingCaseById';

function IndividualJobPlacement() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const { serviceData, refetch } = useServiceData({}, serviceId);
  const { caseAllDocumentData, refetchCaseData } = useGetAllCaseById(serviceId);
  const { billingCaseDataById, refetchBillingData } = useGetBillingCaseById(serviceId);
  const { setTitle, setBack } = useHeaderProps();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const tab = query.get('tab');
  const initialTab = tab ? parseInt(tab) : 0;

  const [selectedTab, setSelectedTab] = useState(initialTab);
  // const { handleBack } = useBack();

  useEffect(() => {
    setTitle(serviceData?.data?.caseType?.name);
    setBack(() => handelBack);
    return () => {
      setBack(undefined);
    };
  }, [serviceData, setTitle, setBack]);

  const handelBack = () => {
    navigate(`/services`);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <Details serviceData={serviceData} caseDocumentData={caseAllDocumentData?.data["phase-7"]} refetch={refetch} refetchCaseData={refetchCaseData} section='detailSection' />;
      case 1:
        return serviceData?.data?.caseType?.name === 'Supported Employment' ? (
          <Phases
            serviceData={serviceData}
            caseAllDocumentData={caseAllDocumentData}
            refetchCaseData={refetchCaseData}
            refetch={refetch}
            section='phaseSection'
          />
        ) : serviceData?.data?.caseType?.name === 'Job Coaching' || serviceData?.data?.caseType?.name === 'Work Readiness Training' ?
          <TimeSheetReport serviceData={serviceData} caseAllDocumentData={caseAllDocumentData} refetchCaseData={refetchCaseData} section='timeSheetSection' />
          : (
            <Reports serviceData={serviceData} caseAllDocumentData={caseAllDocumentData} refetchCaseData={refetchCaseData} refetch={refetch} section='reportSection' />
          );
      case 2:
        return <Billing billingCaseDataById={billingCaseDataById} serviceData={serviceData} refetch={refetch} refetchBillingData={refetchBillingData} section='billingSection' />;
      default:
        return null;
    }
  };
  return (
    <section >
      <TabSwitcher
        title={serviceData?.data?.caseType?.name === 'Supported Employment' ? 'Phases' : 'Reports'}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
      {renderTabContent()}
    </section>
  );
}

export default IndividualJobPlacement;
