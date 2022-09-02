const styledPlotLayout = theme => {
    let plotFeatureColor = (theme === 'light' ? '#282c34' : '#fff');
    let plotBackgroundColor  = (theme === 'light' ? '#fff' : '#282c34');
  
    let dfltLayout = {
      paper_bgcolor: 'rgba(0,0,0,0)', 
      plot_bgcolor: plotBackgroundColor,
      autosize: true, 
      font: {color: plotFeatureColor},
      margin: {t: 40, r: 40, b: 40, l: 40},
      // xaxis: {zeroline: false, color: plotFeatureColor},
      // yaxis: {zeroline: false, color: plotFeatureColor}
    };

    return dfltLayout;
}

export default styledPlotLayout;