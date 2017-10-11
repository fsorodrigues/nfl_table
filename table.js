var calendar = [];

var dataset = [];

var table;
var titles;
var headers;
var rows;
var body;

var selectValue;

d3.csv("nfl.csv", function (error, dataIn) {
    if (error) { throw error };

    dataIn.forEach( function(d) {
      d.Data = formatTime(d.Data, "%d/%m", "%d-%b")
    });// closing dataset.forEach

    // nesting data
    var nestedData = d3.nest()
                        .key(function(d) { return d.wk; })
                        .sortValues(function(d,i) { return parseFloat(d.Horário) - parseFloat(i.Horário); }) //sort ascending by time
                        .sortValues(function(d,i) { return parseFloat(d.Data) - parseFloat(i.Data); }) //sort ascending by date
                        .entries(dataIn);

    dataset = nestedData;

    var initialData = updateData(1);

    console.log(updateData(2));

    var menu = d3.select(".content")
                   .append("select")
                   .attr("class", "dropdown-menu")
                   .on("change", option);

        menu.selectAll("option")
              .data(nestedData)
              .enter()
              .append("option")
              .text(function(d) { return d.key })
              .attr("value", function(d) { return +d.key });

    table = d3.select(".content").append("table");

    titles = d3.keys(initialData[0]);

    drawTable(initialData);
});

// formatting date
function formatTime(input, formatInput, formatOutput) {
    var dateParse = d3.timeParse(formatInput);
    var dateFormat = d3.timeFormat(formatOutput);
    return dateFormat(dateParse(input))
};// closing formatTime

function drawTable(data) {

    headers = table.append("thead")
                       .append("tr")
                       .selectAll("th")
                       .data(titles)
                       .enter()
                       .append("th")
                       .text(function (d) { return d; })

    body = table.append("tbody");

    rows = body.selectAll("tr")
                .data(data)
                .enter()
                .append("tr");

           rows.selectAll("td")
                   .data(function (d) {
                        return titles.map(function (k) {
                            return { "value": d[k], "name": k};
                                       });
                       })
                  .enter()
                  .append("td")
                  .html(function (d) { return d.value; });
};

function updateTable(data) {

  var selection = body.selectAll("tr")
                      .data(data);

  // update
  selection.selectAll("td")
            .data(function (d) {
              return titles.map(function (k) {
                return { "value": d[k], "name": k};
                     });
                   })
        .html(function(d) { return d.value; });

  // enter
  var newRow = selection.enter()
                        .append("tr");

  newRow.selectAll("td")
          .data(function (d) {
                return titles.map(function (k) {
                  return { "value": d[k], "name": k};
                       });
                     })
          .enter()
          .append("td")
          .html(function(d) { return d.value });

  // exit, remove
  selection.exit().remove();



};

function updateData(selectedWeek) {

    return dataset.filter(function(d){ return d.key == selectedWeek })[0].values
};

function option() {
    selectValue = d3.select(this).property("value")
    newData = updateData(selectValue);
    updateTable(newData);
};
