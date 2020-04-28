import axios from 'axios';
import Fs from 'fs';
import Path from 'path';

const url = 'https://covid19.mathdro.id/api';
const newUrl = 'https://gnews.io/api/v3/search';
const GNEWS_TOKEN = '47358925e949cb12aea0c5d456bfeee1';
const SEARCH_KEYWORD = 'corona';
const DEFAULT_COUNTRY = 'in';
const COOKIE_EXP_HOUR = 2;
let savedArticles = [];

export const fetchNews = async () => {
  try {
    if (getCookie('fetchedNews') == null || getCookie('fetchedNews') == '') {
      let finalUrl = `${newUrl}?q=${SEARCH_KEYWORD}&token=${GNEWS_TOKEN}&country=${DEFAULT_COUNTRY}&image=required`;
      const { data : { articles } } = await axios.get(finalUrl);
      setCookie('fetchedNews', '1');
      saveNewsDataInCookie(articles);
      return articles;
    } else {
      const newsData = await getNewsDataFromCookie();
      return newsData;
    }
  } catch (error) {
      throw new Error(error);
  }
}
function getNewsDataFromCookie() {
  let savedArticles = [];
  let article = {};
  for (let i = 0; i <= 9; i++) {
    let newsData = JSON.parse(getCookie(`news_${i}`));
    savedArticles.push({description: newsData[0], image: newsData[1], publishedAt: newsData[2], title: newsData[3], url: newsData[4]});
  }
  return savedArticles;
}

const download = async () => {
  const url = 'https://images.gnews.io/4c25bb24222846ec3d1b41191c810057';
  const path = Path.resolve(__dirname, '../images/NewsCover', 'image.jpg');
  const response = await axios({
    method: 'GET',
    url: url,
    responseType: 'stream'
  });
  response.data.pipe(Fs.createWriteStream(path));
  return new Promise((resolve, reject) => {
    response.data.on('end', () => {
      resolve();
    })
    response.data.on('err', (err) => {
      reject(err);
    })
  })
}

function saveNewsDataInCookie(articles) {
  let count = 0;
  for (const{ description, image, publishedAt, title, url } of articles) {
    setCookie(`news_${count}`, JSON.stringify([description.split(" ").splice(0, 10).join(" "), image, publishedAt, title.split(" ").splice(0, 5).join(" "), url]));
    count++;
  }
}


export const fetchData = async (country) => {
  let changeableUrl = url;
  if (country) {
    changeableUrl = `${url}/countries/${country}`;
  }
  try {
    const { data : { confirmed, recovered, deaths, lastUpdate } } = await axios.get(changeableUrl);
    return { confirmed, recovered, deaths, lastUpdate };
  } catch (error) {
    throw new Error(error);
  }
}

export const fetchDailyData = async () => {
  try {
    const { data } = await axios.get(`${url}/daily`);
    const modifiedData = data.map((dailyData) => {
      return {
        confirmed: dailyData.confirmed.total,
        deaths: dailyData.deaths.total,
        date: dailyData.reportDate,
      }
    });
    return modifiedData;
  } catch (error) {
    throw new Error(error);
  }
}

export const countries = async () => {
  try {
    const { data : { countries } } = await axios.get(`${url}/countries`);
    return countries.map(country => country.name);
  } catch (error) {
    throw new Error(error);
  }
}

const setCookie = (cookie_name, cookie_value) => {
    let date = new Date();
    let expires;
    date.setTime(date.getTime() + COOKIE_EXP_HOUR * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = cookie_name + '=' + cookie_value + expires + '; path=/';
}

const getCookie = (name) => {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0)
            return null;
    } else
    {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    return decodeURI(dc.substring(begin + prefix.length, end));
}
