'use server'

type Predict = {
    item: string,
    lines: number,
    emp: number,
    qty: number,
    elapsed: number
}

const FLASK_API_URL = process.env.FLASK_SERVER as string

export async function predict(predictInput: Predict) :Promise<{ status: number, message: string, manHours: number }> {
    try{
        console.log(predictInput)
        const response = await fetch(`${FLASK_API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(predictInput)
        })  

        if(!response.ok){
            throw new Error("Failed to fetch data")
        }
        const data = await response.json()

        console.log(data['Predicted Man Hours'])

        return {
            status: 200,
            message: data.message,
            manHours: data['Predicted Man Hours']
        }

    }catch(error: any){
        console.log(error?.message)
        return {
            status: 500,
            message: error.message || "Error fetching data",
            manHours: 0
        }
    }
}