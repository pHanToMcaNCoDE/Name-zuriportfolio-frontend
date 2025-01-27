//* Removed some unnecessary imports

import React, { useState, useEffect } from 'react';
import NavDashBoard from '../../../../../modules/dashboard/component/Navbar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import RatingCard from '@modules/dashboard/component/reviews/review-page/RatingCard';
import RatingBar from '@modules/dashboard/component/reviews/review-page/RatingBar';
import SellerReview from '@modules/dashboard/component/reviews/review-page/SellersReview';
import Filter from '@modules/dashboard/component/reviews/review-page/ReviewFilter';
import Pagination from '@ui/Pagination';
import MainLayout from '../../../../../components/Layout/MainLayout';
import EmptyReviewPage from '@modules/dashboard/component/reviews/review-page/EmptyReviewPage';
import Container from '@modules/auth/component/Container/Container';
import Loader from '@ui/Loader';
import { ReviewData, ReviewApiResponse, RatsData } from '../../../../../@types';
import CategoriesNav from '@modules/marketplace/component/CategoriesNav/CategoriesNav';
import Review from '../review-page/Review';
import useCategoryNav from '@modules/marketplace/hooks/useCategoryNav';

//* Moved type definitions to @types/index.d.ts
const BuyersView = () => {
  const setPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: pageNumber },
    });
  };

  const router = useRouter();
  const { id, title } = router.query;

  //* Added page variable and current page state also added isLoading state to hide page change
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { categories, loading } = useCategoryNav();
  const [data, setData] = useState<ReviewData[] | null>(null);
  const [rats, setRats] = useState<RatsData>();
  const [filterRating, setFilterRating] = useState<string>('all');
  const [filterView, setFilterView] = useState<string>('topReviews');
  const [filteredData, setFilteredData] = useState<ReviewData[] | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [mountUI, setMountUI] = useState<boolean>(false);

  // ToDo: Remove all commented out code
  // const [total5Star, setTotal5Star] = useState<number>(0);
  // const [total4Star, setTotal4Star] = useState<number>(0);
  // const [total3Star, setTotal3Star] = useState<number>(0);
  // const [total2Star, setTotal2Star] = useState<number>(0);
  // const [total1Star, setTotal1Star] = useState<number>(0);

  // useEffect(() => {
  //   fetch(`https://team-liquid-repo.onrender.com/api/review/shop/10/reviews?pageNumber=0&pageSize=10`)
  //     .then((res) => res.json())
  //     .then((data: ReviewApiResponse) => setData(data.data))
  //     .catch((e) => console.log(e));
  // }, []);
  // useEffect(() => {
  //   fetch('https://team-liquid-repo.onrender.com/api/review/products/10/rating')
  //     .then((res) => res.json())
  //     .then((data) => setRats(data.data))
  //     .catch((e) => console.log(e));
  // }, []);

  // ToDo: Move all fetch requests to a separate file
  useEffect(() => {
    if (id && filterRating === 'all') {
      const url: string = `https://team-liquid-repo.onrender.com/api/review/shop/${id}/reviews?pageNumber=${
        currentPage - 1
      }&pageSize=10`;
      fetch(url)
        .then((res) => res.json())
        .then((data: ReviewApiResponse) => setData(data.data))
        .catch((e) => console.log(e));
    } else {
      const url: string = `https://team-liquid-repo.onrender.com/api/review/shop/products/1/reviews/rating?rating=${filterRating}&pageNumber=${
        currentPage - 1
      }&pageSize=10`;
      fetch(url)
        .then((res) => res.json())
        .then((data: ReviewApiResponse) => setData(data.data))
        .catch((e) => console.log(e));
    }
  }, [mountUI, filterRating, filterView, currentPage, id]);
  useEffect(() => {
    if (id) {
      const apiUrl: string = `https://team-liquid-repo.onrender.com/api/review/products/${id}/rating`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => setRats(data.data))
        .catch((e) => console.log(e));
    }
  }, [id]);

  const ratingData = [
    { rating: 5, users: rats?.fiveStar!, total: rats?.numberOfRating! },
    { rating: 4, users: rats?.fourStar!, total: rats?.numberOfRating! },
    { rating: 3, users: rats?.threeStar!, total: rats?.numberOfRating! },
    { rating: 2, users: rats?.twoStar!, total: rats?.numberOfRating! },
    { rating: 1, users: rats?.oneStar!, total: rats?.numberOfRating! },
  ];

  // ToDo: Remove all commented out code
  // useEffect(() => {
  //   if (data) {
  //     const total5 = data.filter((review) => review.rating === 5).length;
  //     const total4 = data.filter((review) => review.rating === 4).length;
  //     const total3 = data.filter((review) => review.rating === 3).length;
  //     const total2 = data.filter((review) => review.rating === 2).length;
  //     const total1 = data.filter((review) => review.rating === 1).length;
  //     setTotal5Star(total5);
  //     setTotal4Star(total4);
  //     setTotal3Star(total3);
  //     setTotal2Star(total2);
  //     setTotal1Star(total1);
  //   }
  // }, [data]);

  function filterReviews(view: string, rating: string, data: ReviewData[]) {
    let filteredReviews = data;

    if (view === 'topReviews') {
      filteredReviews.sort((a, b) => b.isHelpful - a.isHelpful);
    } else if (view === 'newest') {
      filteredReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (view === 'oldest') {
      filteredReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return filteredReviews;
  }

  function handleFilter(view: string, rating: string) {
    setFilterView(view);
    setFilterRating(rating);
    if (data !== null && data !== undefined) {
      const filteredReviews = filterReviews(view, rating, data);
      setFilteredData(filteredReviews);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMountUI(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <MainLayout activePage="Explore" showDashboardSidebar={false} showTopbar>
      <Container>
        <div className="max-w-[1240px] hidden lg:block mx-auto my-0">
          {/* from marketplace: this component you are using is from marketplace and it has been updated and we have updated it on your end also, this is important to allow sync without error take note  */}
          <CategoriesNav navItems={categories} isLoading={loading} />
        </div>
        {!rats ? (
          <div className=" h-[70vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : rats === null || rats.averageRating === undefined ? (
          <EmptyReviewPage />
        ) : (
          <div className="flex flex-col justify-center items-center md:mb-16">
            <div className="flex flex-col w-full mb-10  justify-center">
              <div className="flex justify-start  w-full mb-10">
                <div
                  className="flex flex-row justify-start lg:text-2xl md:text-xl text-xs tracking-wide font-semibold font-manropeL text-[#444846] items-center cursor-pointer"
                  onClick={() => router.back()}
                >
                  <Image src="/assets/reviews/return-icon.svg" width={32} height={32} alt="return" />
                  {router.query.title}
                </div>
              </div>
              <div className="flex flex-col md:flex-row lg:gap-24 md:gap-10 gap-4 mx-5">
                <div className="flex flex-row md:flex-col gap-4 md:gap-8 lg:w-80 md:w-48">
                  <div>
                    <RatingBar avgRating={rats?.averageRating!} verUser={100} />
                  </div>
                  <div className="flex flex-col gap-2">
                    {ratingData.map((data, index) => (
                      <RatingCard key={index} rating={data.rating} users={data.users} totalReviews={data.total} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="w-full justify-start">
                    <Filter
                      rating={rats?.totalRating!}
                      review={rats?.numberOfRating!}
                      filterReview={(view, rating) => handleFilter(view, rating)}
                    />
                  </div>
                  <div className="mt-4 mx-1">
                    {!filteredData ? (
                      <Loader />
                    ) : filteredData?.length === 0 ? (
                      <h2>No results</h2>
                    ) : (
                      filteredData?.map((review) => (
                        <Review
                          key={review.reviewId}
                          buyerName={review.customerName}
                          mainDate={review.createdAt}
                          adminDate={review.reply?.createdAt}
                          review={review.description}
                          noOfStars={review.rating}
                          shopReply={review.reply?.message}
                          shopName={review.reply?.name}
                          reviewId={review.reviewId}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
            {data === null || data === undefined || data.length === 0 ? (
              <div className=" w-0 h-0 m-0 p-0 hidden"></div>
            ) : (
              <Pagination
                page={currentPage}
                pages={data[0]?.numberOfPages}
                activePage={currentPage}
                visiblePaginatedBtn={3}
                setPage={setPage}
              />
            )}
          </div>
        )}
      </Container>
    </MainLayout>
  );
};

export default BuyersView;
