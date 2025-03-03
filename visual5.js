var menSlices;
var labelsMen;
var colorMen;
//var colorArrayMale = ["#66c2ff", "#4da6ff", "#3389ff", "#1a66ff", "#0052cc"];
var colorArrayMale = ["#0052cc", "#1a66ff", "#3389ff", "#4da6ff", "#66c2ff"];



// Load the data from the CSV file
d3.csv("Amazon_Customer_Behavior_Survey.csv").then(function (data) {
    // Filter the data by gender and purchase frequency for men
    var filteredDataMen = data.filter(function (d) {
        return d.Gender === "Male" && d.Purchase_Frequency;
    });

    // Prepare the data by counting purchase frequencies
    var purchaseFrequencyCountsMen = d3.rollup(filteredDataMen, v => v.length, d => d.Purchase_Frequency);

    // Convert the data to an array of objects
    var pieDataMen = Array.from(purchaseFrequencyCountsMen, ([key, value]) => ({ category: key, count: value }));

    // Set up the SVG dimensions for the men's pie chart
    var widthMen = 500;
    var heightMen = 500;
    var radiusMen = Math.min(widthMen, heightMen) / 2;

    var categoryOrder = ["Multiple times a week", "Once a week", "Few times a month", "Once a month", "Less than once a month"];

    // Create a color scale
    colorMen = d3.scaleOrdinal()
        .domain(categoryOrder)
        //.range(["#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45"]); // good green
        //.range(["#66c2ff", "#4da6ff", "#3389ff", "#1a66ff", "#0052cc"]);
        .range(colorArrayMale);


    // Create a pie layout
    var pie = d3.pie()
        .value(function (d) { return d.count; })
        .sort(function (a, b) {
            return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
        });

    // Create an SVG element
    var svgMen = d3.select("#pie-chart-men")
        .attr("width", widthMen)
        .attr("height", heightMen)
        .append("g")
        .attr("transform", "translate(" + widthMen / 2 + "," + heightMen / 2 + ")");

    // Create the pie chart arcs
    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radiusMen);


    /*// Create a separate selection for labels for men
    labelsMen = svgMen.selectAll("text")
        .data(pie(pieDataMen))
        .enter()
        .append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.category; })
        //.style("display", "none");  // Set initial display to none*/

    // Create the pie chart slices
    menSlices = svgMen.selectAll("path")
        .data(pie(pieDataMen))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) { return colorMen(d.data.category); })
        .on("mouseover", function (event, d) {

            // Emphasize the selected slice
            d3.select(this)
                .transition()
                .duration(100)
                .attr("d", d3.arc().innerRadius(0).outerRadius(radiusMen + 10))
                .attr("stroke", "black")  // Add a black border
                .attr("stroke-width", 2)
            //.style("display", "block");

            var correspondingSliceWomen = womenSlices.filter(function (stuff) {
                return stuff.data.category === d.data.category;
            });

            correspondingSliceWomen.transition()
                .duration(100)
                .attr("stroke", "black")  // Add a black border
                .attr("stroke-width", 2);

            // Toggle visibility of the label associated with the hovered slice
            //labelsMen.nodes()[i].style.display = "block";
        })
        .on("mouseout", function (event, d) {
            // Reset the emphasized slice on mouseout
            d3.select(this)
                .transition()
                .duration(100)
                .attr("d", arc)
                .attr("fill", function (d) { return colorMen(d.data.category); })
                .attr("stroke", "none");

            var correspondingSliceWomen = womenSlices.filter(function (stuff) {
                return stuff.data.category === d.data.category;
            });

            correspondingSliceWomen.transition()
                .duration(100)
                .attr("d", arc)
                .attr("fill", function (d) { return colorWomen(d.data.category); })
                .attr("stroke", "none");

            // Toggle visibility of the label associated with the hovered slice
            //labelsMen.nodes()[i].style.display = "none";
        });

    // Create a separate selection for labels for men
    labelsMen = svgMen.selectAll("text")
        .data(pie(pieDataMen))
        .enter()
        .append("text")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function (d) { return d.data.category; })
    //.style("display", "none");  // Set initial display to none
});

