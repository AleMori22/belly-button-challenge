d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then(function(data) {
  
    // check the correct reading of the data

    console.log(data);
  
    //populate the drop down menue with names

    function populateDD(names) {
        let dropdown = d3.select("#selDataset");
        names.forEach(name => {
            let option = dropdown.append("option");
            option.text(name);
            option.property("value",name);
        });
    }
  
    // Updating charts

    function updatePlot(selectedID) {
      
        let selectedIndex = data.names.indexOf(selectedID);
  
        if (selectedIndex !== -1) {
            
            // Charts values
            
            let selectedSamples = data.samples[selectedIndex];
            let top10OTUs = selectedSamples.sample_values.slice(0, 10).reverse();
            let otuIDs = selectedSamples.otu_ids.slice(0, 10).reverse();
            let otuLabels = selectedSamples.otu_labels.slice(0, 10).reverse();

            // Generate variable for the metadata
        
            let selectedMetadata = data.metadata[selectedIndex];

            // 

            let frequency = selectedMetadata.wfreq ;
            console.log(frequency)

        // Bar Chart setup

        let barTrace = {
          x: top10OTUs,
          y: otuIDs.map(id => `OTU ${id}`),
          text: otuLabels,
          type: "bar",
          orientation: "h"
        };

        let barLayout = {
            height: 500,
            width: 400
        };
  
        // Bar Chart display

        let barchartData = [barTrace];
        Plotly.newPlot("bar", barchartData, barLayout); 

        // Bubble chart setup

        let bubbleTrace = { 
            x : selectedSamples.otu_ids,
            y : selectedSamples.sample_values,
            mode : "markers",
            marker : { 
                size : selectedSamples.sample_values,
                color : selectedSamples.otu_ids,
            },
            text : selectedSamples.otu_labels
        };

        let bubbleLayout = {
            xaxis : { title : "OUT ID"},
            showledgend : false,
            height: 600,
            width: 1200
        };

        let bubblechartData = [bubbleTrace];

        // Bubble chart display

        Plotly.newPlot("bubble", bubblechartData, bubbleLayout);

        // Selecting the Demographic Info Table and 
        // Clearing the data from the previous call

        let metaData = d3.select("#sample-metadata");
        metaData.html("");

        // Populate the Demographic Info Table
        
        Object.entries(selectedMetadata).forEach(([key,value]) => {
            metaData.append("p").text(`${key}: ${value}`);
        });

      // Error message

      } else {
        console.log(`Data for ID ${selectedID} not found`);
      }
    }

    populateDD(data.names);


    // Add an event listener to the dropdown to update the plot when the selection changes
  
    d3.select("#selDataset").on("change", function() {
        
        let selectedID = d3.select("#selDataset").property("value");
        
        updatePlot(selectedID);
    });

  // Initial plot based on the default selected ID

    let initialID = data.names[0]; 
    
    updatePlot(initialID);
})
.catch(function(error) {
  
    // Handle any errors that occur during the fetch

  console.log(error);
});