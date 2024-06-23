import { useState, useRef, useEffect } from "react";
import logo from "../src/images/svg/logo.svg";
import dashHome from "./images/svg/Home.svg";
import axios from "axios";

import fewCloudsNight from "./images/svg/Weather=Few clouds, Moment=Night.svg";
import fewCloudsDay from "./images/svg/Weather=Few clouds, Moment=Day.svg";
import clearDay from "./images/svg/Weather=Clear, Moment=Day.svg";
import clearNight from "./images/svg/Weather=Clear, Moment=Night.svg";
import cloudyDay from "./images/svg/Weather=Cloudy, Moment=Day.svg";
import cloudyNight from "./images/svg/Weather=Cloudy, Moment=Night.svg";
import rainDay from "./images/svg/Weather=Rain, Moment=Day.svg";
import rainNight from "./images/svg/Weather=Rain, Moment=Night.svg";
import snowDay from "./images/svg/Weather=Snow, Moment=Day.svg";
import snowNight from "./images/svg/Weather=Snow, Moment=Night.svg";

import fewCloudsDayBg from "./images/Weather=Few Clouds, Moment=Day.png";
import fewCloudsNightBg from "./images/Weather=Few Clouds, Moment=Night.png";
import clearDayBg from "./images/Weather=Clear, Moment=Day.png";
import clearNightBg from "./images/Weather=Clear, Moment=Night.png";
import cloudyDayBg from "./images/Weather=Cloudy, Moment=Day.png";
import cloudyNightBg from "./images/Weather=Cloudy, Moment=Night.png";
import rainDayBg from "./images/Weather=Rain, Moment=Day.png";
import rainNightBg from "./images/Weather=Rain, Moment=Night.png";
import snowDayBg from "./images/Weather=Snow, Moment=Day.png";
import snowNightBg from "./images/Weather=Snow, Moment=Night.png";

import sunDimLight from "./images/svg/Type=sun-dim-light.svg";
import thermometerSimpleLight from "./images/svg/Type=thermometer-simple-light.svg";
import dropLight from "./images/svg/Type=drop-light.svg";
import cloudRainLight from "./images/svg/Type=cloud-rain-light.svg";

export default function App() {
  const [geo, setGeo] = useState("");
  const [data, setData] = useState(null);
  const [time, setTime] = useState(null);
  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [weatherSvg, setWeatherSvg] = useState("");
  const [currentTempMin, setCurrentTempMin] = useState(Infinity);
  const [currentTempMax, setCurrentTempMax] = useState(-Infinity);

  const [feelsLike, setFeelslike] = useState("0");
  const [probabilityOfRain, setProbabilityOfRain] = useState("0");
  const [windSpeed, setWindSpeed] = useState("0");
  const [airHumidity, setAirHumidity] = useState("0");

  const handleSubmit = async (event) => {
    event.preventDefault();
    bottomRef.current.scrollIntoView({ behavior: "smooth" });

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${geo}&lang=ru&cnt=5&units=metric&appid=42b2c02597e27c0eb53ffabe1cfd5463`
      );

      const jsonData = response.data;
      console.log(jsonData);

      const response2 = await axios.get(
        `https://api.timezonedb.com/v2.1/get-time-zone?key=TRIST12MA004&format=json&by=position&lat=${jsonData.city.coord.lat}&lng=${jsonData.city.coord.lon}`
      );

      const jsonData2 = response2.data;
      console.log(jsonData2);

      const date = new Date(jsonData2.formatted);
      const hours = date.getHours().toString();
      let minutes = date.getMinutes().toString();
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      const year = date.getFullYear().toString();
      const day = date.getDate().toString();
      const daysOfWeek = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
      ];
      const months = [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
      ];

      const dayOfWeek = daysOfWeek[date.getDay()];
      const month = months[date.getMonth()];

      let weatherNow = jsonData.list[0].weather[0].main;
      let weatherNowId = jsonData.list[0].weather[0].id;
      setFeelslike(jsonData.list[0].main.feels_like);
      setProbabilityOfRain(jsonData.list[0].pop * 100);
      setWindSpeed(jsonData.list[0].wind.speed);
      setAirHumidity(jsonData.list[0].main.humidity);
      // Обновление минимальной и максимальной температуры
      let tempMin = Infinity;
      let tempMax = -Infinity;

      jsonData.list.forEach((forecast) => {
        let forecastDate = new Date(forecast.dt_txt).getDate();

        if (forecastDate === date.getDate()) {
          let tempMinForecast = forecast.main.temp_min;
          let tempMaxForecast = forecast.main.temp_max;

          if (tempMinForecast < tempMin) {
            tempMin = tempMinForecast;
          }
          if (tempMaxForecast > tempMax) {
            tempMax = tempMaxForecast;
          }
        } else if (forecastDate - 1 === date.getDate()) {
          let tempMinForecast = forecast.main.temp_min;
          let tempMaxForecast = forecast.main.temp_max;

          if (tempMinForecast < tempMin) {
            tempMin = tempMinForecast;
          }
          if (tempMaxForecast > tempMax) {
            tempMax = tempMaxForecast;
          }
        }
      });

      setCurrentTempMin(tempMin);
      setCurrentTempMax(tempMax);

      // Установка изображения и svg в зависимости от погоды и времени суток
      if (
        weatherNow === "Clouds" &&
        (weatherNowId === 801 ||
          weatherNowId === 802 ||
          weatherNowId === 803) &&
        hours >= 5 &&
        hours <= 19
      ) {
        setWeatherSvg(fewCloudsDay);
        setBackgroundImage(`url(${fewCloudsDayBg})`);
      } else if (
        weatherNow === "Clouds" &&
        (weatherNowId === 801 ||
          weatherNowId === 802 ||
          weatherNowId === 803) &&
        !(hours >= 5 && hours <= 19)
      ) {
        setWeatherSvg(fewCloudsNight);
        setBackgroundImage(`url(${fewCloudsNightBg})`);
      } else if (
        weatherNow === "Clouds" &&
        weatherNowId === 804 &&
        hours >= 5 &&
        hours <= 19
      ) {
        setWeatherSvg(cloudyDay);
        setBackgroundImage(`url(${cloudyDayBg})`);
      } else if (
        weatherNow === "Clouds" &&
        weatherNowId === 804 &&
        !(hours >= 5 && hours <= 19)
      ) {
        setWeatherSvg(cloudyNight);
        setBackgroundImage(`url(${cloudyNightBg})`);
      } else if (weatherNow === "Clear" && hours >= 5 && hours <= 19) {
        setWeatherSvg(clearDay);
        setBackgroundImage(`url(${clearDayBg})`);
      } else if (weatherNow === "Clear" && !(hours >= 5 && hours <= 19)) {
        setWeatherSvg(clearNight);
        setBackgroundImage(`url(${clearNightBg})`);
      } else if (weatherNow === "Rain" && hours >= 5 && hours <= 19) {
        setWeatherSvg(rainDay);
        setBackgroundImage(`url(${rainDayBg})`);
      } else if (weatherNow === "Rain" && !(hours >= 5 && hours <= 19)) {
        setWeatherSvg(rainNight);
        setBackgroundImage(`url(${rainNightBg})`);
      } else if (weatherNow === "Snow" && hours >= 5 && hours <= 19) {
        setWeatherSvg(snowDay);
        setBackgroundImage(`url(${snowDayBg})`);
      } else if (weatherNow === "Snow" && !(hours >= 5 && hours <= 19)) {
        setWeatherSvg(snowNight);
        setBackgroundImage(`url(${snowNightBg})`);
      }

      setData(jsonData);
      setTime(hours + ":" + minutes);
      setDay(day);
      setMonth(month);
      setYear(year);
      setDayOfWeek(dayOfWeek);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  const homeRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBlock = () => {
    if (homeRef.current) {
      homeRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleChange = (event) => {
    setGeo(event.target.value);
  };

  const renderData = () => {
    if (!data) {
      return null;
    }

    return (
      <>
        <div className="dash__left-wrapper">
          <div className="dash__left-date">
            <h3>
              {data.city.name}, {data.city.country}
            </h3>
            <h4>
              {dayOfWeek}, {day} {month} {year} г.
            </h4>
          </div>
          <div className="dash__left-time">
            <h3>{time}</h3>
          </div>
        </div>
        <div className="dash__left-temp-wrapper">
          <div className="dash__left-temp-values">
            <h1>{Math.round(data.list[0].main.temp)}ºc</h1>

            <div className="dash__left-temp-values-wrapper">
              <h3>
                {Math.round(currentTempMax)}ºc / {Math.round(currentTempMin)}ºc{" "}
              </h3>
              <h4>{data.list[0].weather[0].description}</h4>
            </div>
          </div>

          <div className="dash__left-temp-weather">
            <img src={weatherSvg} alt="" />
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div ref={homeRef} className="home__page">
        <div className="logo">
          <a href="#">
            <img src={logo} alt="" />
          </a>
        </div>
        <div className="search">
          <div className="container">
            <div className="search__inner">
              <div className="search__intro">
                <h1>
                  Добро пожаловать в <span>TypeWeather</span>
                </h1>
                <h3>Выберите место, чтобы увидеть прогноз погоды</h3>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Поиск местоположения"
                    value={geo}
                    onChange={handleChange}
                  />
                  <button type="submit" hidden></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={bottomRef} className="dash">
        <div className="dash-container">
          <div className="dash__inner">
            <div className="dash__left">
              <div className="dash__home">
                <a onClick={scrollToBlock}>
                  <img src={dashHome} alt="" />
                </a>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Поиск местоположения"
                    value={geo}
                    onChange={handleChange}
                  />
                  <button type="submit" hidden></button>
                </form>
              </div>
              <div className="dash__left-values">
                <div
                  className="dash-bg"
                  style={{ backgroundImage: backgroundImage }}
                >
                  {renderData()}
                </div>
              </div>
            </div>
            <div className="dash__right">
              <h3>Подробности о погоде</h3>
              <ul className="details__list">
                <li className="details__item">
                  <div className="details__item-text">
                    <img src={sunDimLight} alt="" />
                    <p>Тепловое ощущение</p>
                  </div>
                  <div className="details__item-value">
                    <h4>{Math.round(feelsLike)}ºc</h4>
                  </div>
                </li>
                <li className="details__item">
                  <div className="details__item-text">
                    <img src={thermometerSimpleLight} alt="" />
                    <p>Вероятность дождя</p>
                  </div>
                  <div className="details__item-value">
                    <h4>{Math.round(probabilityOfRain)}%</h4>
                  </div>
                </li>
                <li className="details__item">
                  <div className="details__item-text">
                    <img src={dropLight} alt="" />
                    <p>Скорость ветра</p>
                  </div>
                  <div className="details__item-value">
                    <h4>{Math.round(windSpeed)} м/c</h4>
                  </div>
                </li>
                <li className="details__item">
                  <div className="details__item-text">
                    <img src={cloudRainLight} alt="" />
                    <p>Влажность воздуха</p>
                  </div>
                  <div className="details__item-value">
                    <h4>{airHumidity}%</h4>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
