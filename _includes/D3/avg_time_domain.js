$( document ).ready(function() {
    render_chart(json_data = "{{site.github.url}}/data/all_states_tool_timesp_monthly.json");
 });

function render_chart(json_data){
    var stack = d3.layout.stack();
    var dataset
    d3.json(json_data, function(json){

    dataset = json;
    console.log(dataset)
    n = dataset["series"].length, // Number of Layers
    m = dataset["layers"].length, // Number of Samples in 1 layer

    yGroupMax = d3.max(dataset["layers"], function(layer) { return d3.max(layer, function(d) { return d.y1; }); });
    yGroupMin = d3.min(dataset["layers"], function(layer) { return d3.min(layer, function(d) { return d.y0; }); });

    var margin = {top: 50, right: 70, bottom: 50, left: 100},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .domain(dataset["categories"])
        .rangeRoundBands([0, width], .08);

    var y = d3.scale.linear()
        .domain([yGroupMin, yGroupMax])
        .range([height, 0]);
    //console.log(yGroupMin)
    //console.log(yGroupMax)
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(5)
        .tickPadding(6)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var layer = svg.selectAll(".layer")
        .data(dataset["layers"])
        .enter().append("g")
        .attr("class", "layer");

    var rect = layer.selectAll("rect")
        .data(function(d,i){d.map(function(b){b.colorIndex=i;return b;});return d;})
        .enter().append("rect")
        .transition()
        .duration(500)
        .delay(function(d, i) { return i * 20; })
        .attr("x", function(d, i, j) { return x(d.month_year) + x.rangeBand() / n * j; })
        .attr("width", x.rangeBand() / (n))
        .transition()
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return height - y(d.y1-d.y0)})
        .attr("class","bar")
        .style("fill",function(d){return dataset["colors"][d.colorIndex];})

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.select("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("text")
        .attr("x", width/5)
        .attr("y", 0)
        .attr("dx", ".71em")
        .attr("dy", "-.71em")
        .text("Average Time Spent(minutes) in a Day Students on Tools (Month wise)");

svg.append("text")
        .attr("x", width/30)
        .attr("y", 450)
        .attr("dx", ".71em")
        .attr("dy", "-.71em")
        .text("*By all students in the class both logged-in and anonymous on a particular day");

     svg.append("text")
        .attr("x", width/2.5)
        .attr("y", 14)
        .attr("dx", ".71em")
        .attr("dy", "-.71em")
        .text("(All states)");


    // add legend
    var legend = svg.append("g")
      .attr("class", "legend")

    legend.selectAll('text')
      .data(dataset["colors"])
      .enter()
      .append("rect")
      .attr("x", width - margin.right + 40)
      .attr("y", function(d, i){ return i *  20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d) {
        return d;
      })

    legend.selectAll('text')
      .data(dataset["series"])
      .enter()
    .append("text")
    .attr("x", width-margin.right  + 40 + 25)
    .attr("y", function(d, i){ return i *  20 + 9;})
    .text(function(d){return d});

    var tooltip = d3.select("body")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'month');
    tooltip.append('div')
     .attr('class', 'toolname')
    tooltip.append('div')
    .attr('class', 'tempRange');

    svg.selectAll("rect")
    .on('mouseover', function(d) {

        //if(!d.colorIndex) return null;

        tooltip.select('.toolname').html("<b>" + dataset['series'][d.colorIndex] + "</b>");

        //if(!d.month_year) return null;

        tooltip.select('.month').html("<b>" + d.month_year + "</b>");

        console.log(d.y0)
        if(d.y0 == 5 && d.y1 == 10){
         tooltip.select('.tempRange').html('No Tool Usage');
        }
        else {tooltip.select('.tempRange').html(d.y0 + " min" + " to " + d.y1 + " min");}

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {

        if(!d.month_year)return null;

        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function() {
        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });

    d3.selectAll(".m")
				.on("click", function() {
					var date = this.getAttribute("value");

					var str;
					if(date == "Chhattisgarh"){
						str = "{{site.github.url}}/data/ct_tool_timesp_monthly.json";
					}else if(date == "Rajasthan"){
						str = "{{site.github.url}}/data/rj_tool_timesp_monthly.json";
					}else if(date == "Mizoram"){
						str = "{{site.github.url}}data/mz_tool_timesp_monthly.json";
					}else if(date == "Telangana"){
						str = "{{site.github.url}}/data/tg_tool_timesp_monthly.json";
					}else{
					//All states top 50 schools
						str = "{{site.github.url}}/data/all_states_tool_timesp_monthly.json";
					}

 // var stack = d3.layout.stack();
 //   var dataset
    d3.json(str, function(json){

    dataset = json;
    //console.log(dataset)
    n = dataset["series"].length, // Number of Layers
    m = dataset["layers"].length, // Number of Samples in 1 layer

    yGroupMax = d3.max(dataset["layers"], function(layer) { return d3.max(layer, function(d) { return d.y1; }); });
    yGroupMin = d3.min(dataset["layers"], function(layer) { return d3.min(layer, function(d) { return d.y0; }); });

    //var margin = {top: 50, right: 50, bottom: 50, left: 120},
    //    width = 960 - margin.left - margin.right,
    //    height = 500 - margin.top - margin.bottom;

    //var x = d3.scale.ordinal()
    //    .domain(dataset["categories"])
    //    .rangeRoundBands([0, width], .08);

    //var y = d3.scale.linear()
    //    .domain([yGroupMin, yGroupMax])
    //    .range([height, 0]);
    //console.log(yGroupMin)
    //console.log(yGroupMax)
    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(5)
        .tickPadding(6)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    //var svg = d3.select("#chart1").append("svg")
    //    .attr("width", width + margin.left + margin.right)
    //    .attr("height", height + margin.top + margin.bottom)
    //    .append("g")
    //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.selectAll("*").remove();

    var layer = svg.selectAll(".layer")
        .data(dataset["layers"])
        .enter().append("g");

    var rect = layer.selectAll(".rect")
        .data(function(d,i){d.map(function(b){b.colorIndex=i;return b;});return d;})
        .enter().append("rect");

    //rect.exit()
    //    .transition()
	//	.duration(1000)
	//	.ease("circle")
//		.remove();

       rect.transition()
        .duration(500)
        .delay(function(d, i) { return i * 20; })
        .attr("x", function(d, i, j) { return x(d.month_year) + x.rangeBand() / n * j; })
        .attr("width", x.rangeBand() / (n))
        .transition()
        .attr("y", function(d) { return y(d.y1); })
        .attr("height", function(d) { return height - y(d.y1-d.y0)})
        .attr("class","bar")
        .style("fill",function(d){return dataset["colors"][d.colorIndex];});



	// layers.exit()
	//      .transition()
	//      .duration(1000)
	//      .ease("circle")
	//      .remove();


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.select("g")
            .attr("class", "y axis")
            .call(yAxis);

        svg.append("text")
        .attr("x", width/5)
        .attr("y", 0)
        .attr("dx", ".71em")
        .attr("dy", "-.71em")
        .text("Average Time Spent(minutes) by Students in a Day on Tools (Month wise)*");

       svg.append("text")
        .attr("x", width/2.5)
        .attr("y", 14)
        .attr("dx", ".71em")
        .attr("dy", "-.71em")
        .text("(" + date + ")");

      svg.append("text")
        .attr("x", width/30)
        .attr("y", 450)
        .attr("dx", ".71em")
        .attr("dy", "-.71em")
        .text("*By all students in the class both logged-in and anonymous on a particular day");

    // add legend
    var legend = svg.append("g")
      .attr("class", "legend")

    legend.selectAll('text')
      .data(dataset["colors"])
      .enter()
      .append("rect")
      .attr("x", width - margin.right +  40)
      .attr("y", function(d, i){ return i *  20;})
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d) {
        return d;
      })

    legend.selectAll('text')
      .data(dataset["series"])
      .enter()
    .append("text")
    .attr("x", width - margin.right + 25 +  40)
    .attr("y", function(d, i){ return i *  20 + 9;})
    .text(function(d){return d});

    var tooltip = d3.select("body")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'month');
    tooltip.append('div')
    .attr('class', 'tempRange');

    var tooltip = d3.select("body")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'month');
    tooltip.append('div')
     .attr('class', 'toolname')
    tooltip.append('div')
    .attr('class', 'tempRange');

    svg.selectAll("rect")
    .on('mouseover', function(d) {

        //if(!d.colorIndex) return null;
        tooltip.select('.toolname').html("<b>" + dataset['series'][d.colorIndex] + "</b>");
        //if(!d.month_year)return null;
        tooltip.select('.month').html("<b>" + d.month_year + "</b>");

        if(d.y0 == 5 && d.y == 10){
         tooltip.select('.tempRange').html('No Tool Usage');
        }
        else {tooltip.select('.tempRange').html(d.y0 + " min" + " to " + d.y1 + " min");}

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {

        if(!d.month_year)return null;

        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function() {
        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });


 });



});

});

};

