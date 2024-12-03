import axios from 'axios';
import React from 'react'

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
            const resp = await axios.post("http://localhost:8000/predict", {
                "Type of clothing": item,
                "Production line number": lines,
                "Number of employees": employees,
                "Quantity of order": qty,
                "Elapsed time": time
            })

            console.log(resp.data);

            setEstimatedTime(resp?.data?.time);
        } catch (error: any) {
            console.log(error);
            setError(error?.response?.data?.error);

        }
    }
    return (
        <div className='w-full min-w-96'>
            <h1>Predict Time</h1>

            <div className='flex flex-col bg-white/10 rounded-xl items-center justify-center gap-3 text-black w-full'>
                {error && <p className='text-red-500'>{error}</p>}
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
                <div>
                    <p className='text-white'>Elapsed Time: {time || 0}</p>
                    <input type="number" value={time} onChange={(e) => setTime(parseInt(e.target.value))} />
                </div>

                <button className='bg-green-800 hover:bg-green-900 text-white font-bold py-2 px-4 rounded' onClick={handleEstimation}>Predict</button>
            </div>

            <div className='bg-white rounded-xl p-3 border shadow-sm my-5 text-black'>
                <p>Estimated Time (in hours):</p>
                <p >{estimatedTime}</p>
            </div>
        </div>
    )
}

export default PredictTime