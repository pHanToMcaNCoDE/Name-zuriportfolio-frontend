import axios, { isAxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { CategoryType } from '../component/filter/hooks/useCategory';

const useCategoryNav = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getCategories();
  }, []);
  async function getCategories() {
    try {
      const { data } = await axios.get<{ data: CategoryType[] }>(
        'https://coral-app-8bk8j.ondigitalocean.app/api/marketplace/category-name/',
      );
      setCategories(data.data ? data.data : []);
    } catch (error) {
      if (error instanceof isAxiosError) {
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return { categories, loading };
};

export default useCategoryNav;
