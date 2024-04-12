<template>
  <div>
    <a
      class="pdf-text cursor-pointer"
      @click="createPDF"
    ><i class="bi bi-filetype-pdf" /> Download PDF</a>
  </div>
</template>

<script>
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/nav-bar-bbmri.png"
import eucaimLogo from "../assets/images/eucaim/home-eucaim.png"
import canservLogo from "../assets/images/canserv/nav-bar-canserv.png"
import moment from "moment"
import { dateFormat } from "@/config/consts"

export default {
  props: {
    negotiationPdfData: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      logoSrc: activeTheme.activeLogosFiles === "eucaim" ? eucaimLogo : (activeTheme.activeLogosFiles === "canserv" ? canservLogo : bbmriLogo)
    }
  },
  methods: {
    createPDF () {
      const pdfName = "negotiation"
      const doc = new jsPDF({ compress: true })

      const negotiationUser = {
        Author: this.negotiationPdfData.author.name,
        Email: this.negotiationPdfData.author.email,
        "Negotiation ID": this.negotiationPdfData.id,
        "Submitted at": this.negotiationPdfData.creationDate,
        Status: this.negotiationPdfData.status,
        "Report generated at": moment().format(dateFormat)
      }

      doc.addImage(this.logoSrc, "JPEG", 15, 7, 50, 13, "FAST")

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
            1: { font: "calibri" }
          },
          theme: "plain",
          startY: doc.lastAutoTable.finalY + 2,
          rowPageBreak: "auto",
          bodyStyles: { valign: "top" }
        })
      }

      for (const key in this.negotiationPdfData.payload) {
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

        for (const value in this.negotiationPdfData.payload[key]) {
          if (this.negotiationPdfData.payload[key][value]) {
            doc.autoTable({
              body: [
                [value + ": ", this.negotiationPdfData.payload[key][value]]
              ],
              startY: doc.lastAutoTable.finalY + 2,
              columnStyles: {
                0: { cellWidth: 25, font: "calibri", fontStyle: "bold" },
                1: { font: "calibri" }
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
  }
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
