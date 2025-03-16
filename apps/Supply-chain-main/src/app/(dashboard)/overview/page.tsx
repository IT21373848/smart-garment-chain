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
import { IOrder } from '../../../../models/OrderModel'
import { getAllProductionLines } from '../../../../actions/production/production'
import { getAllEmployees } from '../../../../actions/login/login'
import { convertToTimeRemaining } from '../../../../utils/functions'


const invoices = [
  {
    invoice: "INV001",
    type: "T Shirt",
    emp: "130",
    lins: "2",
    qty: 485,
    iph: 10
  },
  {
    invoice: "INV002",
    type: "Trouser",
    emp: "30",
    lins: "4",
    qty: 454,
    iph: 10
  },
  {
    invoice: "INV003",
    type: "Shirt",
    emp: "100",
    lins: "3",
    qty: 453,
    iph: 10
  },
  {
    invoice: "INV004",
    type: "Blouse",
    emp: "100",
    lins: "4",
    qty: 465,
    iph: 10
  },
  {
    invoice: "INV005",
    type: "T Shirt",
    emp: "10",
    lins: "5",
    qty: 464,
    iph: 10
  },
  {
    invoice: "INV006",
    type: "Shirt",
    emp: "50",
    lins: "5",
    qty: 453,
    iph: 10
  },
  {
    invoice: "INV007",
    type: "Hat",
    emp: "100",
    lins: "1",
    qty: 400,
    iph: 10
  },
]

const Overview = async () => {

  const [orders, lines, employees] = await Promise.all([getAllOrders(), getAllProductionLines(), getAllEmployees()]);

  console.log(orders.data);


  const counts = [
    {
      title: 'Active Orders',
      count: orders?.data?.orders?.length || 0,
      icon: <FactoryIcon />
    },
    {
      title: 'Due Orders',
      count: 2,
      icon: <FileWarning />
    },
    {
      title: 'Active Production Lines',
      count: lines.data?.length || 0,
      icon: <LineChartIcon />
    },
    {
      title: 'Today Employees',
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

      <h5 className='mb-5'>Active Orders</h5>
      <div className='bg-white'>
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order No</TableHead>
              <TableHead>Type Of Garment</TableHead>
              <TableHead>Production Lines</TableHead>
              <TableHead className="text-right">Employees</TableHead>
              <TableHead className="text-right">QTY</TableHead>
              <TableHead className="text-right">Created At</TableHead>
              <TableHead className="text-right">Production Ends in (Estimated)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.data?.orders?.map((invoice: any) => (
              <TableRow key={invoice?._id as string}>
                <TableCell className="font-medium">{invoice.orderNo}</TableCell>
                <TableCell>{invoice.item}</TableCell>
                <TableCell>{invoice?.productionLineNo?.length}</TableCell>
                <TableCell className="text-right">{invoice.productionLineNo?.reduce((total: number, line: any) => total + line?.employeeIds?.length, 0)}</TableCell>
                <TableCell className="text-right">{invoice.qty}</TableCell>
                <TableCell className="text-right">{new Date(invoice.createdAt).toDateString()}</TableCell>

                <TableCell className="text-right">{convertToTimeRemaining(invoice?.estimatedHoursFromNow)}</TableCell>
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


