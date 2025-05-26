'use server'
import { DesignModel, IDesign } from "../../models/DesignModel";


export const createDesign = async (design: IDesign) => {
    try {
        const isExist = await DesignModel.findOne({ id: design.id });
        if (isExist) {
            throw new Error('Design already exists')
        }
        const newDesign = await DesignModel.create(design);
        return {
            status: 200,
            msg: 'Design created successfully',
        }
    } catch (error: any) {
        console.log('error c design', error)
        return {
            status: 400,
            msg: error.message
        }
    }
};

export const getDesigns = async () => {
    try {
        const designs = await DesignModel.find();
        return JSON.stringify(designs);
    } catch (error: any) {
        return error
    }
};