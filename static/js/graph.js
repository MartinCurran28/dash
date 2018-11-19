queue()
     .defer(d3.csv, "data/class_results.csv")
     .await(makeGraphs);
     
function makeGraphs(error, resultsData){
    var ndx = crossfilter(resultsData);
    
    resultsData.forEach(function (d){
        d.age = parseInt(d.age);
        d.result = parseInt(d.result);
    });
    
     show_discipline_selector(ndx);
     show_gender_balance(ndx);
     show_subject_totals(ndx);
     show_grade_totals(ndx);
     show_average_result_per_subject(ndx);
     show_average_result_by_gender(ndx);
     show_correlation_between_age_and_result(ndx);
     show_percent_that_are_honour_male(ndx, "Male", "#show_percent_that_are_honour_male");
     show_percent_that_are_honour_female(ndx, "Female", "#show_percent_that_are_honour_female");
     show_percent_that_are_honour_english(ndx, "English", "#show_percent_that_are_honour_english");
     show_percent_that_are_honour_maths(ndx, "Maths", "#show_percent_that_are_honour_maths");
     show_percent_that_are_honour_irish(ndx, "Irish", "#show_percent_that_are_honour_irish");
     
     dc.renderAll();
    
}

function show_discipline_selector(ndx){
    var dim = ndx.dimension(dc.pluck("discipline"))
    var group = dim.group();
    
    dc.selectMenu("#discipline_selector")
       .dimension(dim)
       .group(group)
}


function show_gender_balance(ndx) {
    var dim = ndx.dimension(dc.pluck('sex'));
    var group = dim.group();
    
    dc.pieChart("#gender-balance")
        .height(300)
        .radius(120)
        .dimension(dim)
        .group(group)
        .transitionDuration(1500);
}

function show_subject_totals(ndx){
    
    var subject_dim = ndx.dimension(dc.pluck("discipline"));
    var total_subject = subject_dim.group();
    
    dc.pieChart("#subject-totals")
      .height(300)
      .radius(120)
      .transitionDuration(1500)
      .dimension(subject_dim)
      .group(total_subject);
    
}

function show_grade_totals(ndx){
    
    var grade_dim = ndx.dimension(dc.pluck("grade"));
    var total_grade = grade_dim.group();
    
    dc.pieChart("#grade-totals")
      .height(300)
      .radius(120)
      .transitionDuration(1500)
      .dimension(grade_dim)
      .group(total_grade);
    
}


function show_average_result_per_subject(ndx){
    
    var average_dim = ndx.dimension(dc.pluck("discipline"));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.result;
        p.average = p.total / p.count;
        return p;
    }
    
    function remove_item(p, v){
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else{
            p.total -= v.result;
            p.average = p.total / p.count;
        }
            return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var averageResultBySubject = average_dim.group().reduce(add_item, remove_item, initialise);

    dc.barChart("#average-result")
        .width(350)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(average_dim)
        .group(averageResultBySubject)
        .valueAccessor(function(d){
            return d.value.average.toFixed(1);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .xAxisLabel("Gender")
        .yAxis().ticks(8);
}

function show_average_result_per_subject(ndx){
    
    var average_dim = ndx.dimension(dc.pluck("discipline"));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.result;
        p.average = p.total / p.count;
        return p;
    }
    
    function remove_item(p, v){
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else{
            p.total -= v.result;
            p.average = p.total / p.count;
        }
            return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var averageResultBySubject = average_dim.group().reduce(add_item, remove_item, initialise);

    dc.barChart("#average-result")
        .width(350)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(average_dim)
        .group(averageResultBySubject)
        .valueAccessor(function(d){
            return d.value.average.toFixed(1);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .xAxisLabel("Subject")
        .yAxis().ticks(6);
}


function show_average_result_by_gender(ndx){
    
    var gender_average_dim = ndx.dimension(dc.pluck("sex"));
    
    function add_item(p, v) {
        p.count++;
        p.total += v.result;
        p.average = p.total / p.count;
        return p;
    }
    
    function remove_item(p, v){
        p.count--;
        if(p.count == 0) {
            p.total = 0;
            p.average = 0;
        } else{
            p.total -= v.result;
            p.average = p.total / p.count;
        }
            return p;
    }
    
    function initialise() {
        return {count: 0, total: 0, average: 0};
    }
    
    var averageResultByGender = gender_average_dim.group().reduce(add_item, remove_item, initialise);

    dc.barChart("#average-by-gender")
        .width(350)
        .height(250)
        .margins({top: 10, right: 50, bottom: 30, left: 50})
        .dimension(gender_average_dim)
        .group(averageResultByGender)
        .valueAccessor(function(d){
            return d.value.average.toFixed(1);
        })
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(false)
        .xAxisLabel("Gender")
        .yAxis().ticks(6);
}





function show_correlation_between_age_and_result(ndx) {
     var ageColors = d3.scale.ordinal()
        .domain(["Female", "Male"])
        .range(["orange", "blue"]);
        
    var resultDim = ndx.dimension(dc.pluck("result"));
    var studentResultDim = ndx.dimension(function(d){
        return [d.result, d.age, d.sex];
    });
    
    var resultGroup = studentResultDim.group();
    
    var minResult = resultDim.bottom(1)[0].result;
    var maxResult = resultDim.top(1)[0].result;
    
    dc.scatterPlot("#correlation_between_age_and_result")
       .width(600)
       .height(300)
       .dimension(studentResultDim)
       .group(resultGroup)
       .x(d3.scale.linear().domain([minResult, maxResult]))
       .brushOn(false)
       .symbolSize(8)
       .clipPadding(10)
       .yAxisLabel("Age")
       .xAxisLabel("Result")
       .title(function(d) {
            return " Score: " + d.key[0];
        })
        .colorAccessor(function (d) {
            return d.key[2];
        })
       .colors(ageColors)
       .margins({top: 10, right: 50, bottom: 75, left: 75})
       .yAxis().ticks(6);
}


function show_percent_that_are_honour_male(ndx, sex, element){

    var percentageThatAreHonourMale = ndx.groupAll().reduce(
        function(p, v) {
            if (v.sex === sex) {
                p.count++;
                if(v.result >= 70) {
                    p.are_honour++;
                }
                
            }
            return p;
        },
        function(p, v) {
            if (v.sex === sex) {
                p.count--;
                if(v.result >= 70) {
                    p.are_honour--;
                }
            }
            return p;
        },
        function() {
            return {count: 0, are_honour: 0};    
        },
    );
    
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.are_honour / d.count);
            }
        })
        .group(percentageThatAreHonourMale)
}

function show_percent_that_are_honour_female(ndx, sex, element){

    var percentageThatAreHonourFemale = ndx.groupAll().reduce(
        function(p, v) {
            if (v.sex === sex) {
                p.count++;
                if(v.result >= 70) {
                    p.are_honour++;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.sex === sex) {
                p.count--;
                if(v.result >= 70) {
                    p.are_honour--;
                }
            }
            return p;
        },
        function() {
            return {count: 0, are_honour: 0};    
        },
    );
    
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.are_honour / d.count);
            }
        })
        .group(percentageThatAreHonourFemale)
}

function show_percent_that_are_honour_english(ndx, discipline, element){

    var percentageThatAreHonourEnglish = ndx.groupAll().reduce(
        function(p, v) {
            if (v.discipline === discipline) {
                p.count++;
                if(v.result >= 70) {
                    p.are_honour++;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.discipline === discipline) {
                p.count--;
                if(v.result >= 70) {
                    p.are_honour--;
                }
            }
            return p;
        },
        function() {
            return {count: 0, are_honour: 0};    
        },
    );
    
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.are_honour / d.count);
            }
        })
        .group(percentageThatAreHonourEnglish)
}


function show_percent_that_are_honour_maths(ndx, discipline, element){

    var percentageThatAreHonourMaths = ndx.groupAll().reduce(
        function(p, v) {
            if (v.discipline === discipline) {
                p.count++;
                if(v.result >= 70) {
                    p.are_honour++;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.discipline === discipline) {
                p.count--;
                if(v.result >= 70) {
                    p.are_honour--;
                }
            }
            return p;
        },
        function() {
            return {count: 0, are_honour: 0};    
        },
    );
    
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.are_honour / d.count);
            }
        })
        .group(percentageThatAreHonourMaths)
}

function show_percent_that_are_honour_irish(ndx, discipline, element){

    var percentageThatAreHonourIrish = ndx.groupAll().reduce(
        function(p, v) {
            if (v.discipline === discipline) {
                p.count++;
                if(v.result >= 70) {
                    p.are_honour++;
                }
            }
            return p;
        },
        function(p, v) {
            if (v.discipline === discipline) {
                p.count--;
                if(v.result >= 70) {
                    p.are_honour--;
                }
            }
            return p;
        },
        function() {
            return {count: 0, are_honour: 0};    
        },
    );
    
    dc.numberDisplay(element)
        .formatNumber(d3.format(".2%"))
        .valueAccessor(function (d) {
            if (d.count == 0) {
                return 0;
            } else {
                return (d.are_honour / d.count);
            }
        })
        .group(percentageThatAreHonourIrish)
}