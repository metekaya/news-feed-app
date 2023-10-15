export const logOut = () => {
  window.localStorage.removeItem("token");
  window.location.reload();
};

export const calculateTotalPages = (filteredNews, itemsPerPage) => {
  return Math.ceil(filteredNews.length / itemsPerPage);
};

export const filterNewsByCriteria = (data, query) => {
  return data.filter((article) => {
    const { title, publishedAt, source, author } = article;
    return (
      (title && title.toLowerCase().includes(query.toLowerCase())) ||
      (author && author.toLowerCase().includes(query.toLowerCase())) ||
      (publishedAt && publishedAt.includes(query)) ||
      (source && source && source.toLowerCase().includes(query.toLowerCase()))
    );
  });
};
