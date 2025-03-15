"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import React, { useEffect } from "react"


const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function PredictAnimation() {
    const [chartData, setChartData] = React.useState([
        { month: "Item", desktop: 186 },
        { month: "Employees", desktop: 285 },
        { month: "Quantity", desktop: 237 },
        { month: "Hours", desktop: 203 },
        { month: "Production Lines", desktop: 209 },
    ])

    useEffect(() => {
        const interval = setInterval(() => {
            setChartData((prevData) => {
                const newData = prevData.map((item) => ({
                    ...item,
                    desktop: Math.floor(Math.random() * 100),
                }))
                return newData
            })
        }, 1000)
        return () => clearInterval(interval)
    })
    return (
        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
        >
            <RadarChart data={chartData}>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <PolarGrid className="fill-[--color-desktop] opacity-20" />
                <PolarAngleAxis dataKey="month" />
                <Radar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    fillOpacity={0.5}
                />
            </RadarChart>
        </ChartContainer>
    )
}
