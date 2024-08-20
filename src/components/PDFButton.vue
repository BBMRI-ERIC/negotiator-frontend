<template>
  <div>
    <a
      class="pdf-text cursor-pointer"
      @click="createPDF"
    ><i class="bi bi-filetype-pdf" /> Download PDF</a>
  </div>
</template>

<script setup>
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/nav-bar-bbmri.png"
import eucaimLogo from "../assets/images/eucaim/home-eucaim.png"
import canservLogo from "../assets/images/canserv/nav-bar-canserv.png"
import moment from "moment"
import { dateFormat } from "@/config/consts"
import { transformStatus } from "../composables/utils.js"

const props = defineProps({
  negotiationPdfData: {
    type: Object,
    default: undefined
  }
})

const logoSrc = activeTheme.activeLogosFiles === "eucaim" ? eucaimLogo : (activeTheme.activeLogosFiles === "canserv" ? canservLogo : bbmriLogo)

function createPDF (view) {
  const pdfName = "negotiation"
  const doc = new jsPDF({ compress: true })

  const negotiationUser = {
    Author: props.negotiationPdfData.author.name,
    Email: props.negotiationPdfData.author.email,
    "Proposal ID": props.negotiationPdfData.id,
    "Submitted at": moment(props.negotiationPdfData.creationDate).format(dateFormat),
    Status: transformStatus(props.negotiationPdfData.status),
    "Report generated at": moment().format(dateFormat)
  }

  doc.addImage(logoSrc, "JPEG", 15, 7, 50, 13, "FAST")

  doc.autoTable({
    body: [
      ["REQUEST SUMMARY"]
    ],
    columnStyles: {
      0: { font: "calibri", fontStyle: "bold", halign: "center" }
    },
    startY: 25,
    rowPageBreak: "auto",
    bodyStyles: { valign: "top" }
  })

  for (const [key, value] of Object.entries(negotiationUser)) {
    const keyLength = 2 + (key.length * 2)
    doc.autoTable({
      body: [
        [`${key}:`, `${value}`]
      ],
      columnStyles: {
        0: { cellWidth: 23, font: "calibri", fontStyle: "bold" },
        1: { cellWidth: 100, font: "calibri" }
      },
      theme: "plain",
      startY: doc.lastAutoTable.finalY + 2,
      rowPageBreak: "auto",
      bodyStyles: { valign: "top" }
    })
  }

  for (const key in props.negotiationPdfData.payload) {
    doc.autoTable({
      body: [
        [key.toUpperCase()]
      ],
      columnStyles: {
        0: { font: "calibri", fontStyle: "bold" }
      },
      startY: doc.lastAutoTable.finalY + 10,
      rowPageBreak: "auto",
      bodyStyles: { valign: "top" }
    })

    for (const value in props.negotiationPdfData.payload[key]) {
      if (props.negotiationPdfData.payload[key][value]) {
        doc.autoTable({
          body: [
            [value + ": ", props.negotiationPdfData.payload[key][value]]
          ],
          startY: doc.lastAutoTable.finalY + 2,
          columnStyles: {
            0: { cellWidth: 25, font: "calibri", fontStyle: "bold" },
            1: { cellWidth: 100, font: "calibri" }
          },
          theme: "plain",
          rowPageBreak: "auto",
          bodyStyles: { valign: "top" }

        })
      }
    }
  }
  doc.save(pdfName + ".pdf")
}
</script>

<style scoped>
a {
    text-decoration: none;
}
.pdf-text {
  color: #3c3c3d;
}

.pdf-text:hover {
  color: #e95713;
}
</style>
