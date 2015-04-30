var query = window.location.search.substring(1);
if (query && query=='jobs') {
  d3.select('body').attr('class', 'jobs-only');
  // d3.select('#verbs').style('display', 'none'); 
  // d3.select('#jobs').style('width', '100%'); 
}
if (query && query=='verbs') {
  d3.select('body').attr('class', 'verbs-only');
  // d3.select('#jobs').style('display', 'none'); 
  // d3.select('#verbs').style({'width': '100%', 'position': 'relative'}); 
}

function joblist(selector, data) {
  var items = d3.select(selector)
    .selectAll('li')
    .data(data)
    .enter()
    .append('li')
    .append('a')
    .attr('target', '_blank')
    .attr('href', function(d) {
      if (d.url) return 'http://mturk.com' + d.url;
    });

  items.append('h2')
    .text(function(d) {
      return d.title;
    });

  items.append('p')
    .text(function(d) {
      return d.description;
    });

  items.append('span')
    .attr('class', 'r_k')
    .text('Reward: ');

  items.append('span')
    .attr('class', 'r_v')
    .text(function(d) {
      return d.reward;
    });
}

d3.json('http://oddjobs.s3.amazonaws.com/odd_jobs.json', function(err, data) {
  var oddjobs = data.oddjobs.slice(0, 25);
  var normaljobs = data.normaljobs.slice(0, 25);
  var cheapjobs = data.cheapjobs.slice(0, 25);

  joblist('#odd-jobs', oddjobs);
  joblist('#normal-jobs', normaljobs);
  joblist('#cheap-jobs', cheapjobs);

  var imp_fontsize = d3.scale.linear()
    .domain(d3.extent(data.imperatives, function(d) {
      return +d[1];
    }))
    .range([16, 50]);

  var imperatives = d3.select('#imperatives')
    .selectAll('li')
    .data(data.imperatives)
    .enter()
    .append('li')
    .attr('class', 'imperative')
    .style('font-size', function(d) {
      return imp_fontsize(+d[1]) + 'px';
    })
    .text(function(d) {
      return d[0].replace(/[^A-Za-z ]/g, '');
    });
});

d3.select('#jobtype').on('change', function(){
  d3.selectAll('#jobs section').style('display', 'none');
  d3.select(this.value).style('display', 'block');
});
