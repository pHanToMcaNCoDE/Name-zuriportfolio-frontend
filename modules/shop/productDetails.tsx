import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, ArrowRight, ArrowRight2, ProfileCircle } from 'iconsax-react';
import { useCart } from './component/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Products, ShopData } from '../../@types';
import { toast } from 'react-toastify';
import Image from 'next/image';
import star1 from '../../public/assets/star1.svg';
import star2 from '../../public/assets/star2.svg';
import Button from '@ui/Button';
import ShopProductList from './component/otherProductList';
import Breadcrumbs from '../shop/component/Breadcrumbs';
import Link from 'next/link';
import TabContainer from '../shop/component/Tabbed';
import likeIcon from '../../public/assets/icons/like.svg';
import verifyIcon from '../../public/assets/icons/verify.svg';
import profileImg from '../../public/assets/images/profile-img.png';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Header from './component/productPage/Header';
import Footer from './component/productPage/Footer';
import Loader from '@ui/Loader';
import Head from 'next/head';

export default function ProductDetails() {
  const router = useRouter();
  const { cart } = useCart();
  const { auth } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Products | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [shopID, setShopID] = useState('');
  const [shopName, setShopName] = useState('');
  const [otherProducts, setOtherProducts] = useState<Products[]>([]);
  const [shopOwnerQuery, setShopOwnerQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const cartItemCount = cart.length;
  const handleCategoryChange = () => {};
  const ZOOM = 250;

  useEffect(() => {
    const { id } = router.query;
    if (id) {
      fetch(`https://zuriportfolio-shop-internal-api.onrender.com/api/product/${id}`)
        .then((response) => response.json())
        .then((response) => {
          setProduct(response.data);
          setShopID(response.data.shop.id);
          setShopName(response.data.shop.name);
        })
        .catch((error) => {
          console.error('Error fetching product details:', error);
          setProduct(null);
        });
    }
  }, [router.query, auth]);

  useEffect(() => {
    if (shopID) {
      fetch(`https://zuriportfolio-shop-internal-api.onrender.com/api/shop/${shopID}`)
        .then((response) => response.json())
        .then((response) => {
          setOtherProducts(response.data.products);
        })
        .catch((error) => {
          console.error('Error fetching product details:', error);
          setOtherProducts([]);
        });
    }
  }, [shopID]);

  const imgContRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const imgContElm = imgContRef.current;
    const imgElm = imgRef.current;

    const handleMouseEnter = () => {
      if (imgElm) {
        imgElm.style.width = ZOOM + '%';
        imgElm.style.height = ZOOM + '%';
      }
    };

    const handleMouseLeave = () => {
      if (imgElm) {
        resetImageStyles();
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (imgElm) {
        const { clientX, clientY } = event;
        const { offsetLeft, offsetTop, clientWidth, clientHeight } = imgContElm!;
        const imgWidth = imgElm.clientWidth;
        const imgHeight = imgElm.clientHeight;

        const left = -(((imgWidth - clientWidth) * (clientX - offsetLeft)) / clientWidth);
        const top = -(((imgHeight - clientHeight) * (clientY - offsetTop)) / clientHeight);

        imgElm.style.left = left + 'px';
        imgElm.style.top = top + 'px';
      }
    };

    if (imgContElm && imgElm) {
      imgContElm.addEventListener('mouseenter', handleMouseEnter);
      imgContElm.addEventListener('mouseleave', handleMouseLeave);
      imgContElm.addEventListener('mousemove', handleMouseMove);
    }

    const resetImageStyles = () => {
      if (imgElm && imgContElm) {
        imgElm.style.width = '100%';
        imgElm.style.height = '100%';
        imgElm.style.top = '0';
        imgElm.style.left = '0';
      }
    };

    return () => {
      if (imgContElm) {
        imgContElm.removeEventListener('mouseenter', handleMouseEnter);
        imgContElm.removeEventListener('mouseleave', handleMouseLeave);
        imgContElm.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [product]);

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!auth) {
      toast.error('Please Log in before Adding to the Cart', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
    try {
      const response = await axios.post(
        'https://zuri-cart-checkout.onrender.com/api/checkout_cart/carts',
        {
          product_ids: [product.id],
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        },
      );
      if (response.status === 201) {
        addToCart(product);

        toast.success('Added to Cart', {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('Failed to add to Cart', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  {
    /*const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const starType = i <= rating ? 'star1' : 'star2';
      stars.push(<Image src={starType === 'star1' ? star1 : star2} alt={`Star ${i}`} key={i} />);
    }
    return stars;
  }; */
  }

  const handleReadMoreClick = () => {
    setShowFullDescription(!showFullDescription); // Step 2
  };

  const description =
    product.description?.length <= 400
      ? product.description
      : showFullDescription
      ? product.description
      : product.description?.slice(0, 400);

  const readMoreBtn = document.querySelector('.read-more-btn') as HTMLElement | null;
  const text = document.querySelector('.text-wrapper') as HTMLElement | null;

  return (
    <>
      <Head>
        <title>{shopName ? `${shopName} Shop - ${product?.name} Details` : ''}</title>
        <meta name="description" content={`Explore the details of ${product?.name}. ${product?.description}`} />
        <meta property="og:title" content={shopName ? `${shopName} Shop - ${product?.name} Details` : ''} />
        <meta
          property="og:description"
          content={`Discover and explore the details of ${product?.name} by ${shopName} - ${product?.description}.`}
        />

        <meta
          property="og:url"
          content="https://zuriportfolio-frontend-pw1h.vercel.app/shop/product?id=ad509f1d-efa4-4f00-a6a4-20b30d3f10f9&shopName=Martinez%20and%20Sons"
        />
      </Head>
      <Header
        setSearchQuery={setSearchQuery}
        setShopOwnerQuery={setShopOwnerQuery}
        cartItemCount={cartItemCount}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        handleCategoryChange={handleCategoryChange}
      />

      <main className={`p-4 container mx-auto`}>
        <div className="self-start mb-[8px]">
          <span className="font-manropeEL text-xs md:text-sm tracking-[0.00375rem] md:tracking-[0.00088rem] font-normal lg:text-base">
            <Breadcrumbs shopId={shopID} />
          </span>
        </div>
        <a onClick={() => router.back()} className="self-start">
          <ArrowLeft size="27" color="#000000" className="mb-[8px]" />
        </a>

        {/* Product Details  */}
        <div className="flex lg:flex-row lg:h-[542px] h-full flex-col items-center justify-center gap-x-6 w-full">
          {/* Product Detail Images  */}
          <div className="flex flex-col w-full lg:h-[542px] h-full item-center lg:gap-y-2">
            <div
              className="img-container w-full lg:h-full md:h-[20rem] sm:h-[17rem] h-[11.25rem] hover:cursor-zoom-in relative overflow-hidden rounded-lg"
              ref={imgContRef}
            >
              <Image
                ref={imgRef}
                src={product.image && product.image[0] ? product.image[0].url : ''}
                alt={product.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="100vw"
                priority
                className="img max-w-none w-full h-auto absolute"
              />
            </div>
          </div>

          {/* Product Detail Data */}
          <div className="lg:space-y-0 space-y-4 w-full lg:h-[542px] h-full flex flex-col justify-between">
            <div>
              <div>
                <h1 className="md:text-2xl md:font-bold text-black capitalize lg:text-3xl lg:font-semibold md:mt-4 text-base font-semibold font-manropeL mt-6 tracking-[0.005rem] lg:mt-0">
                  {product?.name}
                </h1>
                <div className="flex py-2 items-center">
                  <ProfileCircle color="#464646" variant="Bulk" className="w-6 h-6 md:w-9 md:h-9" />
                  <p className="w-fit  font-manropeB font-bold capitalize text-xs tracking-[0.003rem] md:tracking-[0.005rem] ml-1 md:font-semibold md:text-base">
                    {shopName}
                  </p>
                </div>
              </div>
              <div>
                <p className="lg:hidden text-base font-semibold md:font-bold md:text-lg font-manropeL tracking-[0.00088rem] py-2 md:pb-1">
                  Description
                </p>
                <p className="font-normal font-manropeL capitalize  text-custom-color43 text-sm md:text-base lg:text-lg tracking-[0.005rem] w-full line-clamp-3 lg:mt-6 lg:mb-8 text-wrapper">
                  {description}{' '}
                </p>
                {product.description.length > 400 && ( // Step 3
                  <span
                    onClick={handleReadMoreClick}
                    className="text-[#009254] font-manropeL font-bold md:block hidden"
                  >
                    {showFullDescription ? 'Read less' : 'Read more'}
                  </span>
                )}

                <div className="lg:flex flex-col gap-y-2 hidden">
                  <div className="flex gap-x-1 mt-">
                    <p className=" text-base font-semibold font-manropeB leading-normal tracking-tight"></p>
                    <div className="flex items-center font-manropeL">
                      <Image src={star2} alt="rating star" />
                      <Image src={star2} alt="rating star" />
                      <Image src={star2} alt="rating star" />
                      <Image src={star2} alt="rating star" />
                      <Image src={star2} alt="rating star" />
                      (no ratings for this product)
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <hr className="bg-white-110 text-white-110 h-[2px] border-0 lg:block hidden  mb-[3.625rem]" />
            </div>

            <div className="flex flex-col gap-y-1 md:gap-y-2">
              <p className="text-base lg:text-lg font-normal font-manropeL leading-normal tracking-tight mt-2">
                Total Payment (Incl. taxes)
              </p>
              <p className="flex gap-x-4 items-center">
                <span className="text-black text-xl md:text-3xl lg:text-3xl font-normal lg:font-semibold font-manropeEB leading-10">
                  ₦ {product.price.toLocaleString()}
                </span>
                <span className="text-xl font-light md:text-2xl lg:text-[1.375rem] font-manrope line-through leading-7 text-gray-300">
                  {product.discount_price ? '₦' + product.discount_price.toLocaleString() : null}
                </span>
              </p>

              <div>
                <hr className="bg-white-110 text-white-110 h-[2px] border-0 block md:hidden" />
              </div>
              <Button
                intent={'primary'}
                size={'md'}
                className="md:w-1/3 lg:w-1/2 w-full text-base font-manropeL tracking-[0.005rem] rounded-lg"
                onClick={handleAddToCart}
              >
                Add to cart
              </Button>
            </div>
          </div>
        </div>

        {/* Description, Specification, Reviews (Desktop View)  */}
        <span id="description" className="mt-10">
          <TabContainer />
        </span>
        {/* Description, Specification, Reviews (Mobile & Tablet View)  */}
        <div className="md:hidden block mr-auto mt-10">
          <hr className="bg-brand-disabled text-brand-disabled h-[1px] w-full border-0  sm:hidden" />

          <div className="mt-4">
            <h2 className="text-[#101928] font-manropeB font-semibold text-[22px] text-left">Customer Feedback</h2>
            <p className="text-sm font-manropeL mt-4">
              VERIFIED RATINGS <span>(173)</span>
            </p>

            <div className="mt-10 grid gap-10 grid-rows-[1fr] sm:grid-cols-[0.5fr_1fr] items-start">
              <div className="w-full py-8 px-6 flex flex-col gap-[20px] rounded-2xl border-custom-color32 border-[1px] items-center">
                <h2 className="text-4xl font-manropeB font-semibold">3.0/5</h2>
                <div className="flex mr-[17px]">
                  <Image src={star1} alt="rating star" />
                  <Image src={star1} alt="rating star" />
                  <Image src={star1} alt="rating star" />
                  <Image src={star2} alt="rating star" />
                  <Image src={star2} alt="rating star" />
                </div>
                <p className="text-base font-manropeL font-normal text-center">
                  <span>12,000</span> verified users
                </p>
              </div>

              <div>
                <div className="flex mb-4 sm:hidden">
                  <div className="flex align-center gap-[5.3px]">
                    <Image src={profileImg} alt="Profile Img" className="block sm:hidden" />
                    <h3 className="text-green-900 sm:text-custom-color39 font-manropeL text-xs  mr-3.5">Dorcas</h3>
                  </div>
                  <hr className="hidden sm:block w-px h-3.5 bg-brand-disabled2 text-brand-disabled2 border-0" />
                  <span className="font-manropeL text-xs text-custom-color39 ml-3.5">September 22, 2023.</span>
                </div>
                <div className="flex item-center gap-4 sm:inline-block">
                  <div className="flex ">
                    <Image src={star1} alt="rating star" />
                    <Image src={star1} alt="rating star" />
                    <Image src={star1} alt="rating star" />
                    <Image src={star2} alt="rating star" />
                    <Image src={star2} alt="rating star" />
                  </div>

                  <div className="flex gap-2 align-center sm:hidden">
                    <Image src={verifyIcon} alt="Verify Icon" />
                    <p className="color-green-300 font-manropeB text-sm font-semibold text-brand-green-shade50">
                      Verified Purchase
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex mt-4">
                  <h3 className="text-green-900 sm:text-custom-color39 font-manropeL text-xs  mr-3.5">Dorcas</h3>
                  <hr className="hidden sm:block w-px h-3.5 bg-brand-disabled2 text-brand-disabled2 border-0" />
                  <span className="font-manropeL text-xs text-custom-color39 ml-3.5">September 22, 2023.</span>
                </div>

                <p className="font-manropeL text-sm font-normal color-green-900 mt-4">
                  Having this product is the best thing that has happened to me in a very long time. Thank you so much
                  for this product. The shipping and delivery was also very good. But there a few tweaks that this can
                  actually have though.
                </p>

                <button className="mt-3 hidden sm:flex text-gray-300 items-center gap-2.5 font-manropeB text-sm font-medium rounded-[10px] border-[1px] border-gray-300 px-3 py-2 mr-3.5">
                  <Image src={likeIcon} alt="Like Icon" />
                  Helpful
                </button>

                <div className="flex sm:hidden pt-4 items-center">
                  <button className="text-gray-300 font-manropeB text-xs font-medium rounded-[5.897px] border-[1px] border-gray-300 py-[3px] px-[8px] mr-3.5">
                    Helpful
                  </button>
                  <hr className="w-px h-[15px] bg-brand-disabled2 text-brand-disabled2 border-0" />

                  <button className="text-gray-300 font-manropeB text-xs font-medium ml-3.5">Report</button>
                </div>

                <div className="mt-5 pt-[18px] pb-[46px] pr-[70px] pl-[16px] bg-custom-color38">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-manropeB text-sm font-semibold">ZuriShopOwner</h3>
                    <p className="font-manropeL text-xs font-normal text-custom-color39">September 22, 2023.</p>
                  </div>
                  <p className="font-manropeL text-sm font-normal mt-4">
                    Having this product is the best thing that has happened to me in a very long time. Thank you so much
                    for this product. The shipping and delivery was also very good. But there a few tweaks that this can
                    actually have though.
                  </p>
                </div>

                <button
                  type="button"
                  className="hidden sm:flex text-base leading-6 mt-7  font-manropeB font-bold text-brand-green-primary mx-auto"
                >
                  See more reviews
                </button>
              </div>
              <div className="flex items-center justify-center sm:hidden ">
                <button
                  type="button"
                  className="flex leading-6 text-base font-manropeB font-bold text-brand-green-primary"
                >
                  <Link href={'/dashboard/reviews/product-details/1'}>See more reviews</Link>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* favorite products  */}
        <div className="mt-[4.4rem] mb-[2.37rem]">
          <div className="flex justify-between items-center mb-5 md:mb-2 lg:mb-[1.13rem]">
            <h3 className="text-custom-color31 font-manropeL font-bold md:text-2xl text-sm md:px-2 truncate w-full">
              Other Products By {shopName}{' '}
            </h3>
          </div>
          {otherProducts.length > 0 ? (
            <>
              <div className="md:mx-[0.66rem] mx-0 hidden lg:block">
                <ShopProductList products={otherProducts.slice(0, 8)} productId={product.id} shopName={shopName} />
              </div>
              <div className="md:mx-[0.66rem] mx-0 hidden lg:hidden md:block">
                <ShopProductList products={otherProducts.slice(0, 6)} productId={product.id} shopName={shopName} />
              </div>
              <div className="md:mx-[0.66rem] mx-0 md:hidden block">
                <ShopProductList products={otherProducts.slice(0, 4)} productId={product.id} shopName={shopName} />
              </div>
            </>
          ) : (
            <div className="mt-8 py-8 px-4 text-center rounded-2xl border border-dark-110/20 text-dark-110 font-manropeL text-xl md:text-2xl font-semibold">
              No Product To Show
            </div>
          )}
        </div>
      </main>
      <Footer shopName={shopName} />
    </>
  );
}
