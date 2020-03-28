$ = new jQuery.noConflict();
$(document).ready(function () {
    // some sample events
    $("#division-dhaka").click(function () {
        getChartData("ঢাকা");
    })
    $("#division-chittagong").click(function () {
        getChartData("চট্টগ্রাম");
    })
    $("#division-sylhet").click(function () {
        getChartData("সিলেট");
    })
    $("#division-khulna").click(function () {
        getChartData("খুলনা");
    })
    $("#division-barishal").click(function () {
        getChartData("বরিশাল");
    })
    $("#division-rajshahi").click(function () {
        getChartData("রাজশাহী");
    })
    $("#division-rangpur").click(function () {
        getChartData("রংপুর");
    })
})

function renderChart(data, labels, xtring) {
    if (xtring != "DistrictData")
        var ctx = document.getElementById("myChart").getContext('2d');
    else {
        var ctx = document.getElementById("districtChart").getContext('2d');
    }
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Dengue Cases in ' + xtring + ' in 2019',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            }]
        },
    });
}

function renderTable(data, labels) {
    var extbody = document.getElementById("ShowTable");

    var tablebody = document.createElement('tbody');
    tablebody.setAttribute("id", "ShowTable");

    for (var i = 0; i < data.length; i++) {
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.appendChild(document.createTextNode(labels[i]));
        var cell2 = document.createElement('td');
        cell2.appendChild(document.createTextNode(data[i]));
        row.appendChild(cell);
        row.appendChild(cell2);
        tablebody.appendChild(row);
    }

    var row = document.createElement('tr');
    var cell = document.createElement('td');
    cell.setAttribute("colspan", "2");
    var div = document.createElement('div');
    div.setAttribute("class", "chart-container");
    div.setAttribute("style", "position: relative; height:700px ")
    var canvas = document.createElement('canvas');
    canvas.setAttribute("id", "districtChart");
    canvas.setAttribute("style", "width: 800px;");
    div.appendChild(canvas);
    cell.appendChild(div);
    row.appendChild(cell);
    tablebody.appendChild(row);

    extbody.parentNode.replaceChild(tablebody, extbody);

    renderChart(data, labels, "DistrictData")

}

function getTableData(xtring) {
    var promises = [];
    var responses = [];
    var districts = [];
    console.log("in table with" + xtring);

    if (xtring == "ঢাকা") {
        districts = ["ফরিদপুর", "গোপালগঞ্জ", "নরসিংদী", "গাজীপুর", "শরীয়তপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল", "কিশোরগঞ্জ", "মানিকগঞ্জ", "ঢাকা", "মুন্সিগঞ্জ", "রাজবাড়ী", "মাদারীপুর"]
    }
    if (xtring == "চট্টগ্রাম") {
        districts = ["ফেনী", "ব্রাহ্মণবাড়িয়া", "রাঙ্গামাটি", "নোয়াখালী", "চাঁদপুর", "লক্ষ্মীপুর", "চট্টগ্রাম", "কক্সবাজার", "খাগড়াছড়ি", "বান্দরবান", "কুমিল্লা"]
    }
    if (xtring == "সিলেট") {
        districts = ["সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ"]
    }
    if (xtring == "খুলনা") {
        districts = ["যশোর", "সাতক্ষীরা", "মেহেরপুর", "নড়াইল", "চুয়াডাঙ্গা", "কুষ্টিয়া", "মাগুরা", "খুলনা", "বাগেরহাট", "ঝিনাইদহ"]
    }
    if (xtring == "বরিশাল") {
        districts = ["ঝালকাঠি", "পটুয়াখালী", "পিরোজপুর", "বরিশাল", "ভোলা", "বরগুনা"]
    }
    if (xtring == "রাজশাহী") {
        districts = ["সিরাজগঞ্জ", "পাবনা", "বগুড়া", "রাজশাহী", "নাটোর", "জয়পুরহাট", "চাঁপাইনবাবগঞ্জ", "নওগাঁ"]
    }
    if (xtring == "রংপুর") {
        districts = ["পঞ্চগড়", "দিনাজপুর", "লালমনিরহাট", "নীলফামারী", "গাইবান্ধা", "ঠাকুরগাঁও", "রংপুর", "কুড়িগ্রাম", "ময়মনসিংহ", "জামালপুর", "নেত্রকোণা"]
    }
    for (var i = 0; i < districts.length; i++) {
        var url = "http://dev.pipilika.com:5001/get_dengue_news?location=" + districts[i] + "&start_date=2019-01-01&end_date=2019-12-31";
        var request = $.ajax({
            url: url,
            type: "get",
            success: function (result) {
                responses.push(result);
            },
            error: function (err) {},
        });
        promises.push(request);
    };
    $.when.apply(null, promises).done(function () {
        var output = [];
        for (var i = 0; i < promises.length; i++) {
            output.push(promises[i].responseJSON);
        }
        $("#loadingMessageForTable").html("");
        renderTable(output, districts);
    })
}

function getChartData(xtring) {
    $("#loadingMessage").html('<img src="./static/giphy.gif" alt="" srcset="">');
    $("#loadingMessageForTable").html('<img src="./static/giphy.gif" alt="" srcset="">');
    var promises = [];
    var responses = [];

    for (var i = 1; i <= 12; i++) {
        var url = "http://dev.pipilika.com:5001/get_dengue_news?location=" + xtring + "&start_date=2019-" + i + "-01&end_date=2019-" + i + "-28";
        var request = $.ajax({
            url: url,
            type: "get",
            success: function (result) {
                responses.push(result);
            },
            error: function (err) {
                $("#loadingMessage").html("Error");
            },
        });
        promises.push(request);
    };
    $.when.apply(null, promises).done(function () {
        var output = [];
        for (var i = 0; i < promises.length; i++) {
            output.push(promises[i].responseJSON);
        }
        $("#loadingMessage").html("");
        labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        renderChart(output, labels, xtring);
        getTableData(xtring);
    })
}