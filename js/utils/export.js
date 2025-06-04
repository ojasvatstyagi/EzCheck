function exportToPdf(data) {
  const doc = new jsPDF();
  const table = data.map((row) => Object.values(row));
  doc.autoTable({
    head: [Object.keys(data[0])],
    body: table,
  });
  const pdf = doc.output("blob");
  const url = window.URL.createObjectURL(pdf);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.pdf";
  a.click();
  window.URL.revokeObjectURL(url);
}
