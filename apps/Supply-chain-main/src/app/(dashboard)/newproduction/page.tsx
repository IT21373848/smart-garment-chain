'use client'
import React, { useEffect } from 'react'
import { CLOTHING_ITEMS } from '../../../../config/config'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { IProdLine } from '../../../../models/LineModel'
import { getAllProductionLines } from '../../../../actions/production/production'
import { predict } from '../../../../actions/predict/predict'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PredictAnimation } from '@/components/Dashboard/AnimatingPredictChart'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { PieChartView } from '@/components/Dashboard/PieChart'
import { toast } from 'sonner'

const History = () => {
  const [isPredicting, setIsPredicting] = React.useState<boolean>(false)
  const [selectedItem, setSelectedItem] = React.useState<string>('')
  const [quantity, setQuantity] = React.useState<number>(0)
  const [productionLines, setProductionLines] = React.useState<Partial<IProdLine[]>>()
  const [selectedLines, setSelectedLines] = React.useState<Partial<IProdLine[]>>([])
  const [predictedManHours, setPredictedManHours] = React.useState<number>(0)
  const [elapsedTime, setElapsedTime] = React.useState<number>(0)
  const [startDate, setStartDate] = React.useState<Date>(new Date())
  const [estimatedEndDate, setEstimatedEndDate] = React.useState<Date>(new Date())

  const getProdLines = async () => {
    const lines = await getAllProductionLines()
    setProductionLines(lines.data)
  }

  useEffect(() => {
    getProdLines()
  }, [])

  const predictManHours = async () => {
    try {
      setIsPredicting(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const employees = selectedLines?.reduce((acc, line) => acc + (line?.employeeIds?.length || 0), 0) || 0
      const resp = await predict({
        item: selectedItem,
        lines: selectedLines?.length || 0,
        emp: employees,
        qty: quantity,
        elapsed: elapsedTime
      })

      if (resp.status !== 200) {
        setIsPredicting(false)
        throw new Error(resp.message)
      }

      setPredictedManHours(resp.manHours)
      const newEndDate = new Date(startDate.getTime() + (resp.manHours * 60 * 60 * 1000))
      setEstimatedEndDate(newEndDate)
      setIsPredicting(false)
    } catch (error: any) {
      console.log(error)
      setIsPredicting(false)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    //debounce
    const t = setTimeout(() => {
      predictManHours()
    }, 1000)

    return () => clearTimeout(t)
  }, [selectedItem, quantity, selectedLines, elapsedTime])

  const handleAddToSelectedLines = (lineNo: String) => {
    if (selectedLines.find((line) => line?.lineNo === lineNo)) return
    const line = productionLines?.find((line) => line?.lineNo === lineNo)
    if (line) {
      setSelectedLines([...selectedLines, line])
    }
  }

  const handleRemoveFromSelectedLines = (lineNo: string) => {
    setSelectedLines(selectedLines.filter((line) => line?.lineNo !== lineNo))
  }

  const handleNewProduction = () => { }

  return (
    <div className='bg-white p-5 h-full rounded-xl '>
      <h1 className='text-2xl font-semibold mb-5'>New Production</h1>
      <div className='flex items-start gap-5 w-full mb-10'>
        <div className='flex flex-col gap-10 w-full'>
          <Label className='mb-2'>Item</Label>
          <Select
            value={selectedItem}
            onValueChange={(value) => setSelectedItem(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an item" />
            </SelectTrigger>
            <SelectContent>
              {CLOTHING_ITEMS.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label className='mt-5 mb-2'>Quantity</Label>
          <Input
            type="number"
            value={quantity}
            className=''
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />

          <Label className='mt-5 mb-2'>Production Lines</Label>
          <Select onValueChange={(value) => handleAddToSelectedLines((value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a production line" />
            </SelectTrigger>
            <SelectContent className=''>
              {productionLines?.map((line) => (
                <SelectItem key={line?.lineNo} value={line?.lineNo.toString() || ''}>
                  {line?.lineNo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label className='mt-5 mb-2'>Selected Lines</Label>
          <div className='flex items-center gap-3 flex-wrap w-1/2'>
            {
              selectedLines?.map((line) => (
                <Button onClick={() => handleRemoveFromSelectedLines(line?.lineNo || '0')} key={line?.lineNo} className='w-[180px]'>{line?.lineNo}</Button>
              ))
            }
          </div>

        </div>

        <Card className='w-full'>
          <CardContent className="pb-0">
            {isPredicting ? <PredictAnimation />
              : <>
                <PieChartView />
                <CardFooter>
                  <div className='flex items-center justify-between w-full'>
                    <div className='flex items-center gap-2'>
                      <Label>Man Hours</Label>
                      <span>{predictedManHours}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Label>Elapsed Time</Label>
                      <span>{elapsedTime}</span>
                    </div>
                  </div>
                </CardFooter>
                <CardFooter className='mt-10 pt-5 flex items-center justify-between'>
                  <div>
                    <Label>Production Start Date</Label>
                    <span>{startDate?.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <Label>Estimated Deadline</Label>
                    <span>{estimatedEndDate?.toLocaleDateString()}</span>
                  </div>
                </CardFooter>
              </>
            }
          </CardContent>
        </Card>
      </div>
      <Button className='mt-20' onClick={handleNewProduction}>Add New Production</Button>
    </div>
  )
}

export default History