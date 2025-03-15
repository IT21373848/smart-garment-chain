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
import React from "react";

export type TableHeaderType = {
    title: string
    key: string,
    align?: "left" | "center" | "right",
    render?: (value: any) => React.ReactNode
}

type Options = {
    textColor?: string,
    indexing?: boolean,
    indexingLabel?: string
}

export type TableDataType = {
    caption?: string;
    footer?: React.ReactNode;
    headers: TableHeaderType[],
    data?: any[],
    loading?: boolean,
    options?: Options
}

export function CustomTable({ caption, footer, headers, data, loading = false, options }: TableDataType) {

    const getNestedValue = (obj: any, key: string) => {
        return key.split('.').reduce((acc, part) => acc && acc[part], obj);
    };
    return (
        <Table className={`text-${options?.textColor || "black"}`}>
            <TableCaption>{caption}</TableCaption>
            <TableHeader>
                <TableRow>
                    {options?.indexing && <TableHead className="text-center">{options?.indexingLabel || "No."}</TableHead>}
                    {
                        headers.map((header, index) => (
                            <TableHead key={index} className={`text-${header?.align || "left"}`}>{header.title}</TableHead>
                        ))
                    }
                </TableRow>
            </TableHeader>
            <TableBody>
                {(data && data?.length > 0 && !loading) ? data.map((dt, index) => (
                    <TableRow key={index}>
                        {options?.indexing && <TableCell className="text-center">{index + 1}</TableCell>}
                        {
                            headers.map((header, idx) => (
                                <TableCell key={idx} className={`text-${header?.align || "left"}`}>{header.render ? header.render(getNestedValue(dt, header.key)) : getNestedValue(dt, header.key)}</TableCell>
                            ))
                        }
                    </TableRow>
                )) : <TableRow><TableCell className="h-24 text-center" colSpan={headers.length}>{loading ? "Loading..." : "No data found"}</TableCell></TableRow>}
            </TableBody>
            <TableFooter>
                {footer}
            </TableFooter>
        </Table>
    )
}
