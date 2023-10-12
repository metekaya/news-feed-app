import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  Link,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-toastify";
import { HiOutlineMagnifyingGlass, HiOutlineNewspaper } from "react-icons/hi2";

export default function Home() {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(newsData.length / itemsPerPage)
  );

  console.log(newsData);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  function filterNewsByCriteria(news, query) {
    return news.filter((article) => {
      const { title, publishedAt, category, source } = article;
      console.log(category);
      return (
        (title && title.toLowerCase().includes(query.toLowerCase())) ||
        (publishedAt && publishedAt.includes(query)) ||
        (category && category.toLowerCase().includes(query.toLowerCase())) ||
        (source &&
          source.name &&
          source.name.toLowerCase().includes(query.toLowerCase()))
      );
    });
  }

  function calculateTotalPages(filteredNews, itemsPerPage) {
    return Math.ceil(filteredNews.length / itemsPerPage);
  }

  const filteredNews = filterNewsByCriteria(newsData, searchQuery);

  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    axios
      .post(
        "http://localhost:4000/topHeadlines",
        { country: "us", category: "sports" },
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setNewsData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.request.status === 400) {
          toast.error("Something went wrong.", { theme: "light" });
        }
      });
    // axios
    //   .get("http://localhost:4000/topHeadlines", {
    // headers: {
    //   Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    // },
    //   })
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     if (error.request.status === 400) {
    //       toast.error("Something went wrong.", { theme: "light" });
    //     }
    //   });
  }, []);

  useEffect(() => {
    const updatedTotalPages = calculateTotalPages(filteredNews, itemsPerPage);
    setTotalPages(updatedTotalPages);
  }, [searchQuery, filteredNews, itemsPerPage]);

  if (isLoading) {
    return <Spinner color="primary" />;
  }
  return (
    <div className="h-screen bg-slate-300 flex flex-col font-spartan justify-center items-center text-center">
      <h1 className="text-5xl font-bold text-white border bg-black p-5 m-10 rounded-lg">
        Home Page
      </h1>
      <div className="w-[700px] mb-5">
        <Input
          type="email"
          placeholder="Search anything"
          labelPlacement="outside"
          startContent={<HiOutlineMagnifyingGlass />}
          size="lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-5 gap-4 p-3 mb-10">
        {isLoading ? (
          <Spinner color="primary" />
        ) : (
          currentNews.map((article, index) => {
            return (
              <Card key={index} className="max-w-[400px] max-h-[800px]">
                <CardHeader className="flex gap-3 flex-row justify-center">
                  {article.urlToImage ? (
                    <Image
                      src={article.urlToImage}
                      width={300}
                      alt="news-image"
                      className="object-cover h-[150px]"
                    />
                  ) : (
                    <HiOutlineNewspaper size={150} color="gray" />
                  )}
                </CardHeader>
                <Divider />
                <CardBody>
                  <p className="h-[120px] line-clamp-5 text-ellipsis overflow-hidden">
                    {article.title}
                  </p>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Link isExternal showAnchorIcon href={article.url}>
                    Know more about it
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
      {/*
        <Button className="text-xl" color="primary">
          get news
        </Button> */}
      <Pagination
        size="lg"
        total={totalPages}
        onChange={(newPage) => {
          setCurrentPage(newPage);
        }}
        initialPage={currentPage}
      />
    </div>
  );
}
