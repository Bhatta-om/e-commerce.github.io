import React from 'react';
import ImageSlider from '../components/ImageSlider';
import LatestCollection from '../components/LatestCollection';
import BestSeller from '../components/BestSeller';
import OurPolicy from '../components/OurPolicy';
import NewsletterBox from '../components/NewsletterBox';

const Home = () => {
  return (
    <div>
      {/* Very minimal spacing, just enough to show separation */}
      <div className="mt-2"> {/* or mt-1 for even thinner spacing */}
        <ImageSlider />
        <LatestCollection />
        <BestSeller />
        <OurPolicy />
        <NewsletterBox />
      </div>
      {/* Other homepage content */}
    </div>
  );
};

export default Home;