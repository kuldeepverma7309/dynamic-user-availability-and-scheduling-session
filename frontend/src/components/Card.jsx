import React from 'react'

const Card = ({icon, heading, para}) => {
return (
    <div className='w-[380px] h-[160px] shadow-md bg-white rounded-lg mt-6 space-x-3 hover:shadow-2xl'>
            <div className='flex flex-col justify-start pt-3 px-3'>
                    {icon}
            </div>
            <div className='py-4 flex flex-col justify-center items-start text-left space-y-2'>
                    <h1 className='text-2xl font-bold'>{heading}</h1>
                    <p className='text-base text-gray-600'>{para}</p>
            </div>
    </div>
)
}

export default Card