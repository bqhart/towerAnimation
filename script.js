document.getElementById('loadCSVButton').addEventListener('click', function () {
    // Get the file input elements
    const liquidLevelFile = document.getElementById('liquidLevel').files[0];
    const trayTempFile = document.getElementById('trayTemp').files[0];
    const vapourFlowFile = document.getElementById('vapourFlow').files[0];
  
    // Load each CSV file if selected
    if (liquidLevelFile) {
      loadCSVFile(liquidLevelFile, 'liquidLevelData');
    } else {
      console.warn("Please select a Liquid Level CSV file.");
    }
  
    if (trayTempFile) {
      loadCSVFile(trayTempFile, 'trayTempData');
    } else {
      console.warn("Please select a Tray Temperature CSV file.");
    }
  
    if (vapourFlowFile) {
      loadCSVFile(vapourFlowFile, 'vapourFlowData');
    } else {
      console.warn("Please select a Vapour Flow CSV file.");
    }
  });

  function getLiquidLevelData() {
    return window.liquidLevelData || [];
  }
  
  function getTrayTempData() {
    return window.trayTempData || [];
  }
  
  function getVapourFlowData() {
    return window.vapourFlowData || [];
  }
  
  function getTimeSeries() {
    return window.liquidLevelTimeSeries || [];
  }
  
  function loadCSVFile(file, variableName) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const csvData = event.target.result;
  
      // Parse the CSV data manually, assuming two header rows
      const parsedData = parseCSV(csvData);
  
      // Store the data in a variable for future use
      window[variableName] = parsedData.data;  // Only store the tray data, excluding time
  
      // Collect time series and tray count
      const timeSeries = parsedData.timeSeries;
      const trayCount = parsedData.trayCount;
      const headerUnits = parsedData.headerUnits
  
      // Store these in variables for future use
      window[`${variableName}TimeSeries`] = timeSeries;
      window[`${variableName}TrayCount`] = trayCount;
      window[`${variableName}HeaderUnits`] = headerUnits;
    };
    reader.readAsText(file);
  }


  function parseCSV(data) {
    const rows = data.split('\n').filter(Boolean); // Split by new lines and remove empty rows
    const headerLabels = rows[0].split(','); // Extract the first row (labels)
    const headerUnits = rows[1].split(','); // Extract the second row (units)
    const dataRows = rows.slice(2); // Data starts from the third row
  
    // Collect the time series (first column) separately
    const timeSeries = dataRows.map(row => row.split(',')[0].trim());
  
    // Parse the data rows into a 2D array of numbers
    const parsedData = dataRows.map(row => {
        const values = row.split(',').slice(1).map(value => parseFloat(value.trim())); // Convert to numbers
        return values; // Return the row as an array of numbers
    });

    // The number of trays corresponds to the number of columns excluding the time series
    const trayCount = headerLabels.length - 1; // Excluding time
  
    return {
      data: parsedData, // Parsed tray data
      timeSeries: timeSeries, // Time series data
      trayCount: trayCount, // Number of trays
      headerUnits: headerUnits
    };
  }
  
