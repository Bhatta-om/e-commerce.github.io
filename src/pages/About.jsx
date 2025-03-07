import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>
    <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
    </div>
     
     <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quibusdam unde ea modi cupiditate molestiae error libero voluptates aperiam molestias vero.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis reprehenderit reiciendis commodi accusamus vel fugit, beatae nemo a? Voluptatem, recusandae. Consequatur incidunt quod aliquam quisquam iusto, illo accusamus aut quia!</p>
        <b className='text-gray-800'>Our Mission</b>
        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus atque tenetur omnis dignissimos inventore voluptatum accusamus voluptatibus animi, numquam quasi nam, necessitatibus sit odit aliquam non voluptate praesentium sed soluta?</p>

        </div>
        
     </div>
     <div className='text-4xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />

     </div>
     <div className='flex flex-col md:flex-row text-sm mb-20 '>

     <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
            <b>Quality Assurance:</b>
            <p className='text-gray-600'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veniam aperiam quod porro. Nam, incidunt quisquam!</p>

        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
            <b>Convinience:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio consequatur impedit voluptates. Libero soluta distinctio amet reprehenderit laudantium ipsum ducimus impedit nostrum. Et, omnis totam qui maxime consectetur eaque voluptates.</p>

        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5 '>
            <b>Exceptional Customer Service:</b>
            <p className='text-gray-600'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum voluptatem soluta doloremque vero quidem laudantium culpa nemo pariatur ea aliquid!</p>

        </div>

     </div>
     <NewsletterBox />


    </div>
  )
}

export default About