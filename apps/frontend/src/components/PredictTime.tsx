import axios from 'axios';
import React from 'react'
import { SERVER_URI } from '../constants/config';

type Props = {}

const uniqueClothingItems = [
    "Blouse",
    "Coat",
    "Dress",
    "Jeans",
    "Jacket",
    "Pants",
    "Shorts",
    "Skirt",
    "Sweater",
    "T-shirt"
];


function PredictTime({ }: Props) {
    const [item, setItem] = React.useState<string>(uniqueClothingItems[0]);
    const [qty, setQty] = React.useState<number>(1);
    const [lines, setLines] = React.useState<number>(1);
    const [time, setTime] = React.useState<number>(0);
    const [employees, setEmployees] = React.useState<number>(1);
    const [error, setError] = React.useState<string>("");

    const [estimatedTime, setEstimatedTime] = React.useState<number>(0);

    const handleEstimation = async () => {
        try {
            setError("");
            if (qty > 10000) {
                setError("Quantity of order must be less than 10000");
                return
            }

            if (employees < 10) {
                setError("Number of employees must be greater than 10");
                return
            }
            const elpTime = (Math.floor(qty / (employees * lines)))
            console.log(elpTime);
            const resp = await axios.post(`${SERVER_URI}/predict`, {
                "Type of clothing": item,
                "Production line number": lines,
                "Number of employees": employees,
                "Quantity of order": qty,
                "Elapsed time": elpTime
            })

            console.log(resp.data);

            setEstimatedTime(resp?.data['Predicted Man Hours']);
        } catch (error: any) {
            console.log(error);
            setError(error?.response?.data?.error);

        }
    }
    return (
        <div className='w-full min-w-96'>
            <h1>Predict Time</h1>
            <div className='flex flex-col gap-3 p-4 rounded-xl bg-gray-500/50'>
                <div className='flex flex-col bg-[#F3D49B] rounded-xl p-4 items-center justify-center gap-3 text-black w-full'>
                    {error && <p className='text-red-500 text-xs'>{error}</p>}
                    <label className='text-white' htmlFor="item">Item</label>
                    <select className='text-black' name="item" id="item" value={item} onChange={(e) => setItem(e.target.value)}>
                        {uniqueClothingItems.map((item) => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    <label className='text-white' htmlFor="qty">Qty</label>
                    <input type="number" name="qty" id="qty" value={qty} onChange={(e) => setQty(parseInt(e.target.value))} />

                    <label className='text-white' htmlFor="lines">Lines</label>
                    <input type="number" name="lines" id="lines" value={lines} onChange={(e) => setLines(parseInt(e.target.value))} />

                    <label className='text-white' htmlFor="employees">Employees</label>
                    <input type="number" name="employees" id="employees" value={employees} onChange={(e) => setEmployees(parseInt(e.target.value))} />

                    {/* elapsed time */}
                    <div className='hidden'>
                        <p className='text-white'>Elapsed Time: {time || 0}</p>
                        <input type="number" value={time} onChange={(e) => setTime(parseInt(e.target.value))} />
                    </div>

                </div>
                <button className='bg-yellow-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full' onClick={handleEstimation}>Predict</button>
            </div>


            <div className='bg-white rounded-xl p-3 border shadow-sm my-5 text-black flex items-center justify-between gap-4'>
                <div>
                    <p>Estimated Time (in hours):</p>
                    <p >{estimatedTime}</p>
                </div>
                <div className='w-20 h-20'>
                    <img src="https://media.istockphoto.com/id/920345886/vector/classic-wristwatch-icon.jpg?s=612x612&w=0&k=20&c=MbgyLy52hlVIOqppuIpML4XSuxFUJozffHVH0Q5jMZ4=" className='w-full h-full object-contain' />
                </div>
            </div>
        </div>
    )
}

export default PredictTime