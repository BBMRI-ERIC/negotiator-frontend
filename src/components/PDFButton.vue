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
import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/bbmri/home-bbmri.png"
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
      logoSrc: activeTheme.activeLogosFiles === "eucaim" ? eucaimLogo : (activeTheme.activeLogosFiles=== 'canserv' ? canservLogo : bbmriLogo)
    }
  },
  methods: {
    createPDF () {
      const pdfName = "negotiation"
      const doc = new jsPDF()

      const negotiationUser = {
        Author: this.negotiationPdfData.author.name,
        Email: this.negotiationPdfData.author.email,
        "Negotiation ID": this.negotiationPdfData.id,
        "Submitted at": this.negotiationPdfData.creationDate,
        Status: this.negotiationPdfData.status,
        "Report generated at": moment().format(dateFormat)
      }

      doc.addImage(this.logoSrc, "JPEG", 15, 7, 50, 13)

      doc.setFont("calibri", "bold")
      doc.text("REQUEST SUMMARY", 105, 20, null, null, "center")

      doc.setFont("calibri", "bold")
      doc.setFontSize(14)

      // Iterate through highlighted information and add to PDF
      let yPos = 30
      for (const [key, value] of Object.entries(negotiationUser)) {
        doc.setFont("calibri", "bold")
        doc.text(`${key}:`, 15, yPos)
        const nekiBroj = 22 + (key.length * 2)
        doc.setFont("calibri", "normal")
        doc.text(`${value}`, nekiBroj, yPos)

        yPos += 10
      }

      doc.line(0, yPos, 220, yPos)

      let paddingInLoop = 100 // Initial padding

      for (const key in this.negotiationPdfData.payload) {
        doc.setFont("calibri", "bold")

        doc.text(key.toUpperCase(), 15, paddingInLoop)
        paddingInLoop += 10

        doc.setFont("calibri", "normal")

        for (const value in this.negotiationPdfData.payload[key]) {
          if (this.negotiationPdfData.payload[key][value]) {
            // Split text to fit within specified width
            const lines = doc.splitTextToSize(value + ": " + this.negotiationPdfData.payload[key][value], 180)

            // Add each line to the PDF
            for (let i = 0; i < lines.length; i++) {
              doc.text(lines[i], 15, paddingInLoop)
              paddingInLoop += 5
            }
          }
        }
        paddingInLoop += 10
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
