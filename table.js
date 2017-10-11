var calendar = [];

var dataset = [];

var showColumns = ["Dia", "Horário", "week"];

var table;
var titles;
var headers;
var rows;

d3.csv('nfl.csv', function (error, dataIn) {
    if (error) { throw error };

    dataIn.forEach( function(d) {
      d.Dia = formatTime(d.Dia, "%d/%m/%y", "%d-%b")
    });// closing dataset.forEach

    // nesting data
    var nestedData = d3.nest()
                        .key(function(d) { return d.week; })
                        .sortValues(function(d,i) { return parseFloat(d.Horário) - parseFloat(i.Horário); }) //sort ascending by time
                        .sortValues(function(d,i) { return parseFloat(d.Dia) - parseFloat(i.Dia); }) //sort ascending by date
                        .entries(dataIn);

    dataset = nestedData;

    var initialData = updateData(1);

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

    headers = table.append('thead')
                       .append('tr')
                       .selectAll('th')
                       .data(titles)
                       .enter()
                       .append('th')
                       .text(function (d) { return d; })

    rows = table.append('tbody')
                  .selectAll('tr')
                  .data(data)
                  .enter()
                  .append('tr');

           rows.selectAll('td')
                   .data(function (d) {
                        return titles.map(function (k) {
                            return { "value": d[k], "name": k};
                                       });
                       })
                  .enter()
                  .append('td')
                  .text(function (d) { return d.value; });
};

function updateTable(data) {

  rows = table.selectAll('tr')
                .data(data);

         rows.selectAll('td')
                 .data(function (d) {
                      return titles.map(function (k) {
                          return { "value": d[k], "name": k};
                                     });
                     })
                .text(function (d) { return d.value; });
};

function updateData(selectedWeek) {

    return dataset.filter(function(d){ return d.key == selectedWeek })[0].values
};

function option() {
    var selectValue = d3.select('select').property('value')
    dataset = updateData(selectValue);
    updateTable(dataset);

};
