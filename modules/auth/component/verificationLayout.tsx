import React from 'react';
import MainLayout from '../../../components/Layout/MainLayout';
import { VerificationLayoutProps } from '../../../@types';

function VerificationLayout({ children }: VerificationLayoutProps) {
  return (
    <MainLayout showDashboardSidebar={false} showTopbar={false} showFooter={false} activePage="verification">
      <div className=" h-[100dvh] w-full relative overflow-hidden flex items-center justify-center">
        <img
          className=" absolute top-0 right-0 hidden md:block md:w-[200px] md:h-[200px]"
          src="/assets/images/blob-os.svg"
          alt=""
        />
        {children}
        <img
          className="absolute bottom-0 left-0 w-[130px] h-[130px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px]"
          src="/assets/images/unlock-os.svg"
          alt=""
        />
      </div>
    </MainLayout>
  );
}

export default VerificationLayout;
