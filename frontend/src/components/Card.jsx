import React from 'react'

const Card = ({icon, heading, para}) => {
    return (
        <div className='w-full max-w-[380px] h-auto p-4 shadow-md bg-white rounded-lg hover:shadow-2xl transition-shadow duration-300'>
            <div className='flex items-start space-x-4'>
                {/* Icon Section */}
                <div className='flex-shrink-0 p-2'>
                    {icon}
                </div>
                {/* Text Section */}
                <div className='flex flex-col justify-center text-left space-y-2'>
                    <h1 className='text-xl md:text-2xl font-bold'>{heading}</h1>
                    <p className='text-sm md:text-base text-gray-600'>{para}</p>
                </div>
            </div>
        </div>
    )
}

export default Card;
