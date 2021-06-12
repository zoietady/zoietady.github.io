function init() {
    // Get chart container
    var chartContainer = document.getElementById("chart");
    var pieContainer = document.getElementById("tooltip");
    // Define Margins and Dimensions
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        w = chartContainer.offsetWidth - 7,
        h = chartContainer.offsetHeight - 0;
    var padding = 40;

    // Create Projection
    var projection = d3.geoMercator()
        .center([10, 50])
        .translate([w / 2, h / 2])
        .scale(120);

    var path = d3.geoPath()
        .projection(projection);

    // Create SVG 
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("fill", "grey")
        .style("display", "block")
        .style("margin", "auto");

    // Create G for pan and zoom
    var g = svg.append("g");

    // Define Color Scaling Functions
    // Per Cap Scaling
    var wasteCapColor = d3.scaleQuantize().range(['#fcd2b0ff','#fbbe88ff','#fab375ff','#f8a862ff','#f99339ff','#f88c2dff','#f68420ff','#f27507ff','#dc6b07ff','#c66006ff']);
    
    var gdpCapColor = d3.scaleQuantize().range(['#b7e4c7ff', '#95d5b2ff', '#74c69dff', '#63bf93ff', '#5bbb8eff', '#52b788ff', '#40916cff', '#2d6a4fff', '#1b4332ff', '#081c15ff']);

    

    // Ratio Scaling
    var mswGdpColor = d3.scaleQuantize().range(['#dac3e8ff','#d2b7e5ff','#c19ee0ff','#b185dbff','#a979d8ff','#a06cd5ff','#9163cbff','#815ac0ff','#7251b5ff','#6247aaff']);

    // Individual Scaling
    var popColor = d3.scaleQuantize().range(['#90E0EF','#6CD5EA','#48CAE4','#00B4D8','#00A5D0','#0096C7','#0077B6','#015BA0','#023E8A','#03045E']);
    
    var gdpColor = d3.scaleQuantize().range(['#b7e4c7ff', '#95d5b2ff', '#74c69dff', '#63bf93ff', '#5bbb8eff', '#52b788ff', '#40916cff', '#2d6a4fff', '#1b4332ff', '#081c15ff']);

    var wasteColor = d3.scaleQuantize().range(['#fcd2b0ff','#fbbe88ff','#fab375ff','#f8a862ff','#f99339ff','#f88c2dff','#f68420ff','#f27507ff','#dc6b07ff','#c66006ff']);

    var eWasteColor = d3.scaleQuantize().range(['#fcd2b0ff','#fbbe88ff','#fab375ff','#f8a862ff','#f99339ff','#f88c2dff','#f68420ff','#f27507ff','#dc6b07ff','#c66006ff']);

    var recColor = d3.scaleQuantize().range(['#fcd2b0ff','#fbbe88ff','#fab375ff','#f8a862ff','#f99339ff','#f88c2dff','#f68420ff','#f27507ff','#dc6b07ff','#c66006ff']);


    var ewCapColor = d3.scaleQuantize().range(['#fcd2b0ff','#fbbe88ff','#fab375ff','#f8a862ff','#f99339ff','#f88c2dff','#f68420ff','#f27507ff','#dc6b07ff','#c66006ff']);

    var ewGdpColor = d3.scaleQuantize().range(['#dac3e8ff','#d2b7e5ff','#c19ee0ff','#b185dbff','#a979d8ff','#a06cd5ff','#9163cbff','#815ac0ff','#7251b5ff','#6247aaff']);

    // Import Dataset
    d3.csv("./dv_dataset_v2.csv").then(function (data) {
        // Import GeoJson
        d3.json("./countries.geojson").then(function (geojson) {

            // Append CSV data to geojson
            // Declare variables for temporary storage
            var dataCountry;
            var dataWaste_Capita;
            var dataGDP_Capita;
            var dataPopulation;
            var dataGDP;
            var dataWaste;
            var dataWasteBreakdown = {};

            var dataICC;

            // Iterate CSV
            for (var i = 0; i < data.length; i++) {
                // Parse and Assign collected
                dataCountry = data[i].country_name;
                dataICC = data[i].income_id;
                dataWaste_Capita = parseFloat(data[i].msw_per_capita);
                dataGDP_Capita = parseFloat(data[i].gdp_per_capita);
                dataPopulation = parseFloat(data[i].population);
                dataGDP = parseFloat(data[i].gdp);
                dataWaste = parseFloat(data[i].total_solid_waste_generated_tons_year);
                dataEWaste = parseFloat(data[i].e_waste_tons_year);
                dataRec = parseFloat(data[i].waste_treatment_recycling_percent);
                dataWasteBreakdown["organic"] = parseFloat(data[i].food_organic_waste_percent);
                dataWasteBreakdown["glass"] = parseFloat(data[i].glass_percent);
                dataWasteBreakdown["metal"] = parseFloat(data[i].metal_percent);
                dataWasteBreakdown["plastic"] = parseFloat(data[i].plastic_percent);
                dataWasteBreakdown["other"] = parseFloat(data[i].other_percent);

                // If it is the corresponding country, create and assign variable under properties
                for (var j = 0; j < geojson.features.length; j++) {
                    var jsonState = geojson.features[j].properties.ADMIN;
                    if (dataCountry == jsonState) {
                        geojson.features[j].properties.name = jsonState;
                        geojson.features[j].properties.income_class = dataICC;
                        geojson.features[j].properties.msw_per_capita = dataWaste_Capita;
                        geojson.features[j].properties.gdp_per_capita = dataGDP_Capita;
                        geojson.features[j].properties.population = dataPopulation;
                        geojson.features[j].properties.gdp = dataGDP;
                        geojson.features[j].properties.msw = dataWaste;
                        geojson.features[j].properties.ew = dataEWaste;
                        geojson.features[j].properties.rec = dataRec;
                        
                        geojson.features[j].properties.breakdown = {};
                        geojson.features[j].properties.breakdown.organic = dataWasteBreakdown["organic"];
                        geojson.features[j].properties.breakdown.glass = dataWasteBreakdown["glass"];
                        geojson.features[j].properties.breakdown.metal = dataWasteBreakdown["metal"];
                        geojson.features[j].properties.breakdown.plastic = dataWasteBreakdown["plastic"];
                        geojson.features[j].properties.breakdown.plastic = dataWasteBreakdown["plastic"];
                        break;
                    }
                }
            }

            // Declare Domain for Scaling Functions
            // Individual Scaling
            popColor.domain([
                d3.min(geojson.features, function (d) { return d.properties.population; }),
                d3.max(geojson.features, function (d) { return d.properties.population; })
            ]);

            gdpColor.domain([
                d3.min(geojson.features, function (d) { return d.properties.gdp; }),
                d3.max(geojson.features, function (d) { return d.properties.gdp; })
            ]);

            wasteColor.domain([
                d3.min(geojson.features, function (d) { return d.properties.msw; }),
                d3.max(geojson.features, function (d) { return d.properties.msw; })
            ]);

            eWasteColor.domain([
                d3.min(geojson.features, function (d) { return d.properties.ew; }),
                d3.max(geojson.features, function (d) { return d.properties.ew; })
            ]);

            recColor.domain([
                d3.min(geojson.features, function (d) { return d.properties.rec; }),
                d3.max(geojson.features, function (d) { return d.properties.rec; })
            ]);


            // PerCap Scaling
            wasteCapColor.domain([
                d3.min(geojson.features, function (d) { return d.properties.msw_per_capita; }),
                d3.max(geojson.features, function (d) { return d.properties.msw_per_capita; })
            ]);

            gdpCapColor.domain([
                d3.min(geojson.features, function (d) { return d.properties.gdp_per_capita; }),
                d3.max(geojson.features, function (d) { return d.properties.gdp_per_capita; })
            ]);

            ewCapColor.domain([
                d3.min(geojson.features, function (d) { return (d.properties.ew/d.properties.population); }),
                d3.max(geojson.features, function (d) {  return (d.properties.ew/d.properties.population); })
            ]);

            // Ratios
            mswGdpColor.domain([
                d3.min(geojson.features, function (d) { return d.properties.msw / d.properties.gdp; }),
                d3.max(geojson.features, function (d) { return d.properties.msw / d.properties.gdp; })
            ]);

            ewGdpColor.domain([
                d3.min(geojson.features, function (d) { return (d.properties.ew/d.properties.gdp); }),
                d3.max(geojson.features, function (d) {  return (d.properties.ew/d.properties.gdp); })
            ]);

            // for (var i = 0; i < data.length; i++){
            //     if(geojson.features[i].properties.msw_per_capita == null){
            //         console.log(geojson.features[i].properties.ADMIN)
            //     }
            // }

            var width = 300
            height = 300
            margin = 25

            // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
            var radius = Math.min(width, height) / 2 - margin

            // append the svg object to the div called 'my_dataviz'
            var svg2 = d3.select("#pieChart")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
            
            svg2.append("text").text("").attr("text-anchor", "middle"); 


            // set the color scale
            var color = d3.scaleOrdinal()
                .domain(["organic", "glass", "metal", "plastic", "other"])
                .range(['#fbb4ae','#b3cde3','#ccebc5','#decbe4','#fed9a6']);

            function entries(obj) {
                var data = [];
                for (var key in obj) {
                    data.push({
                        key: key,
                        value: obj[key]
                    })
                };
                return data;
            }

            var pieLegendContainer = document.getElementById("pielegend");
            for (var i = 0; i < color.domain().length; i++) {
                pieLegendContainer.innerHTML += "<span>";
                var box = document.createElement("DIV");
                box.style.backgroundColor = color.range()[i];
                box.className = "colorBox";
                pieLegendContainer.appendChild(box);
                
                pieLegendContainer.innerHTML += color.domain()[i] + "</span>";
            }


            // A function that create / update the plot for a given variable:
            function update(data, country) {

                // Compute the position of each group on the pie:
                var pie = d3.pie()
                    .value(function (d) { return d.value; })
                    .sort(null) // This make sure that group order remains the same in the pie chart
                var data_ready = pie(entries(data))
                // map to data
                var u = svg2.selectAll("path")
                    .data(data_ready)

                var text = svg2.select("text")

                // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
                u
                    .enter()
                    .append('path')
                    .merge(u)
                    .attr('d', d3.arc()
                        .innerRadius(radius/2)
                        .outerRadius(radius)
                    )
                    .attr('fill', function (d) { return (color(d.data.key)) })
                    .attr("stroke", "white")
                    .style("stroke-width", "2px")
                    .style("opacity", 1);

                
                text.text(country).style("font-size", function() { return ((radius*1.4)/country.length)  + "px"; }).attr("font-weight",function(d,i) {return 400;}).attr("font-family", "Roboto").attr("transform", "translate(" + 0 +","+ 10 + ")"  )

                u.exit()
                    .remove();

            }


            var prevStroke;
            var prevStrokeWidth;
            function numberWithCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

            function precise(x, y) {
                return Number.parseFloat(x).toPrecision(y);
            }

            // Create Path
            g.selectAll("path")
                .data(geojson.features)
                .enter()
                .append("path")
                .attr("d", path)
                //.style("stroke", "grey")
                //.style("stroke-width", "1px")
                .style("fill", function (d) {
                    var value = d.properties.msw_per_capita;
                    if (value) {
                        return wasteCapColor(value);
                    } else {
                        return null;
                    }
                })
                .on('mouseover', function (event, d) {
                    update(d.properties.breakdown, d.properties.ADMIN);
                    console.log(d.properties.breakdown)
                    prevStroke = d3.select(this).style("stroke");
                    prevStrokeWidth = d3.select(this).style("stroke-width");

                    d3.select(this).style("stroke", "grey")
                        .style("stroke-width", "3px")
                    var country_name = d.properties.ADMIN;
                    
                    if (country_name) {
                        document.getElementById("population").innerHTML =  numberWithCommas(d.properties.population);
                        document.getElementById("msw").innerHTML = numberWithCommas(d.properties.msw);
                        document.getElementById("ew").innerHTML = numberWithCommas(d.properties.ew);
                        document.getElementById("gdp").innerHTML = numberWithCommas(d.properties.gdp);
                        document.getElementById("mswcap").innerHTML = precise(d.properties.msw_per_capita, 2);
                        document.getElementById("ewcap").innerHTML = precise(d.properties.ew/d.properties.population, 2);
                        document.getElementById("gdpcap").innerHTML = numberWithCommas(d.properties.gdp_per_capita);
                        document.getElementById("rec").innerHTML = numberWithCommas(d.properties.rec);
                        document.getElementById("inc").innerHTML =  d.properties.income_class;
                        return country_name;
                    }

                })
                .on('mouseout', function (event, d) {
                    d3.select(this).style("stroke", prevStroke)
                        .style("stroke-width", prevStrokeWidth)
                });

            
            // Declare and Define Zoom functions
            var zoom = d3.zoom()
                .on("zoom", zoomed);

            function zoomed({ transform }) {
                g.attr("transform", transform);
            }

            // Call zoom on svg
            svg.call(zoom);

            
            var definition_dictionary = {
                "Municipal Solid Waste Per Capita": "total waste produced at the municipal level per person living in the country",
                "Population":"Total number of people living in the country on 2018",
                "Gross Domestic Product": "The total value of good produced and services provided in a country during one year",
                "Municipal Solid Waste": "total waste produced at the municipal level",
                "Gross Domestic Product Per Capita": "Gross Domestic Product per person or economic output per person",
                "Municipal Solid Waste Gross Domestic Product Ratio": "Ratio between municipal solid waste and the gross domestic product of a country", 
                "Electronic Waste": "Waste comprised of products classified as electornics",
                "Electronic Waste Per Capita": "Electronic Waste produced per person living in the country",
                "Electornic Waste Gross Domestic Product Ratio": "Ratio of electronic waste produced and GDP",
                "Percent Waste Recycled": "Percent of total waste recycled"
            };

            var legendContainer = document.getElementById("legend");
            var variableToDef = document.getElementById("variable-to-def");
            var definitionContainer = document.getElementById("definition");
            var activeStateContainer = document.getElementById("active");

            function updateActive(variable){
                activeStateContainer.innerHTML = "";
                activeStateContainer.innerHTML = variable;

                variableToDef.innerHTML = "";
                variableToDef.innerHTML = variable;

                definitionContainer.innerHTML = "";
                definitionContainer.innerHTML = definition_dictionary[variable];
            }
            

            function addLegend(Scale, pers, inMillions = false, in100Billions = false, inTonnes= false, inThousands = false) {
                legendContainer.innerHTML = "";
                if (inMillions) {
                    if (inTonnes)
                        legendContainer.innerHTML += "<span>in million tons</span><br>";
                    else
                        legendContainer.innerHTML += "<span>in millions</span><br>";
                    for (var i = 0; i < Scale.thresholds().length; i++) {
                        legendContainer.innerHTML += "<span>";
                        var box = document.createElement("DIV");
                        box.style.backgroundColor = Scale.range()[i];
                        box.className = "colorBox";
                        legendContainer.appendChild(box);

                        if (i == 0) {
                            legendContainer.innerHTML += " > ";
                        }
                        else {
                            legendContainer.innerHTML += precise(Scale.thresholds()[i - 1] / 1000000, pers) + " - ";
                        }
                        legendContainer.innerHTML += precise(Scale.thresholds()[i] / 1000000, pers) + "</span><br>";
                    }
                }
                else if(in100Billions){
                    legendContainer.innerHTML += "<span>in 100 billions</span><br>";
                    for (var i = 0; i < Scale.thresholds().length; i++) {
                        legendContainer.innerHTML += "<span>";
                        var box = document.createElement("DIV");
                        box.style.backgroundColor = Scale.range()[i];
                        box.className = "colorBox";
                        legendContainer.appendChild(box);

                        if (i == 0) {
                            legendContainer.innerHTML += " > ";
                        }
                        else {
                            legendContainer.innerHTML += precise(Scale.thresholds()[i - 1] / 100000000000, pers) + " - ";
                        }
                        legendContainer.innerHTML += precise(Scale.thresholds()[i] / 100000000000, pers) + "</span><br>";
                    }
                }
                else if(inThousands){
                    if (inTonnes)
                        legendContainer.innerHTML += "<span>in thousands tonnes</span><br>";
                    else
                        legendContainer.innerHTML += "<span>in thousands</span><br>";
                    for (var i = 0; i < Scale.thresholds().length; i++) {
                        legendContainer.innerHTML += "<span>";
                        var box = document.createElement("DIV");
                        box.style.backgroundColor = Scale.range()[i];
                        box.className = "colorBox";
                        legendContainer.appendChild(box);

                        if (i == 0) {
                            legendContainer.innerHTML += " > ";
                        }
                        else {
                            legendContainer.innerHTML += precise(Scale.thresholds()[i - 1] / 1000, pers) + " - ";
                        }
                        legendContainer.innerHTML += precise(Scale.thresholds()[i] / 1000, pers) + "</span><br>";
                    }
                }
                else {
                    if (inTonnes)
                        legendContainer.innerHTML += "<span>in tons</span><br>";
                    for (var i = 0; i < Scale.thresholds().length; i++) {
                        legendContainer.innerHTML += "<span>";
                        var box = document.createElement("DIV");
                        box.style.backgroundColor = Scale.range()[i];
                        box.className = "colorBox";
                        legendContainer.appendChild(box);
                        if (i == 0) {
                            legendContainer.innerHTML += " > ";
                        }
                        else {
                            legendContainer.innerHTML += precise(Scale.thresholds()[i - 1], pers) + " - ";
                        }
                        legendContainer.innerHTML += precise(Scale.thresholds()[i], pers) + "</span><br>";
                    }
                }
            }

            addLegend(wasteCapColor, 2, false,false, true);
            var state = "wasteCapColor";
            var IncomeFilter = document.getElementById("incomeClassFilter");
            IncomeFilter.addEventListener("change", function () {
                svg.selectAll("path")
                    // .style("stroke", function (d) {
                    //     var value = d.properties.income_class;
                    //     if (IncomeFilter.value == value) {
                    //         return "grey";
                    //     }
                    // })
                    // .style("stroke-width", function (d) {
                    //     var value = d.properties.income_class;
                    //     if (IncomeFilter.value == value) {
                    //         return "2px";
                    //     }
                    // })
                    .style("fill", function (d) {
                        var value = d.properties.income_class;
                        if(IncomeFilter.value == "N"){
                            switch (state){
                                case "popColor":
                                    return popColor(d.properties.population);
                                case "wasteColor":
                                    return wasteColor(d.properties.msw);
                                case "gdpColor":
                                    return gdpColor(d.properties.gdp);
                                case "wasteCapColor":
                                    return wasteCapColor(d.properties.msw_per_capita);
                                case "eWasteColor":
                                    return eWasteColor(d.properties.ew);
                                case "ewCapColor":
                                    return ewCapColor(d.properties.ew/d.properties.population);
                                case "ewGdpColor":
                                    return ewGdpColor(d.properties.ew/d.properties.gdp);
                                    case "eWasteColor":
                                case "gdpCapColor":
                                    return gdpCapColor(d.properties.gdp_per_capita);
                                case "mswGdpColor":
                                    return mswGdpColor( d.properties.msw / d.properties.gdp);
                                case "recColor":
                                    return recColor( d.properties.rec);
                                default:
                                   return null;
                            }
                        }
                        if (IncomeFilter.value !== value) {
                            return null;
                        } 
                        else{
                            switch (state){
                                case "popColor":
                                    return popColor(d.properties.population);
                                case "wasteColor":
                                    return wasteColor(d.properties.msw);
                                case "gdpColor":
                                    return gdpColor(d.properties.gdp);
                                case "wasteCapColor":
                                    return wasteCapColor(d.properties.msw_per_capita);
                                case "eWasteColor":
                                    return eWasteColor(d.properties.ew);
                                case "ewCapColor":
                                    return ewCapColor(d.properties.ew/d.properties.population);
                                case "ewGdpColor":
                                    return ewGdpColor(d.properties.ew/d.properties.gdp);
                                    case "eWasteColor":
                                case "gdpCapColor":
                                    return gdpCapColor(d.properties.gdp_per_capita);
                                case "mswGdpColor":
                                    return mswGdpColor( d.properties.msw / d.properties.gdp);
                                case "recColor":
                                    return recColor( d.properties.rec);
                                default:
                                   return null;
                            }
                        }
                    });
            });


            
            // Buttons for changing variable visualized
            d3.select("#popBtn").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.population;
                        if (value) {
                            return popColor(value);
                        } else {
                            return null;
                        }
                    });
                addLegend(popColor, 4, true);
                state = "popColor";
                IncomeFilter.value = "N";
                updateActive("Population");
            });

            d3.select("#gdpBtn").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.gdp;
                        if (value) {
                            return gdpColor(value);
                        } else {
                            return null;
                        }
                    });
                addLegend(gdpColor, 4, false, true);
                state = "gdpColor";
                IncomeFilter.value = "N";
                updateActive("Gross Domestic Product");
            });

            d3.select("#mswBtn").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.msw;
                        if (value) {
                            return wasteColor(value);
                        } else {
                            return null;
                        }
                    });
                addLegend(wasteColor, 4, true, false, true);
                state = "wasteColor";
                IncomeFilter.value = "N";
                updateActive("Municipal Solid Waste");
            });

            d3.select("#ewbtn").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.ew;
                        if (value) {
                            return eWasteColor(value);
                        } else {
                            return null;
                        }
                    });
                addLegend(eWasteColor, 4, true, false, true);
                state = "eWasteColor";
                IncomeFilter.value = "N";
                updateActive("Electronic Waste");
            });

            d3.select("#ewCapbtn").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.ew/d.properties.population;
                        if (value) {
                            return ewCapColor(value);
                        } else {
                            return null;
                        }
                    });
                addLegend(ewCapColor, 2, false,false, true);
                state = "ewCapColor";
                IncomeFilter.value = "N";
                updateActive("Electronic Waste Per Capita");
            });

            d3.select("#btn1").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.msw_per_capita;
                        if (value) {
                            return wasteCapColor(value);
                        } else {
                            return null;
                        }
                    });
                    addLegend(wasteCapColor, 2, false,false, true);
                    state = "wasteCapColor";
                    IncomeFilter.value = "N";
                    updateActive("Municipal Solid Waste Per Capita");
            });

            d3.select("#ewGdp").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.ew/d.properties.gdp;
                        if (value) {
                            return ewGdpColor(value);
                        } else {
                            return null;
                        }
                    });
                    addLegend(ewGdpColor, 4);
                    state = "ewGdpColor";
                    IncomeFilter.value = "N";
                    updateActive("Electornic Waste Gross Domestic Product Ratio");
            });

            d3.select("#btn2").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.gdp_per_capita;
                        if (value) {
                            return gdpCapColor(value);
                        } else {
                            return null;
                        }
                    });
                    addLegend(gdpCapColor, 4, false,false,false,true);
                    state = "gdpCapColor";
                    IncomeFilter.value = "N";
                    updateActive("Gross Domestic Product Per Capita");
            });

            d3.select("#btn3").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.msw / d.properties.gdp;
                        if (value) {
                            return mswGdpColor(value);
                        } else {
                            return null;
                        }
                    });
                    addLegend(mswGdpColor, 4);
                    state = "mswGdpColor";
                    IncomeFilter.value = "N";
                    updateActive("Municipal Solid Waste Gross Domestic Product Ratio");
            });

            d3.select("#pwr").on("click", function () {
                svg.selectAll('path').style('fill', null);
                svg.selectAll("path")
                    .style("fill", function (d) {
                        var value = d.properties.rec;
                        if (value) {
                            return recColor(value);
                        } else {
                            return null;
                        }
                    });
                    addLegend(recColor, 2);
                    state = "recColor";
                    IncomeFilter.value = "N";
                    updateActive("Percent Waste Recycled");
            });

            
        });
    });
}

window.onload = init;