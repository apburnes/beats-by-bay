(function() {

  createjs.Sound.registerSound({src:"/data/book-scale9.mp3|/data/book-scale9.ogg", id:"beep9"});
  createjs.Sound.registerSound({src:"/data/book-scale8.mp3|/data/book-scale8.ogg", id:"beep8"});
  createjs.Sound.registerSound({src:"/data/book-scale7.mp3|/data/book-scale7.ogg", id:"beep7"});
  createjs.Sound.registerSound({src:"/data/book-scale6.mp3|/data/book-scale6.ogg", id:"beep6"});

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
        s = .5 / Math.max((b[1][0]  - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
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

    function addPoints(data) {
      if (data.coordinates !== null) {
        var lat = parseFloat(data.coordinates.coordinates[1]);
        var coords = projection(data.coordinates.coordinates);
        if (lat <= 37.5) {
          var point = svg.append("path")
            .datum({type: "Point", coordinates: data.coordinates.coordinates})
            .attr("fill", "blue")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("d", path)

          createjs.Sound.play("beep6");
        }

        else if (lat > 37.5 && lat <= 37.65) {
          var point = svg.append("path")
            .datum({type: "Point", coordinates: data.coordinates.coordinates})
            .attr("fill", "red")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("d", path)

          createjs.Sound.play("beep7");
        }

        else if (lat > 37.65 && lat <= 37.8) {
          var point = svg.append("path")
            .datum({type: "Point", coordinates: data.coordinates.coordinates})
            .attr("fill", "orange")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("d", path)

          createjs.Sound.play("beep8");
        }

        else if (lat > 37.8) {
          var point = svg.append("path")
            .datum({type: "Point", coordinates: data.coordinates.coordinates})
            .attr("fill", "green")
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("d", path)

          createjs.Sound.play("beep9");
        }



        point.append("title")
          .text(function (d) { return JSON.stringify(data.text)});

        point.transition()
          .style("opacity", .1)
          .style("fill", "#000")
          .duration(2000);
      }
    }

    function initSocket() {
      if (io !== undefined) {
        var host = window.location.host;
        var socket = io.connect(host);
        socket.on('connect', function() {
          socket.emit('start stream');
          socket.on('sf', function(data) {
            addPoints(data);
          })
        });
      }
      else {
        console.log('Not socket connection!')
      }
    }

    window.onload = initSocket();
  });

  d3.select(self.frameElement).style("height", height + "px");
})();
