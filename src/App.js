import React, { Component, lazy, Suspense } from 'react';
import { Cards, Charts, CountryPicker } from './components';
import styles from './App.module.css';
import { fetchData } from './api';
import CoronaImage from './images/corona.png';
const News = lazy(() => import('./components/News/News'));

class App extends Component {
  state = {
    data: {},
    country: ''
  }

  async componentDidMount() {
    this.loadLazyScript();
    const fetchedData = await fetchData();
    this.setState({ data: fetchedData });
  }

  loadLazyScript() {
    let script = document.createElement("script");
    script.async = true;
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/4.1.8/lazysizes.min.js";
    document.body.appendChild(script);
  }

  handleCountryChange = async (country) => {
     const fetchedCountryData = await fetchData(country);
     this.setState({ data: fetchedCountryData, country: country });
  }

  render() {
    const { data, country } = this.state;
    if (typeof data == 'undefined') {
      return 'Internet Disconnected...';
    }
    return (
        <div className={styles.container}>
          <img className={styles.image} src={CoronaImage} alt="COVID-19"/>
          <Cards data={data}/>
          <CountryPicker handleCountryChange={this.handleCountryChange}/>
          <Charts data={data} country={country}/>
          <Suspense fallback={<div>Loading...</div>}>
            <News />
          </Suspense>
        </div>
    );
  }
}

export default App;
