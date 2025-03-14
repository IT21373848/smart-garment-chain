import React from 'react'
import { Progress } from '../ui/progress'

type Props = {
    count: number,
    title: string,
    icon: React.ReactNode
    isPercentage?: boolean
}

const CountCard = (props: Props) => {
    return (
        <div className='shadow-xl p-5 border bg-white border-gray-50 rounded-2xl min-w-60 transition-all max-w-80 min-h-32 cursor-pointer hover:scale-105'>
            <div className='flex items-start gap-3'>
                {props.icon}
                <h6 className='font-medium'>{props.title}</h6>
            </div>
            <div className='mt-5'>
                <p className='text-3xl font-semibold'>{props.count}</p>
                {props.isPercentage && <Progress value={props.count} />}
            </div>
        </div>
    )
}

export default CountCard