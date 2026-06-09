const styles = `
<style>
  * {
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
  }

  body {
    margin: 0;
    color: #111;
    background: white;
     line-height: 1.3;
  }

  .page {
    width: 210mm;
    height: 297mm;
    padding: 7mm;
    page-break-after: always;
    background: white;
    overflow: hidden;
  }

  .page:last-child {
    page-break-after: auto;
  }

  .header {
    border: 1px solid #111;
    display: grid;
    grid-template-columns: 34mm 1fr 30mm;
    height: 23mm;
    margin-bottom: 3mm;
  }

  .header-logo,
  .header-format {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 2mm;
    font-size: 8px;
  }

  .header-logo {
    border-right: 1px solid #111;
  }

  .header-format {
    border-left: 1px solid #111;
    font-weight: bold;
  }

  .header-logo img {
    max-width: 28mm;
    max-height: 19mm;
    object-fit: contain;
  }

  .header-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    line-height: 1.25;
    text-align: center;
  }

  .ese {
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .city {
    font-size: 9px;
  }

  .title {
    margin-top: 2mm;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .section {
    border: 1px solid #111;
    margin-bottom: 5.5mm;
  }

  .section-title {
    background: #ecf1f8;
    border-bottom: 1px solid #111;
    padding: 2.5mm 2mm;
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.5px;

  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .grid-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .main-grid {
    display: grid;
    grid-template-columns: 1fr 43mm;
    gap: 2mm;
    padding: 2mm;
    <!-- background: green; -->
  }

  .row {
    display: grid;
    grid-template-columns: 31mm 1fr;
    min-height: 6.2mm;
    border-bottom: 1px solid #999;
    <!-- background: red; -->

  }

  .grid-2 .row,
  .grid-3 .row {
    border-right: 1px solid #999;
  }

  .label {
    background: #f3f4f6;
    border-right: 1px solid #999;
    padding: 1.4mm;
    font-size: 8.6px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .value {
    padding: 1.4mm;
    font-size: 8.6px;
    line-height: 1.25;
    white-space: pre-line;
  }

  .valuetext {
    padding: 1.4mm;
    font-size: 10.6px;
    line-height: 1.25;
    white-space: pre-line;
  }

  .description {
  min-height: 15mm;

  border: 1px solid #999; /* borde del cuadro */
}

  .image-box {
    border: 1px solid #999;
    height: 64.5mm;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2mm;
   /* background:blue; */
  }

  .image-box img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.5px;
    /* background: green; */
  }

  th,
  td {
    border: 1px solid #999;
    padding: 1.5mm;
    vertical-align: top;
    line-height: 1.25;
  }

  th {
    background: #e8ebe5;
    font-size: 8px;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
  }

  .mt1 {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Hace que las columnas respeten el ancho */
}

.mt1 th,
.mt1 td {
  border: 1px solid #999;
  padding: 6px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal; /* Permite salto de línea */
  text-align: center;
  vertical-align: middle;
}

.observaciones-box{
  border: 1px solid #444;
  border-top: none;
}

.linea{
  height: 35px;
  border-bottom: 1px solid #444;
  display: flex;
  align-items: center;
  padding-left: 8px;
}

.linea:last-child{
  border-bottom: none;
}

.cuadro{
  width: 50px;
  height: 20px;
  border: 1px solid #444;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 9px;
  color: rgba(0,0,0,0.3); /* texto tenue */
}

 
  .activity-table td {
    height: 8mm;
  }

  .empty-box {
    min-height: 17mm;
    border: 1px solid #111;
  }

  .textarea-box {
    min-height: 22mm;
    border: 1px solid #111;
  }

  .note1 {
    font-size: 7.8px;
    color: #333;
    margin-top: 20.5mm;
    line-height: 1.25;
    text-align: center;
  }

  .note {
    font-size: 7.8px;
    color: #333;
    margin-top: 2.5mm;
    line-height: 1.25;
    text-align: center;
  }

  .mt {
    margin-top: 3mm;
  }
    
  .mt1 {
    margin-top: 3mm;
    /* background: blue; */
  }


  .small {
    font-size: 8px;
  }

  
</style>
`;

module.exports = styles;