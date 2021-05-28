function init() {
    var chartContainer = document.getElementById("chart");
    var margin = { top: 15, right: 30, bottom: 40, left: 110 },
        width = chartContainer.offsetWidth - margin.left - margin.right + 10,
        height = chartContainer.offsetHeight - margin.top - margin.bottom - 10;

    var SVG = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform","translate(" + margin.left + "," + margin.top + ")");

    d3.csv("./dv_final_dataset.csv").then(function (data) {

        var x = d3.scaleLinear()
            .domain([0,d3.max(data, d => d.population)])
            .range([0, width]);

        var xAxis = SVG.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        var y = d3.scaleLinear()
            .domain([0,d3.max(data, d => d.gdp)])
            .range([height, 0]);

        var yAxis = SVG.append("g")
            .call(d3.axisLeft(y));   
     
        var clip = SVG.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

        var scatter = SVG.append('g')
            .attr("clip-path", "url(#clip)")

        var color = d3.scaleOrdinal()
            .domain(["HIC", "UMC", "LMC", "LIC"])
            .range(d3.schemeSet2);

        var legendContainer = document.getElementById("legend");
        function addLegend(Scale, container) {
            for (var i = 0; i < Scale.domain().length; i++) {
                container.innerHTML += "<span>";
                var box = document.createElement("DIV");
                box.style.backgroundColor = Scale.range()[i];
                box.className = "colorBox";
                container.appendChild(box);
                
                container.innerHTML += Scale.domain()[i] + "</span>" + "<br>";
            }
        }
        addLegend(color, legendContainer);
        scatter
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return x(d.population); })
            .attr("cy", function (d) { return y(d.gdp); })
            .attr("r", function (d) { return d.total_solid_waste_generated_tons_year/200000; })
            .attr('fill', function (d) { return (color(d.income_id)) })
            .style("opacity", 0.5)
            
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
        
        scatter
            .selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .text(function (d) {return d.country_name + " | " + numberWithCommas(d.total_solid_waste_generated_tons_year) + " tons";})
            .attr("dx", function (d) { return x(d.population); })
            .attr("dy", function (d) { return y(d.gdp); })
            .attr("text-anchor", "middle")
            .style("font-size", function(d) {return d.total_solid_waste_generated_tons_year/3000000 < 10? 10:d.total_solid_waste_generated_tons_year/2000000;  + "px"; })
            .attr("transform","translate(" + 0 + " ," + 5 + ")")
            
        
        SVG
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("GDP");

        SVG
            .append("text")             
            .attr("transform","translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
            .style("text-anchor", "middle")
            .text("Population");

        var zoom = d3.zoom()
            .extent([[0, 0], [200, 200]])
            .on("zoom", function(event, d){
                var newX = event.transform.rescaleX(x);
                var newY = event.transform.rescaleY(y);
    
                xAxis.call(d3.axisBottom(newX))
                yAxis.call(d3.axisLeft(newY))
    
                scatter
                    .selectAll("circle")
                    .attr('cx', function (d) { return newX(d.population) })
                    .attr('cy', function (d) { return newY(d.gdp) });
                    
                
                scatter
                    .selectAll("text")
                    .attr('dx', function (d) { return newX(d.population) })
                    .attr('dy', function (d) { return newY(d.gdp) })
            })

        SVG.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);

        d3.select("#mswbtn").on("click", function () {
            scatter
                .selectAll("circle")
                .attr("cx", function (d) { return x(d.population); })
                .attr("cy", function (d) { return y(d.gdp); })
                .attr("r", function (d) { return d.total_solid_waste_generated_tons_year/200000; })
                .attr('fill', function (d) { return (color(d.income_id)) })
                .style("opacity", 0.5)

            scatter
                .selectAll("text")
                .attr('dx', function (d) { return x(d.population) })
                .attr('dy', function (d) { return y(d.gdp) })
                .text(function (d) {return d.country_name + " | " + numberWithCommas(d.total_solid_waste_generated_tons_year) + " tons";})
        });

        d3.select("#ewbtn").on("click", function () {
            scatter
                .selectAll("circle")
                .attr("cx", function (d) { return x(d.population); })
                .attr("cy", function (d) { return y(d.gdp); })
                .attr("r", function (d) { return d.e_waste_tons_year/5000; })
                .attr('fill', function (d) { return (color(d.income_id)) })
                .style("opacity", 0.5)

            scatter
                .selectAll("text")
                .attr('dx', function (d) { return x(d.population) })
                .attr('dy', function (d) { return y(d.gdp) })
                .text(function (d) {
                    var val = d.e_waste_tons_year;
                    if(val) 
                        return  d.country_name + " | " + numberWithCommas(d.e_waste_tons_year) + " tons";
                    else
                        return  d.country_name;
                })
        });
        

    })

}

window.onload = init;