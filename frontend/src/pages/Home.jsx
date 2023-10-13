import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Input,
  Link,
  Pagination,
  Radio,
  RadioGroup,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import { toast } from "react-toastify";
import { HiOutlineMagnifyingGlass, HiOutlineNewspaper } from "react-icons/hi2";

import { CiLogout } from "react-icons/ci";

export default function Home() {
  const [newsData, setNewsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(newsData.length / itemsPerPage)
  );

  const [userPreferences, setUserPreferences] = useState({
    country: "",
    category: "",
  });

  const logout = () => {
    window.localStorage.removeItem("token");
    window.location.reload();
  };

  const handleRadioChange = (event) => {
    console.log("event name: ", event);
    const { name, value } = event.target;
    setUserPreferences({
      ...userPreferences,
      [name]: value,
    });
  };

  console.log(newsData);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filterNewsByCriteria = useCallback(() => {
    return newsData.filter((article) => {
      const { title, publishedAt, category, source } = article;
      return (
        (title && title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (publishedAt && publishedAt.includes(searchQuery)) ||
        (category &&
          category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (source &&
          source.name &&
          source.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [newsData, searchQuery]);

  function calculateTotalPages(filteredNews, itemsPerPage) {
    return Math.ceil(filteredNews.length / itemsPerPage);
  }

  const handleSavePreferences = async () => {
    try {
      await axios
        .post(
          "http://localhost:4000/user/preferences",
          {
            country: userPreferences.country,
            category: userPreferences.category,
          },
          {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        )
        .then((response) => {
          console.log(response);
          toast.success("Successfully updated user preferences", {
            theme: "light",
          });
        });
    } catch (error) {
      console.error("Error updating user preferences:", error);
      toast.error("Error updating user preferences", { theme: "light" });
    }
  };

  const filteredNews = filterNewsByCriteria(newsData, searchQuery);

  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:4000/user/preferences", {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setUserPreferences(response.data);
        setIsLoading(false);
      })
      .catch((preferencesError) => {
        setIsLoading(false);
        console.error("Error fetching user preferences:", preferencesError);
        toast.error("Preferences retrieval failed", { theme: "light" });
      });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (!userPreferences.country || !userPreferences.category) {
      return;
    }
    axios
      .post(
        "http://localhost:4000/topHeadlines",
        {
          country: userPreferences.country,
          category: userPreferences.category,
        },
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
  }, [userPreferences.country, userPreferences.category]);

  useEffect(() => {
    const updatedTotalPages = calculateTotalPages(filteredNews, itemsPerPage);
    setTotalPages(updatedTotalPages);
  }, [searchQuery, filteredNews, itemsPerPage]);

  return (
    <div className="h-screen bg-slate-300 flex flex-col font-spartan justify-center items-center text-center">
      <div className="flex w-full items-center">
        <div className="flex w-full justify-end">
          <h1 className="text-5xl font-bold text-white border bg-black p-5 m-10 rounded-lg">
            Newsio
          </h1>
        </div>
        <div className="p-3 flex w-3/5 justify-end">
          <Button
            color="danger"
            className="text-lg"
            startContent={<CiLogout size={25} />}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="flex flex-col bg-gray-400 rounded-2xl m-4 p-4">
        <div className="flex">
          <Card className="p-4 m-4">
            <RadioGroup
              label="Select your preferred country"
              color="secondary"
              value={userPreferences.country}
              name="country"
            >
              <Radio value="fr" onChange={handleRadioChange}>
                France
              </Radio>
              <Radio value="us" onChange={handleRadioChange}>
                United States
              </Radio>
              <Radio value="tr" onChange={handleRadioChange}>
                Türkiye
              </Radio>
            </RadioGroup>
          </Card>
          <Card className="p-4 m-4">
            <RadioGroup
              label="Select your preferred category"
              color="secondary"
              value={userPreferences.category}
              name="category"
            >
              <Radio value="science" onChange={handleRadioChange}>
                Science
              </Radio>
              <Radio value="sports" onChange={handleRadioChange}>
                Sports
              </Radio>
              <Radio value="health" onChange={handleRadioChange}>
                Health
              </Radio>
            </RadioGroup>
          </Card>
        </div>
        <div className="">
          <Button color="primary" onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </div>
      </div>
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
      {isLoading ? (
        <div className="h-screen bg-slate-300 flex justify-center items-center text-center">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4 p-3 mb-10">
          {currentNews.map((article, index) => {
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
          })}
        </div>
      )}
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
