const puppeteer = require("puppeteer");

const generarPdfDesdeHtml = async (html) => {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    await page.close();

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
};

module.exports = {
  generarPdfDesdeHtml,
};