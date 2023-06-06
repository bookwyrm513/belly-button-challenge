const sampURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// create a bar graph
function bargraph(patient){
    let yData = [];

    // get initial values for this particular patient
    let sample = patient.sample_values;
    let ids = patient.otu_ids;
    let otu = patient.otu_labels;

    // get first 10 values and reverse for Plotly formatting
    let xData = sample.slice(0,10).reverse();
    let nums = ids.slice(0,10).reverse();
    let labels = otu.slice(0,10).reverse();

    // create labels for y axis
    for(let i=0; i < nums.length; i++) {
        yData.push(`OTU ${nums[i]}`)
    }

    // create trace within an array
    var dataBar = [{
        type: 'bar',
        x: xData,
        y: yData,
        text: labels,
        orientation: 'h'
    }];
    
    // plot bar graph
    Plotly.restyle('bar', dataBar);

};

function initialize_bar_graph(patient) {
    // creates initial graph
    let yData = [];

    // get initial values for this particular patient
    let sample = patient.sample_values;
    let ids = patient.otu_ids;
    let otu = patient.otu_labels;

    // get first 10 values and reverse for Plotly formatting
    let xData = sample.slice(0,10).reverse();
    let nums = ids.slice(0,10).reverse();
    let labels = otu.slice(0,10).reverse();

    // create labels for y axis
    for(let i=0; i < nums.length; i++) {
        yData.push(`OTU ${nums[i]}`)
    }

    // create trace within an array
    var dataBar = [{
        type: 'bar',
        x: xData,
        y: yData,
        text: labels,
        orientation: 'h'
    }];
    
    // plot bar graph
        Plotly.newPlot('bar', dataBar);

};

function bubble(patient) {
    // set dimensions and margins of graph, code from d3 library
    var margin = {top: 10, right: 20, bottom: 30, left: 50},
        width = 500 - margin.left - margin.right,
        height = 420 - margin.top - margin.bottom;

    // appending svg object to page
    var svg = d3.select("#bubble")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

    // x axis
    var x = d3.scaleLinear()
        .domain([0, 3500])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 250])
        .range([ height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add a scale for bubble size
    var z = d3.scaleLinear()
        .domain([200000, 1310000000])
        .range([ 1, 40]);

    // Add a scale for bubble color
    var myColor = d3.scaleOrdinal()
    .domain([patient.otu_ids])
    .range(d3.schemeSet2);

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(patient)
        .enter()
        .append("circle")
            .attr("cx", function (d) { return x(d.otu_ids); } )
            .attr("cy", function (d) { return y(d.sample_values); } )
            .attr("r", function (d) { return z(d.sample_values); } )
            .style("fill", function (d) { return myColor(d.otu_ids); })
            .style("opacity", "0.7")
            .attr("stroke", "black")
};

function demo_info(patient) {
    let id =  `ID: ${patient.id}<p>`;
    let ethnicity = `Ethnicity: ${patient.ethnicity}<p>`;
    let gender = `Gender: ${patient.gender}<p>`;
    let age = `Age: ${patient.age}<p>`;
    let location = `Location: ${patient.location}<p>`;
    let bbtype = `bbtype: ${patient.bbtype}<p>`
    let wfreq = `wfreq: ${patient.wfreq}`

    document.getElementById("sample-metadata").innerHTML = [id, ethnicity, gender, age, location, bbtype, wfreq]
};

function create_dropdown(info) {
    // sets dropdown values help from: https://stackoverflow.com/questions/9895082/javascript-populate-drop-down-list-with-array
    var select = document.getElementById("selDataset");
    for (let i=0; i < info.length; i++) {
        var option = info[i].id
        var container = document.createElement("option");
        container.textContent = option;
        container.value = option;
        select.appendChild(container);
    }
}


function init(data){

    // creates bubble graph and loads demographic info
    initialize_bar_graph(data.samples[0]);
    bubble(data.samples[0]);
    demo_info(data.metadata[0]);
    create_dropdown(data.metadata);
};

d3.selectAll("#selDataset").on("change", optionChanged);

function optionChanged(value) {
    let patient_num = data.indexOf(patient);
    console.log(value);
    
};

d3.json(sampURL).then(function(data) {
    console.log(data);
    init(data);
});

