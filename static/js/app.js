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

            // Generate variable for frequency

            let frequency = selectedMetadata.wfreq;

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
            width: 1200,
            autosize : true
        };

        let bubblechartData = [bubbleTrace];

        // Bubble chart display

        Plotly.newPlot("bubble", bubblechartData, bubbleLayout);

        
        // Gauge chart setup


        // Pointer setup


        function gaugePointer(value){
	
            var degrees = 180 - (value*20),
             radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        
        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
             pathX = String(x),
             space = ' ',
             pathY = String(y),
             pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
            
            return path;
        
        }




        // Gaauge chart variables

        let traceGauge = [{ type: 'scatter',
            x: [0], y:[0],
            marker: {size: 18, color:'850000'},
            showlegend: false,
            name: 'Frequency',
            text: frequency,
            hoverinfo: 'text+name'},
            {values: [45 ,5 ,5 ,5 ,5 ,5 ,5 ,5 ,5 , 5],
            rotation: 90,
            text: [
                "",
                "8-9",
                "7-8",
                "6-7",
                "5-6",
                "4-5",
                "3-4",
                "2-3",
                "1-2",
                "0-1"
              ],
            textinfo: 'text',
            textposition:'inside',	  
            marker: {colors:[
                'rgba(255, 255, 255, 0)',
                'rgba(133, 180, 138, 1)', 
                'rgba(138, 187, 143, 1)', 
                'rgba(140, 191, 136, 1)', 
                'rgba(183, 204, 146, 1)', 
                'rgba(213, 228, 157, 1)', 
                'rgba(229, 231, 179, 1)', 
                'rgba(233, 230, 202, 1)', 
                'rgba(244, 241, 229, 1)', 
                'rgba(248, 243, 236, 1)'
            ]},
            hoverinfo: 'label',
            hole: .3,
            type: 'pie',
            showlegend: false
            
        }];

        var gaugeLayout = {
            title: {
                text: "Belly Button washing Frequwncy",
                font: {
                    size: 20
                },
                x: 0.5,
                xref: 'paper' 
            },
            annotations: [
                {
                    text: "Scrubs per Week",
                    showarrow: false,
                    font: {
                        size: 16
                    },
                    x: 0.5, 
                    y: 1.15, 
                    xref: 'paper', 
                    yref: 'paper' 
                }
            ],
            
            shapes:[{
                type: 'path',
                path: gaugePointer(frequency),
                fillcolor: '850000',
                line: {
                  color: '850000'
                }
              }],

            autosize:true,

            xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
        };

        // Gauge chart display

        Plotly.newPlot("gauge", traceGauge, gaugeLayout);

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