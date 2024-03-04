<template>
  <div>
    <button
      type="button"
      class="btn btn-primary"
      @click="createPDF"
    >
      <i class="bi-filetype-pdf" />
      <span class="text-">Download PDF</span>
    </button>
  </div>
</template>

<script>
import jsPDF from "jspdf"
import activeTheme from "../config/theme.js"
import bbmriLogo from "../assets/images/home-bbmri.png"
import eucaimLogo from "../assets/images/home-eucaim.png"

export default {
  props: {
    negotiationPdfData: {
      type: Object,
      default: undefined
    }
  },
  data () {
    return {
      logoSrc: activeTheme.activeLogosFiles === "bbmri" ? bbmriLogo : eucaimLogo
    }
  },
  methods: {
    createPDF () {
      const pdfName = "negotiation"
      const doc = new jsPDF()

      doc.addImage(this.logoSrc, "JPEG", 15, 5, 50, 13)

      doc.setFont("calibri", "bold")
      doc.text("Request sumary", 105, 20, null, null, "center")

      doc.setFont("calibri", "normal")

      doc.text("Author: " + this.negotiationPdfData.author.name, 15, 30)
      doc.text("Email: " + this.negotiationPdfData.author.email, 15, 35)
      doc.text("Negotiation ID: " + this.negotiationPdfData.id, 15, 40)
      doc.text("Status: " + this.negotiationPdfData.status, 15, 45)

      let paddingInLoop = 75
      for (const key in this.negotiationPdfData.payload) {
        doc.text(key + ": ", 15, paddingInLoop)
        paddingInLoop += 5
        for (const value in this.negotiationPdfData.payload[key]) {
          if (this.negotiationPdfData.payload[key][value]) {
            doc.text(value + ":" + this.negotiationPdfData.payload[key][value], 15, paddingInLoop)
          }
          paddingInLoop += 5
        }
      }
      doc.save(pdfName + ".pdf")
    }
  }
}
</script>
