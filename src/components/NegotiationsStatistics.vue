<template>
  <div>
    <Doughnut
      :data="data"
      :options="options"
    />
  </div>
  <div>
    <!-- <span
      class="badge"
      :class="getBadgeColor('SUBMITTED')"
      style="width: 120px;"
    >
      <i
        :class="getBadgeIcon('SUBMITTED')"
        class="px-1"
      />
      {{ transformStatus("SUBMITTED") }}
    </span> -->
  </div>
</template>

<script setup>
import { ref } from "vue"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "vue-chartjs"
import { transformStatus, getBadgeColor, getBadgeIcon } from "../composables/utils.js"

ChartJS.register(ArcElement, Tooltip, Legend)

const data = ref({
  labels: [
    "Red",
    "Blue",
    "Yellow"
  ],
  datasets: [
    {
      backgroundColor: ["#f37125", "#dc3545", "#e95713", "#3B8501"],
      data: [40, 20, 80, 10]
    }
  ]
})
const options = ref({
  responsive: true,
  maintainAspectRatio: false
}
)
</script>