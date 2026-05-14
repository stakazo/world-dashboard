function hideAllPages(){

  document
    .querySelectorAll(".page")
    .forEach(page=>{
      page.classList.remove("active");
    });

}

function showClock(){

  hideAllPages();

  document
    .getElementById("clock-page")
    .classList.add("active");

}

function showCalendar(){

  hideAllPages();

  document
    .getElementById("calendar-page")
    .classList.add("active");

}

function showWeather(){

  hideAllPages();

  document
    .getElementById("weather-page")
    .classList.add("active");

}

// THEME

function toggleTheme(){

  document.body.classList.toggle(
    "light-mode"
  );

  const isLight =
    document.body.classList.contains(
      "light-mode"
    );

  localStorage.setItem(
    "theme",
    isLight ? "light" : "dark"
  );

}

const savedTheme =
  localStorage.getItem("theme");

if(savedTheme === "light"){

  document.body.classList.add(
    "light-mode"
  );

}

// CLOCK

const cities = [

  {
    city:"ニューヨーク",
    country:"アメリカ",
    tz:"America/New_York",
    offset:"-13時間"
  },

  {
    city:"ロンドン",
    country:"イギリス",
    tz:"Europe/London",
    offset:"-8時間"
  },

  {
    city:"パリ",
    country:"フランス",
    tz:"Europe/Paris",
    offset:"-7時間"
  },

  {
    city:"ドバイ",
    country:"UAE",
    tz:"Asia/Dubai",
    offset:"-5時間"
  },

  {
    city:"シンガポール",
    country:"シンガポール",
    tz:"Asia/Singapore",
    offset:"-1時間"
  },

  {
    city:"ソウル",
    country:"韓国",
    tz:"Asia/Seoul",
    offset:"±0時間"
  },

  {
    city:"シドニー",
    country:"オーストラリア",
    tz:"Australia/Sydney",
    offset:"+1時間"
  }

];

const clockGrid =
  document.getElementById("clock-grid");

function createClockCards(){

  cities.forEach((item,index)=>{

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <div class="city-name">
        ${item.city}
      </div>

      <div class="country">
        ${item.country}
      </div>

      <div class="time" id="time-${index}">
      </div>

      <div class="offset">
        日本との時差 ${item.offset}
      </div>
    `;

    clockGrid.appendChild(card);

  });

}

function updateClocks(){

  const now = new Date();

  document.getElementById(
    "tokyo-time"
  ).textContent =
    now.toLocaleTimeString(
      "ja-JP",
      {
        timeZone:"Asia/Tokyo"
      }
    );

  document.getElementById(
    "tokyo-date"
  ).textContent =
    now.toLocaleDateString(
      "ja-JP",
      {
        timeZone:"Asia/Tokyo",
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
      }
    );

  document.getElementById(
    "clock-diff"
  ).textContent =
    "お使いのデバイスの時計は正確です。";

  cities.forEach((item,index)=>{

    const time =
      now.toLocaleTimeString(
        "ja-JP",
        {
          timeZone:item.tz
        }
      );

    document.getElementById(
      `time-${index}`
    ).textContent = time;

  });

}

createClockCards();

updateClocks();

setInterval(updateClocks,1000);

// CALENDAR

async function loadJapaneseHolidays(){

  const res =
    await fetch(
      "https://holidays-jp.github.io/api/v1/date.json"
    );

  return await res.json();

}

async function createCalendar(){

  const holidays =
    await loadJapaneseHolidays();

  const now = new Date();

  const year =
    now.getFullYear();

  const month =
    now.getMonth();

  const firstDay =
    new Date(year,month,1).getDay();

  const lastDate =
    new Date(year,month+1,0).getDate();

  document.getElementById(
    "calendar-title"
  ).textContent =
    `${year}年 ${month+1}月`;

  const calendarGrid =
    document.getElementById(
      "calendar-grid"
    );

  calendarGrid.innerHTML = "";

  const weekNames =
    ["日","月","火","水","木","金","土"];

  weekNames.forEach(day=>{

    const el =
      document.createElement("div");

    el.className = "day-name";

    el.textContent = day;

    calendarGrid.appendChild(el);

  });

  for(let i=0;i<firstDay;i++){

    calendarGrid.appendChild(
      document.createElement("div")
    );

  }

  for(let day=1;day<=lastDate;day++){

    const date =
      new Date(year,month,day);

    const weekDay =
      date.getDay();

    const dateStr =
      `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    const holidayName =
      holidays[dateStr];

    const el =
      document.createElement("div");

    el.className = "day";

    if(holidayName){

      el.classList.add("holiday");

    }

    if(
      day===now.getDate()
    ){

      el.classList.add("today");

    }

    if(weekDay===0){

      el.style.color="#ff8b8b";

    }

    if(weekDay===6){

      el.style.color="#7db7ff";

    }

    el.innerHTML = `
      <div>${day}</div>
      ${
        holidayName
        ? `<small>${holidayName}</small>`
        : ""
      }
    `;

    calendarGrid.appendChild(el);

  }

}

createCalendar();

// WEATHER

const locations = [

  {
    name:"東京",
    lat:35.6809591,
    lon:139.7673068
  },

  {
    name:"大阪",
    lat:34.702485,
    lon:135.495951
  },

  {
    name:"名古屋",
    lat:35.1815,
    lon:136.9066
  },

  {
    name:"札幌",
    lat:43.061771,
    lon:141.354451
  },

  {
    name:"福岡",
    lat:33.590355,
    lon:130.401716
  },

  {
    name:"沖縄",
    lat:26.212401,
    lon:127.680932
  }

];

function weatherCodeToJP(code){

  const weatherCodes = {

    0:"☀️ 快晴",

    1:"🌤️ 晴れ",
    2:"⛅ 曇り",
    3:"☁️ 曇天",

    45:"🌫️ 霧",
    48:"🌫️ 濃霧",

    51:"🌦️ 弱い霧雨",
    53:"🌦️ 霧雨",
    55:"🌧️ 強い霧雨",

    56:"🌧️ 着氷性霧雨",
    57:"🌧️ 強い着氷性霧雨",

    61:"🌧️ 小雨",
    63:"🌧️ 雨",
    65:"🌧️ 大雨",

    66:"🌧️ 着氷性の雨",
    67:"🌧️ 強い着氷性の雨",

    71:"❄️ 小雪",
    73:"❄️ 雪",
    75:"❄️ 大雪",

    77:"❄️ 霧雪",

    80:"🌦️ にわか雨",
    81:"🌧️ 強いにわか雨",
    82:"⛈️ 激しいにわか雨",

    85:"🌨️ にわか雪",
    86:"❄️ 激しいにわか雪",

    95:"⚡ 雷雨",

    96:"⛈️ 雹を伴う雷雨",
    99:"⛈️ 激しい雷雨"

  };

  return weatherCodes[code]
    || `☁️ 天気コード:${code}`;

}

async function loadWeather(){

  const weatherGrid =
    document.getElementById(
      "weather-grid"
    );

  weatherGrid.innerHTML =
    "読み込み中...";

  try{

    const results =
      await Promise.all(

        locations.map(async(loc)=>{

          const res =
            await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia%2FTokyo`
            );

          const data =
            await res.json();

          return {
            loc,
            data
          };

        })

      );

    weatherGrid.innerHTML = "";

    results.forEach(result=>{

      const card =
        document.createElement("div");

      card.className =
        "weather-card";

      card.innerHTML = `

        <div class="prefecture">
          ${result.loc.name}
        </div>

        <div class="weather-now">
          今日:
          ${weatherCodeToJP(
            result.data.daily.weathercode[0]
          )}
        </div>

        <div class="temp">
          最高
          ${Math.round(
            result.data.daily.temperature_2m_max[0]
          )}°C
          /
          最低
          ${Math.round(
            result.data.daily.temperature_2m_min[0]
          )}°C
        </div>

      `;

      weatherGrid.appendChild(card);

    });

  }

  catch(error){

    weatherGrid.innerHTML =
      "天気データ取得失敗";

  }

}

loadWeather();