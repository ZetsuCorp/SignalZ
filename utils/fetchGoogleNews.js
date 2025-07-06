const getRandomImage = (query) =>
  `https://source.unsplash.com/600x400/?${encodeURIComponent(query)}`;

return feed.items.slice(0, 10).map(item => {
  const image =
    item.mediaContent?.$.url ||
    item.enclosure?.url ||
    getRandomImage(item.title); // fallback based on title

  return {
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
    source: item.creator || "Google News",
    image,
  };
});
