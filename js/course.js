$(document).ready(function () {
    var myChart;
    var OccupationSOC = [];
    var OccupationTitle = [];
    var OccupationPercentage = [];
    $("#myChart").remove(); // removing previous canvas element
    $("#chart-container").append('<canvas id="myChart" class="myChart"></canvas>');
    $.ajax({
        type: "GET",
        url: "https://api.lmiforall.org.uk/api/v1/hesa/list-courses",
        dataType: "json",
        success: function (data) {

            var CourseID = [];
            var CourseName = [];

            var arrayLength = data.length;

            for (var i = 0; i < arrayLength; i++) {
                CourseID[i] = data[i].id;
                CourseName[i] = data[i].name;
            }
            /*This IF statement is here due to the fact that the API returns arrays to us with no values in them so it is better to just take those options away from the
              user by not putting it in the dropdown box*/
            for (var i = 0; i < arrayLength; i++) {
                if (data[i].id != "A0" & data[i].id != "B0" & data[i].id != "D0" & data[i].id != "D5" & data[i].id != "D7" & data[i].id != "D9" & data[i].id != "F2" &
                    data[i].id != "G9" & data[i].id != "H0" & data[i].id != "H9" & data[i].id != "I5" & data[i].id != "I9" & data[i].id != "J1" & data[i].id != "J2" &
                    data[i].id != "J3" & data[i].id != "J7" & data[i].id != "K0" & data[i].id != "K9" & data[i].id != "L0" & data[i].id != "N0" & data[i].id != "N7" &
                    data[i].id != "P0" & data[i].id != "Q4" & data[i].id != "Q6" & data[i].id != "Q7" & data[i].id != "R5" & data[i].id != "R6" & data[i].id != "T3" &
                    data[i].id != "T4" & data[i].id != "T5" & data[i].id != "T8" & data[i].id != "T9" & data[i].id != "V0" & data[i].id != "V7" & data[i].id != "W0" &
                    data[i].id != "X0" & data[i].id != "X2") {
                    $('#CourseDropdown').append('<option value="' + CourseID[i] + '">' + CourseName[i] + '</option>');
                }
            }
        }
    });

    $("#CourseDropdown").change(function () {
        $("#CourseDropdown option[value='select']").remove();
        $("#chart-container").html("");
        $("#myChart").remove(); // removing previous canvas element
        $("#chart-container").append('<canvas id="myChart" class="myChart" width="500" height="500"></canvas>');
        var course = document.getElementById('CourseDropdown').value;
        $.ajax({
            type: "GET",
            url: "https://api.lmiforall.org.uk/api/v1/hesa/occupations?courses=" + course,
            dataType: "json",
            success: function (data) {

                var arrayLength = data.length;
                if (arrayLength == 0) {
                    alert("No Data avialable");
                    $("#chart-container").html("No Data avialable");
                } else {
                    var lastArray = arrayLength - 1;
                    var CourseArrayLength = data[lastArray].occupations.length;
                    if (CourseArrayLength <= 10) {
                        for (var i = 0; i < CourseArrayLength; i++) {
                            OccupationTitle[i] = data[lastArray].occupations[i].title;
                            OccupationPercentage[i] = data[lastArray].occupations[i].percentage;
                        }
                    } else {
                        for (var i = 0; i < 10; i++) {
                            OccupationTitle[i] = data[lastArray].occupations[i].title;
                            OccupationPercentage[i] = data[lastArray].occupations[i].percentage;
                        }
                    }
                }

            },
            error: function (xhr, status) {
                $("#chart-container").html("No Data avialable");
            },
            complete: function (data) {
                var ctx = document.getElementById('myChart');
                myChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: OccupationTitle,
                        datasets: [{
                            label: '#percentage of workers',
                            data: OccupationPercentage,
                            backgroundColor: ["#33ccff", "#0099cc", "#006080", "#00394d", " #4d0026", "#800040", "#b30059", " #e60073", "#ff1a8c", "#ff99cc"],
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            position: "right"
                        }
                    }
                });
                var windowWidth = $(window).width();
                if (windowWidth > 500) {
                    document.getElementById("myChart").onclick = function (evt) {
                        var activePoints = myChart.getElementsAtEvent(evt);
                        var firstPoint = activePoints[0];
                        var label = myChart.data.labels[firstPoint._index];
                        window.open("https://www.indeed.co.uk/jobs?q=" + label + "&l=", '_blank');

                    };
                }
                if (windowWidth < 500) {
                    document.getElementById("myChart").ondblclick = function (evt) {
                        var activePoints = myChart.getElementsAtEvent(evt);
                        var firstPoint = activePoints[0];
                        var label = myChart.data.labels[firstPoint._index];
                        window.open("https://www.indeed.co.uk/jobs?q=" + label + "&l=", '_blank');

                    };
                }
                if (windowWidth < 1000) {
                    myChart.options.legend.position = 'top';
                    myChart.update();
                }
                if (windowWidth >= 1000) {
                    myChart.options.legend.position = 'right';
                    myChart.update();
                }
            }
        });
    });

    $(window).on('resize', function (event) {
        try {
            var windowWidth = $(window).width();
            if (windowWidth < 500) {
                document.getElementById("myChart").onclick = null;
                document.getElementById("myChart").ondblclick = function (evt) {
                    var activePoints = myChart.getElementsAtEvent(evt);
                    var firstPoint = activePoints[0];
                    var label = myChart.data.labels[firstPoint._index];
                    window.open("https://www.indeed.co.uk/jobs?q=" + label + "&l=", '_blank');
                };
            }
            if (windowWidth > 500) {
                document.getElementById("myChart").ondblclick = null;
                document.getElementById("myChart").onclick = function (evt) {
                    var activePoints = myChart.getElementsAtEvent(evt);
                    var firstPoint = activePoints[0];
                    var label = myChart.data.labels[firstPoint._index];
                    window.open("https://www.indeed.co.uk/jobs?q=" + label + "&l=", '_blank');
                };
            }
            if (windowWidth < 1000) {
                myChart.options.legend.position = 'top';
                myChart.update();
            }
            if (windowWidth >= 1000) {
                myChart.options.legend.position = 'right';
                myChart.update();
            }
        } catch (err) {}
    });
});