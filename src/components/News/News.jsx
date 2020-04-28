import React, { useState, useEffect } from 'react';
import { Card, CardActionArea, CardMedia, Typography, CardContent, makeStyles } from '@material-ui/core';
import { fetchNews } from '../../api';
import styles from './News.module.css';
import cx from 'classnames';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles({
    root: {
      maxWidth: 345,
    },
    media: {
      height: 140,
      width: '100%'
    },
});

const News = () => {
  const [fetchedNewsData, setNewsData] = useState([]);
  useEffect(() => {
    const fetchNewsAPI = async () => {
      setNewsData(await fetchNews());
    };
    fetchNewsAPI();
  }, [setNewsData]);
  const classes = useStyles();
  return (
    <div className={styles.Newscontainer}>
    <Typography gutterBottom variant="h5" component="h1" className={styles.centeralign}>
    News For You
    </Typography>
    {fetchedNewsData.map((news, i) =>
        (
          <Link key={i} href={news.url} target="_blank" rel="noopener" color="inherit" className={styles.newInlineBlock}>
            <Card className={cx(classes.root, styles.newsblock)}>
              <CardActionArea>
                <img data-src={news.image == null ? "" : news.image} className={cx(classes.media, 'lazyload')} alt={news.title}/>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {news.title.split(" ").splice(0, 5).join(" ")}...
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {news.description.split(" ").splice(0, 10).join(" ")}...
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {new Date(news.publishedAt).toDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        )
      )
    }
    </div>
  )
}

export default News;

// <CardMedia
//   component="img"
//   className={classes.media}
//   image={news.image == null ? "" : news.image}
//   title={news.title}
// />
