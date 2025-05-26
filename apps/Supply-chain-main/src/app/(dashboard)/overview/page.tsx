import CountCard from '@/components/Dashboard/CountCard'
import { Clock, FactoryIcon, FileWarning, HeartPulse, LineChartIcon, PersonStanding } from 'lucide-react'
import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getAllOrders } from '../../../../actions/orders/order'
import { getAllProductionLines } from '../../../../actions/production/production'
import { getAllEmployees } from '../../../../actions/login/login'
import { convertToTimeRemaining } from '../../../../utils/functions'
import { isOrderDue } from '@/utils/helper'
import UpdateProductionModal from '@/components/ProductionScheduling/UpdateProductionModal'



const Overview = async () => {
  const today = new Date()
  const [orders, lines, employees] = await Promise.all([getAllOrders(), getAllProductionLines(), getAllEmployees()]);

  // console.log(orders.data);

  if (orders?.data?.orders?.length > 0) {

    orders.data.orders = orders.data.orders.map((order: any) => {
      const endDate = today.getTime() + order?.estimatedHoursFromNow * 60 * 60 * 1000
      return {
        ...order,
        isDue: isOrderDue(new Date(endDate), order?.deadline)
      }
    })
  }


  const counts = [
    {
      title: 'Active Orders',
      count: orders?.data?.orders?.length || 0,
      icon: <FactoryIcon />
    },
    {
      title: 'Due Orders',
      count: orders?.data?.orders?.filter((order: any) => order?.isDue)?.length || 0,
      icon: <FileWarning />
    },
    {
      title: 'Active Production Lines',
      count: lines.data?.length || 0,
      icon: <LineChartIcon />
    },
    {
      title: 'Employees',
      count: employees.employees?.length || 0,
      icon: <PersonStanding />
    },
    {
      title: 'Factory Health',
      count: 70,
      icon: <HeartPulse />,
      isPercentage: true
    },
    {
      title: 'Item Per Hour',
      count: 70,
      icon: <Clock />,
    }

  ]
  return (
    <div>
      <h2 className='text-2xl font-bold mb-5'>Overview</h2>
      <div className='flex items-center gap-5 justify-start mb-10'>
        {
          counts.map((count, key) => (
            <CountCard count={count.count} title={count.title} icon={count.icon} isPercentage={count?.isPercentage} key={key} />
          ))
        }
      </div>

      <h5 className='mb-5'>Active Productions</h5>
      <div className='bg-white max-w-full overflow-x-auto'>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Production No</TableHead>
              <TableHead>Type Of Garment</TableHead>
              <TableHead>Production Lines</TableHead>
              <TableHead className="text-right">Employees</TableHead>
              <TableHead className="text-right">QTY</TableHead>
              <TableHead className="text-right">Created At</TableHead>
              <TableHead className="text-right">Actual Deadline</TableHead>
              <TableHead className="text-right">Production Ends in (Estimated)</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.data?.orders?.map((invoice: any) => (
              <TableRow key={invoice?._id as string} className={`${invoice.isDue ? "bg-red-100" : "bg-green-100"}`}>
                <TableCell className="font-medium">{invoice.orderNo}</TableCell>
                <TableCell>{invoice.item}</TableCell>
                <TableCell>{invoice?.productionLineNo?.length}</TableCell>
                <TableCell className="text-right">{invoice.productionLineNo?.reduce((total: number, line: any) => total + line?.employeeIds?.length, 0)}</TableCell>
                <TableCell className="text-right">{invoice.qty}</TableCell>
                <TableCell className="text-right">{new Date(invoice.createdAt).toDateString()}</TableCell>
                <TableCell className="text-right">{new Date(invoice.deadline).toDateString()}</TableCell>
                <TableCell className="text-right">{convertToTimeRemaining(invoice?.estimatedHoursFromNow)}</TableCell>
                <TableCell className='text-right'>
                  <UpdateProductionModal invc={JSON.stringify(invoice)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{orders?.data?.orders?.reduce((total: number, invoice: any) => total + (invoice?.productionLineNo?.reduce((total: number, line: any) => total + line?.employeeIds?.length, 0)), 0)}</TableCell>
              <TableCell className="text-right">{orders?.data?.orders?.reduce((total: number, invoice: any) => total + invoice.qty, 0)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

    </div>
  )
}

export default Overview


