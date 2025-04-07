import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Pagination, Navigation, Autoplay } from 'swiper/modules';

export default function Swip() {
    const { t } = useTranslation();
    
    const slides = [
        {
            title: t('swiperTitle1'),
            description: t('swiperDesc1')
        },
        {
            title: t('swiperTitle2'),
            description: t('swiperDesc2')
        },
        {
            title: t('swiperTitle3'),
            description: t('swiperDesc3')
        },
        {
            title: t('swiperTitle4'),
            description: t('swiperDesc4')
        },
        {
            title: t('swiperTitle5'),
            description: t('swiperDesc5')
        },
        {
            title: t('swiperTitle6'),
            description: t('swiperDesc6')
        },
        {
            title: t('swiperTitle7'),
            description: t('swiperDesc7')
        }
    ];

    return (
        <div  className="w-full relative max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-32" onClick={(e) => e.stopPropagation()}>
            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                loop={true}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}

                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                }}
                modules={[Pagination, Autoplay]}
                className="mySwiper"
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            backgroundImage: `url('/swiperImg/img${i}.jpg')`,                               
                        }}
                            className={`relative bg-cover bg-center backdrop-blur-sm p-6 border border-[#c8c2fd] hover:border-[#6D28D9] transition-all duration-300 h-[250px]`}>
                            {/* Content positioned above the overlay */}
                            <div className="relative bg-white/10 p-4 z-10 flex flex-col h-full">
                                <div className="bg-[#c8c2fd] w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-[#6D28D9] text-xl font-bold">{i + 1}</span>
                                </div>
                                <h3 className="text-[#c8c2fd] text-xl font-semibold mb-3">{slide.title}</h3>
                                <p className="text-[#c8c2fd] text-base">{slide.description}</p> 
                            </div>
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1E3A8A]/90 to-transparent" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
