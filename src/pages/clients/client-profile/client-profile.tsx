import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHeaderProps } from 'components/core/use-header-props';
import useBack from 'hooks/use-back';
import ClientInformation from './components/client-information';
import TabSwitcher from './components/tab-switcher';
import Services from 'pages/services/services';
import useSingleClientData from './core/hooks/use-single-client';

function ClientProfile() {
  const { clientId } = useParams<{ clientId: string }>();
  const [selectedTab, setSelectedTab] = useState(0);
  const { setTitle, setBack } = useHeaderProps();
  const { handleBack } = useBack();
  const { singleClientData, clientInfoRefecth } = useSingleClientData(clientId);

  useEffect(() => {
    setTitle('Client Profile');
    setBack(() => handleBack);
  }, [clientId, setTitle, setBack]);
  const singleClientService = true;
  return (
    <section>
      <TabSwitcher selectedTab={selectedTab} onSelectTab={setSelectedTab} />
      <div>
        {selectedTab === 0 ? (
          singleClientData && <ClientInformation clientData={singleClientData} clientInfoRefecth={clientInfoRefecth} />
        ) : (
          <Services isClientProfile={true} clientId={clientId} singleClientService={singleClientService} />
        )}
      </div>
    </section>
  );
}

export default ClientProfile;
