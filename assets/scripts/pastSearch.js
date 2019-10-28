//Rendering the past searches clickable
$("#onloadjs").ready(function () { //This function will only start after the second script is fully loaded
    $(document).on("click", ".previous", function () {
        var visitedCity = $(this).text();
        var queryUrlCurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + visitedCity + "&APPID=e350fae665123f0371f27b40b295a031";
        //Call to get current weather
        $.ajax({
            url: queryUrlCurrent,
            method: "GET",
            error: function () {
                errorText.text("City not found"); //Shows error message if city field is empty or city is not found
            }
        }).then(function (response) {
            console.log(response.cod)
            //Render the response data in the appropiate elements
            errorText.text("");
            city.text(response.name + " (" + currentDate + ")");
            temp.text(Math.floor(response.main.temp - 273.15) + " °C");
            humid.text(response.main.humidity + "%");
            wind.text(response.wind.speed + " KM/h");
            icon.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + "@2x.png")
            console.log(currentDate);
            console.log("lon: " + response.coord.lat + "& lat:" + response.coord.lon)
            //Call to get UV Index
            $.ajax({
                url: "https://api.openweathermap.org/data/2.5/uvi?APPID=e350fae665123f0371f27b40b295a031&lat=" + response.coord.lat + "&lon=" + response.coord.lon,
                method: "GET"
            }).then(function (response) {
                console.log(response);
                uvIndex.text(response.value)
                //Query UL for forecast weather
                var queryUrlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + visitedCity + "&APPID=e350fae665123f0371f27b40b295a031";
                //Call to get forecast weather
                $.ajax({
                    url: queryUrlForecast,
                    method: "GET"
                }).then(function (response) {
                    console.log(response);
                    //Cycle through all forecast response
                    var forecastDate = [];
                    var forecastIcon = [];
                    var forecastTemp = [];
                    var forecastHumid = [];
                    for (var item of response.list) {
                        if (item.dt_txt.includes("15:00:00")) { //collet forecast data for 3:00 pm
                            forecastDate.push(item.dt_txt.slice(0, 10)); //forecast date array
                            forecastIcon.push(item.weather[0].icon); //forecast icon array
                            forecastTemp.push(Math.floor(item.main.temp - 273.15)); //forecast temperature array
                            forecastHumid.push(item.main.humidity); //forecast humidity array
                        }
                    }
                    //Redering forecast responses
                    for (var i = 0; i <= 4; i++) {
                        $(forecast_date[i]).text(forecastDate[i]);
                        $(forecast_icon[i]).attr("src", "http://openweathermap.org/img/wn/" + forecastIcon[i] + "@2x.png");
                        $(forecast_temp_data[i]).text(forecastTemp[i] + " °C");
                        $(forecast_humid_data[i]).text(forecastHumid[i] + "%");
                    }
                }


                )
            })
        })

    })
})