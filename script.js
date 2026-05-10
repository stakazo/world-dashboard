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

// =====================================
// CLOCK
// =====================================

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

      <div
        class="time"
        id="time-${index}"
      >
      </div>

      <div class="offset">
        日本との時差 ${item.offset}
      </div>
    `;

    clockGrid.appendChild(card);

  });

}

let baseTime =
  Date.now();

let performanceBase =
  performance.now();

function getAccurateNow(){

  return baseTime +
    (
      performance.now()
      - performanceBase
    );

}

function updateClockDiff(){

  const deviceNow =
    Date.now();

  const accurateNow =
    getAccurateNow();

  const diffMs =
    deviceNow - accurateNow;

  const diffSecRaw =
    Math.abs(diffMs / 1000);

  const diffSec =
    diffSecRaw.toFixed(1);

  const diffText =
    document.getElementById(
      "clock-diff"
    );

  if(diffSecRaw < 0.1){

    diffText.textContent =
      `お使いのデバイスの時計は正確です。`;

  }

  else if(diffMs > 0){

    diffText.textContent =
      `お使いのデバイスは ${diffSec} 秒遅れています。`;

  }

  else{

    diffText.textContent =
      `お使いのデバイスは ${diffSec} 秒進んでいます。`;

  }

}

function updateClocks(){

  const now =
    new Date(getAccurateNow());

  const tokyoTime =
    new Intl.DateTimeFormat(
      "ja-JP",
      {
        timeZone:"Asia/Tokyo",
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:false
      }
    ).format(now);

  const tokyoDate =
    new Intl.DateTimeFormat(
      "ja-JP",
      {
        timeZone:"Asia/Tokyo",
        year:"numeric",
        month:"long",
        day:"numeric",
        weekday:"long"
      }
    ).format(now);

  document.getElementById(
    "tokyo-time"
  ).textContent = tokyoTime;

  document.getElementById(
    "tokyo-date"
  ).textContent = tokyoDate;

  cities.forEach((item,index)=>{

    const time =
      new Intl.DateTimeFormat(
        "ja-JP",
        {
          timeZone:item.tz,
          hour:"2-digit",
          minute:"2-digit",
          second:"2-digit",
          hour12:false
        }
      ).format(now);

    document.getElementById(
      `time-${index}`
    ).textContent = time;

  });

}

createClockCards();

updateClocks();
updateClockDiff();

setInterval(updateClocks,1000);

// 誤差表示は1分ごと更新

setInterval(updateClockDiff,60000);

// =====================================
// CALENDAR
// =====================================

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

    const blank =
      document.createElement("div");

    calendarGrid.appendChild(blank);

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

    if(weekDay===0){

      el.style.color =
        "#ff8b8b";

    }

    if(weekDay===6){

      el.style.color =
        "#7db7ff";

    }

    if(holidayName){

      el.classList.add(
        "holiday"
      );

    }

    if(
      day===now.getDate()
      && month===now.getMonth()
    ){

      el.classList.add(
        "today"
      );

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

// =====================================
// WEATHER
// =====================================

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
    48:"🌫️ 着氷霧",

    51:"🌦️ 小雨",
    53:"🌦️ 雨",
    55:"🌧️ 強い雨",

    61:"🌧️ 雨",
    63:"🌧️ 強い雨",
    65:"⛈️ 豪雨",

    71:"❄️ 小雪",
    73:"❄️ 雪",
    75:"🌨️ 大雪",

    80:"🌦️ にわか雨",
    81:"🌧️ 強いにわか雨",
    82:"⛈️ 激しい雨",

    95:"⚡ 雷雨"

  };

  return weatherCodes[code]
    || "☁️ 不明";

}

async function loadWeather(){

  const weatherGrid =
    document.getElementById(
      "weather-grid"
    );

  weatherGrid.innerHTML = `

    <div style="
      grid-column:1/-1;
      text-align:center;
      padding:50px;
      opacity:0.7;
    ">
      天気データ読み込み中...
    </div>

  `;

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

      const loc =
        result.loc;

      const data =
        result.data;

      const todayCode =
        data.daily.weathercode[0];

      const tomorrowCode =
        data.daily.weathercode[1];

      const card =
        document.createElement("div");

      card.className =
        "weather-card";

      card.innerHTML = `

        <div class="prefecture">
          ${loc.name}
        </div>

        <div class="weather-now">
          今日:
          ${weatherCodeToJP(todayCode)}
        </div>

        <div class="temp">
          最高
          ${Math.round(data.daily.temperature_2m_max[0])}°C
          /
          最低
          ${Math.round(data.daily.temperature_2m_min[0])}°C
        </div>

        <div class="tomorrow">

          <div class="tomorrow-title">
            明日の予報
          </div>

          <div>
            ${weatherCodeToJP(tomorrowCode)}
          </div>

          <div style="margin-top:8px;">
            最高
            ${Math.round(data.daily.temperature_2m_max[1])}°C
            /
            最低
            ${Math.round(data.daily.temperature_2m_min[1])}°C
          </div>

        </div>

      `;

      weatherGrid.appendChild(card);

    });

  }

  catch(error){

    console.error(error);

    weatherGrid.innerHTML = `

      <div style="
        grid-column:1/-1;
        text-align:center;
        padding:50px;
      ">
        天気データ取得失敗
      </div>

    `;

  }

}

loadWeather();