const styledPlotLayout = (theme: "light" | "dark", imsource?) => {
  const plotFeatureColor = theme === "light" ? "#282c34" : "#fff";
  const plotBackgroundColor = theme === "light" ? "#fff" : "#282c34";
  let imUrl = '';
  if (imsource && imsource.length > 0) {
    const pixelSize = 20;
    const c = document.createElement("canvas");
    c.height = imsource[0].length * pixelSize;
    c.width = imsource.length * pixelSize;
    document.body.appendChild(c);
    const ctx = c.getContext("2d");
    ctx?.clearRect(0, 0, c.width, c.height);
    
    for (let i = 0; i < imsource.length; i++) {
        for (let j = 0; j < imsource[0].length; j++) {
            if(ctx) {
              ctx.fillStyle = "rgb("+imsource[i][j][0]+","+imsource[i][j][1]+","+imsource[i][j][2]+")";
              ctx?.fillRect(i*pixelSize, j*pixelSize, pixelSize, pixelSize);
            }
        }
    }
    
    console.log(c.toDataURL("image/png"));
    const png = document.createElement("img");
    png.src = c.toDataURL("image/png");
    c.remove();
    document.body.appendChild(png);
    imUrl = c.toDataURL("image/png");
    
  }

  const dfltLayout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: plotBackgroundColor,
    autosize: true,
    font: { color: plotFeatureColor },
    margin: { t: 40, r: 40, b: 40, l: 40 },
    images: [{source: imUrl}]
    // xaxis: {zeroline: false, color: plotFeatureColor},
    // yaxis: {zeroline: false, color: plotFeatureColor}
  };
  console.log(dfltLayout)
  return dfltLayout;
};

export default styledPlotLayout;
