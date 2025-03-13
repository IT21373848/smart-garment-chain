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

type Props = {}

const counts = [
  {
    title: 'Active Orders',
    count: 3,
    icon: <FactoryIcon />
  },
  {
    title: 'Due Orders',
    count: 2,
    icon: <FileWarning />
  },
  {
    title: 'Active Production Lines',
    count: 1,
    icon: <LineChartIcon />
  },
  {
    title: 'Today Employees',
    count: 200,
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

const Overview = (props: Props) => {
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
              <TableHead className="text-right">Items Per Hour</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                <TableCell>{invoice.type}</TableCell>
                <TableCell>{invoice.lins}</TableCell>
                <TableCell className="text-right">{invoice.emp}</TableCell>
                <TableCell className="text-right">{invoice.qty}</TableCell>
                <TableCell className="text-right">{invoice.iph}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{invoices.reduce((total, invoice) => total + parseInt(invoice.emp), 0)}</TableCell>
              <TableCell className="text-right">{invoices.reduce((total, invoice) => total + (invoice.qty), 0)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

    </div>
  )
}

export default Overview


