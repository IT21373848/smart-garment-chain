import React from 'react'
import { getAllEmployees } from '../../../../actions/login/login'
import { Table, TableCaption, TableHeader } from '@/components/ui/table'
import { CustomTable, TableHeaderType } from '@/components/Dashboard/CustomTable'
import { getAllProductionLines } from '../../../../actions/production/production'
import CreateUserDialog from '@/components/ProductionScheduling/CreateUserDialog'
import CreateProductionLineDialog from '@/components/ProductionScheduling/CreateProductionLine'

const userTableHeaders: TableHeaderType[] = [
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Email',
    key: 'email',
  },
  {
    title: 'Role',
    key: 'role',
  },
]

const ProductionLineHeaders: TableHeaderType[] = [
  {
    title: 'Line No',
    key: 'lineNo',
  },
  {
    title: 'Employee Count',
    key: 'employeeIds',
    render: (value: any) => value.length
  },
]

const CurrentPage = async () => {

  const allUsers = await getAllEmployees()

  const allProductionLines = await getAllProductionLines()
  console.log('All users:', allUsers);

  console.log('All production lines:', allProductionLines);

  return (
    <div>
      <h2>All Production Lines</h2>
      <div className='w-max float-end'>
        <CreateProductionLineDialog employees={allUsers.employees}/>
      </div>
      <CustomTable data={allProductionLines.data} headers={ProductionLineHeaders} />

      <div className='w-max float-end'>
        <CreateUserDialog />
      </div>

      <h2>All Employees</h2>

      <CustomTable data={allUsers.employees} headers={userTableHeaders} />
    </div>
  )
}

export default CurrentPage