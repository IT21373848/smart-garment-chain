import React from 'react'
import { getDesigns } from '../../../../actions/design/design'
import { CustomTable, TableHeaderType } from '@/components/Dashboard/CustomTable'
import CreateDesignModal from '@/components/ProductionScheduling/CreateDesignModal'

type Props = {}

const designHeaders: TableHeaderType[] = [
    {
        title: 'Design ID',
        key: 'id',
    },
    {
        title: 'Design Name',
        key: 'name',
    },
    {
        title: 'Type of Garment',
        key: 'typeOfGarment',
    }
]

const DesignPage = async (props: Props) => {

    const designs = await getDesigns()

    return (
        <div>
            <h1 className='text-2xl font-semibold mb-5'>New Designs</h1>
            <div className='bg-white p-4 w-full flex items-center justify-end rounded-xl my-5'>
                <CreateDesignModal />

            </div>
            <h2>All Designs</h2>

            <CustomTable data={JSON.parse(designs)} headers={designHeaders} />
        </div>
    )
}

export default DesignPage