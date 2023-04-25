import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import { useState } from "react"
import { Pie } from "react-chartjs-2";

Chart.register(CategoryScale)

export const StatsView = ({ projects }) => {

  const chartData = {
    labels: projects.map(project => project.name),
    datasets: [
      {
        label: "project commits",
        data: projects.map(project => project.contributions)
      },
    ]
  }

  return (
    <div>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Commits by project"
            }
          }
        }}
      />
    </div>
  )
}

export default StatsView