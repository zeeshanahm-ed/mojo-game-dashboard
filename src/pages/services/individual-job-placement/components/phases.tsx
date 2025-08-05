import { Button, Divider } from 'antd';
import ExpandAllIcon from "assets/icons/expand-all-icon.svg?react";
import ShrinkAllIcon from "assets/icons/shrink-all-icon.svg?react";

import PhaseFive from 'pages/services/components/phase-five';
import PhaseFour from 'pages/services/components/phase-four';
import PhaseOne from 'pages/services/components/phase-one';
import PhaseThree from 'pages/services/components/phase-three';
import PhaseTwo from 'pages/services/components/phase-two';
import ServiceDetails from 'pages/services/components/service-details';
import { useState } from 'react';

function Phases({ serviceData, caseAllDocumentData, refetchCaseData, refetch, section }: any) {
  const [collapseAll, setCollapseAll] = useState(true);
  const [collapseVersion, setCollapseVersion] = useState(0); // increment to force update
  const handleCollapseAll = (value: boolean) => {
    setCollapseAll(value);
    setCollapseVersion(prev => prev + 1); // trigger children update
  }
  return (
    <section className='mb-15'>
      <ServiceDetails serviceData={serviceData} refetch={refetch} section={section} />
      <Divider />
      <div className='flex items-center gap-2 mb-8'>
        <Button className='border-none shadow-none font-medium p-0 px-2' onClick={() => handleCollapseAll(false)}><ExpandAllIcon /> Expand All</Button>
        <span className='w-[1px] h-5 bg-light-gray inline-block'></span>
        <Button className='border-none shadow-none font-medium p-0 px-2' onClick={() => handleCollapseAll(true)}><ShrinkAllIcon /> Shrink All</Button>
      </div>
      <PhaseOne phase={1} serviceData={serviceData} refetchCaseData={refetchCaseData} caseDocumentData={caseAllDocumentData?.data["phase-1"]} collapseAll={collapseAll} collapseVersion={collapseVersion} />
      <PhaseTwo phase={2} serviceData={serviceData} refetchCaseData={refetchCaseData} caseDocumentData={caseAllDocumentData?.data["phase-2"]} collapseAll={collapseAll} collapseVersion={collapseVersion} />
      <PhaseThree phase={3} serviceData={serviceData} refetchCaseData={refetchCaseData} caseDocumentData={caseAllDocumentData?.data["phase-3"]} collapseAll={collapseAll} collapseVersion={collapseVersion} />
      <PhaseFour phase={4} serviceData={serviceData} refetchCaseData={refetchCaseData} caseDocumentData={caseAllDocumentData?.data["phase-4"]} collapseAll={collapseAll} collapseVersion={collapseVersion} />
      <PhaseFive phase={5} serviceData={serviceData} refetchCaseData={refetchCaseData} caseDocumentData={caseAllDocumentData?.data["phase-5"]} collapseAll={collapseAll} collapseVersion={collapseVersion} />
    </section>
  );
}

export default Phases;
