(function() {
  plotBase();
  window.onload = initSocket();
})();

function log(msg) {
  console.log(msg);
}

function initSocket() {
  if (io !== undefined) {
    var host = window.location.host;
    var socket = io.connect(host);
    socket.on('connect', function() {
      socket.emit('start stream');
      socket.on('sf', function(data) {
        console.log('SF');
      })
    });
  }
  else {
    console.log('Not socket connection!')
  }
}

function plotBase() {
  var width = parseInt(d3.select("#plot").style("width")),
      height = parseInt(d3.select("#plot").style("height"));

  var projection = d3.geo.mercator();

  var path = d3.geo.path()
      .projection(projection);

  var svg = d3.select("#plot").append("svg")
      .attr("width", width)
      .attr("height", height);

  d3.json("/data/base.json", function(err, base) {
    if (err) {
      return console.log('Error: ' + err);
    }
    var lines = topojson.feature(base, base.objects.lat_lines);

    projection
        .scale(1)
        .translate([0,0]);

    var b = path.bounds(lines),
        s = 1.8 / Math.max((b[1][0]  - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
        t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection
        .scale(s)
        .translate(t);

    svg.selectAll("path")
        .data(lines.features.filter(function(d) { return (d.id / 10000 | 0) % 100 !== 99; }))
      .enter().append("path")
        .attr("class", "line")
        .attr("d", path)

    svg.append("path")
        .datum(topojson.mesh(base, base.objects.lat_lines, function(a, b) { return a !== b }))
        .attr("class", "line")
        .attr("d", path);

  });

  d3.select(self.frameElement).style("height", height + "px");
}
