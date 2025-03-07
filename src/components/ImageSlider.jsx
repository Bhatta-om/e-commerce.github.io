import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Extended dummy data with more images
const dummySlides = [
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200",
    title: "Summer Collection",
    description: "Discover our latest summer styles",
    link: "/summer-collection",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
    title: "New Arrivals",
    description: "Check out our newest products",
    link: "/new-arrivals",
  },
  {
    image:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200",
    title: "Special Offers",
    description: "Limited time deals on selected items",
    link: "/offers",
  },
  {
    image:
      "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?q=80&w=1200",
    title: "Winter Collection",
    description: "Stay warm with our winter essentials",
    link: "/winter",
  },
  {
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200",
    title: "Accessories",
    description: "Complete your look with our accessories",
    link: "/accessories",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200",
    title: "Fashion Week",
    description: "Explore the latest trends",
    link: "/trends",
  },
];

const ImageSlider = () => {
  const [slides] = useState(dummySlides);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef();

  // Function to move to next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, [slides.length]);

  // Function to move to previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  }, [slides.length]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        nextSlide();
      }, 3000); // Slides every 3 seconds
    }

    // Cleanup interval on component unmount or when paused
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPaused, nextSlide]);

  // Transition style for smooth sliding
  const slideStyle = {
    transform: `translateX(-${currentIndex * 100}%)`,
    transition: "transform 0.5s ease-in-out",
  };

  return (
    <div
      className="relative w-full h-[500px] md:h-[600px] overflow-hidden border border-gray-500 rounded-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides Container */}
      <div className="flex h-full" style={slideStyle}>
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent">
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="max-w-lg text-white">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    {slide.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-6">{slide.description}</p>
                  <Link
                    to={slide.link}
                    className="inline-block bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors z-10"
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors z-10"
        aria-label="Next slide"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
