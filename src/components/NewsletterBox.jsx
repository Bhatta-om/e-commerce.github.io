import React from 'react'

const NewsletterBox = () => {

      const onSubmitHandler =() => {
        event.preventDefault();
      }

  return (
    <div className='text-center'>
        <p className='text-2xl font-medium text-gray-800'>Subscribe now and get 20% off</p>
        <p className='text-gray-400 mt-3'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore libero repellat pariatur expedita excepturi dolorum sapiente modi distinctio laudantium eius.</p>
        <form className='w-full sm:w-1/2 flex item-center gap-3 mx-auto my-6 border pl-3'>
            <input className='w-full sm:flex-1 outline-none' type="email" placeholder='enter you email' required />
            <button type='submit' className='bg-purple-600 text-white text-xs px-10 py-4'>SUBSCRIBE</button>
        </form>
        <hr />

    </div>
  )
}

export default NewsletterBox