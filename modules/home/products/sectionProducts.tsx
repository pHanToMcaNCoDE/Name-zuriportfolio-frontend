import HeroSection from '@modules/home/features/Hero';
import { useRouter } from 'next/router';
import { useState } from 'react';
import SearchAndFilterProducts from './SearchAndFilterProducts';

const SectionProducts = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{ SortBy?: number; Country?: string }>({});
  const searchTerm = useRouter();

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleNumberReset = () => {
    setPageNumber(1);
  };
  const handleFilters = (type: string, value: string | number) => {
    setFilters((prev) => {
      if (type === 'none') {
        return {};
      }
      return { ...prev, [type]: value };
    });
  };

  const handleGo = () => {
    searchTerm.push(`/explore/search?searchQuery=${searchQuery}`);
  };

  return (
    <div className="flex flex-col w-full max-w-[1410px] mx-auto">
      <div className="flex justify-center items-center py-5 px-0 w-full">
        <HeroSection
          title="Find Digital Products you’ll Love!"
          desc={<p></p>}
          bottom={false}
          button={false}
          badge="Zuri Marketplace"
        />
      </div>
      <div className={`max-w-[1410px] mt-10 md:px-[80px] lg:px-24 space-y-14`}>
        <SearchAndFilterProducts
          handleFilters={handleFilters}
          handleGo={handleGo}
          filters={filters}
          setSearchQuery={setSearchQuery}
          setFilter={handleClearFilters}
          setPageNumber={handleNumberReset}
        />
      </div>
    </div>
  );
};

export default SectionProducts;
