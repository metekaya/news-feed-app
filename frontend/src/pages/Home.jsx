import { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
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
import { HiOutlineMagnifyingGlass } from "react-icons/hi2";

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
    apiSource: "",
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filterNewsByCriteria = useCallback(() => {
    return newsData.filter((article) => {
      const { title, publishedAt, source, author } = article;
      return (
        (title && title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (author && author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (publishedAt && publishedAt.includes(searchQuery)) ||
        (source &&
          source &&
          source.toLowerCase().includes(searchQuery.toLowerCase()))
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
            apiSource: userPreferences.apiSource,
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
    if (
      !userPreferences.country ||
      !userPreferences.category ||
      !userPreferences.apiSource
    ) {
      return;
    }
    axios
      .post(
        "http://localhost:4000/merged-news",
        {
          country: userPreferences.country,
          category: userPreferences.category,
          apiSource: userPreferences.apiSource,
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
  }, [
    userPreferences.country,
    userPreferences.category,
    userPreferences.apiSource,
  ]);

  useEffect(() => {
    const updatedTotalPages = calculateTotalPages(filteredNews, itemsPerPage);
    setTotalPages(updatedTotalPages);
    if (currentPage > updatedTotalPages) {
      setCurrentPage(1);
    }
  }, [searchQuery, filteredNews, itemsPerPage, currentPage]);

  return (
    <div className="h-screen flex flex-col font-spartan">
      <div className="flex-1 bg-blue-100/60 h-[120px]">
        <div className="flex justify-between items-center px-2 py-3">
          <div className="basis-4/12 xl:basis-3/12 2xl:basis-2/12 flex justify-center">
            <Image width={250} alt="app-logo" src="logo.png" />
          </div>
          <Button
            color="default"
            variant="bordered"
            className="text-lg border-1 mr-4 hover:bg-gray-300 transition hover:duration-500"
            startContent={<CiLogout size={22} />}
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row w-full h-full">
        <div className="basis-4/12 xl:basis-3/12 2xl:basis-2/12 bg-slate-100 border-t-1 border-gray-200 px-2">
          <p className="font-semibold md:text-2xl text-lg text-center pt-2 md:pt-5">
            Applied Filters
          </p>
          <Divider className="my-4 bg-gray-300/60 mt-2 md:mt-4" />
          <Card className="p-4 m-4">
            <RadioGroup
              label="Select your preferred language"
              color="primary"
              value={userPreferences.country}
              name="country"
            >
              <Radio value="en" onChange={handleRadioChange}>
                English
              </Radio>
              <Radio value="fr" onChange={handleRadioChange}>
                French
              </Radio>
              <Radio value="tr" onChange={handleRadioChange}>
                Turkish
              </Radio>
            </RadioGroup>
          </Card>
          <Card className="p-4 m-4">
            <RadioGroup
              label="Select your preferred category"
              color="primary"
              value={userPreferences.category}
              name="category"
              classNames={{ wrapper: "grid grid-cols-2" }}
            >
              <Radio value="science" onChange={handleRadioChange}>
                Science
              </Radio>
              <Radio value="sports" onChange={handleRadioChange}>
                Sports
              </Radio>
              <Radio
                value="entertainment"
                onChange={handleRadioChange}
                classNames={{
                  labelWrapper: "text-ellipsis overflow-hidden",
                }}
              >
                Entertainment
              </Radio>
              <Radio value="technology" onChange={handleRadioChange}>
                Technology
              </Radio>
              <Radio value="health" onChange={handleRadioChange}>
                Health
              </Radio>
              <Radio value="general" onChange={handleRadioChange}>
                General
              </Radio>
            </RadioGroup>
          </Card>
          <Card className="p-4 m-4">
            <RadioGroup
              label="Select your preferred news source"
              color="primary"
              value={userPreferences.apiSource}
              name="apiSource"
            >
              <Radio value="NewsAPI" onChange={handleRadioChange}>
                The NewsAPI
              </Radio>
              <Radio value="GuardianAPI" onChange={handleRadioChange}>
                The Guardian
              </Radio>
              <Radio value="all" onChange={handleRadioChange}>
                All sources
              </Radio>
            </RadioGroup>
          </Card>
          <div className="px-4 pb-3">
            <Button fullWidth color="primary" onClick={handleSavePreferences}>
              Save Preferences
            </Button>
          </div>
        </div>
        <div className="flex-1 border-1 border-gray-200 pt-6 relative">
          <div className="w-full px-5 md:w-[400px] lg:w-[700px] xl:w-[1000px] mb-5 md:absolute left-1/2 md:transform md:-translate-x-1/2 md:top-0 md:-translate-y-1/2">
            <Input
              type="text"
              placeholder="Search anything"
              labelPlacement="outside"
              startContent={<HiOutlineMagnifyingGlass />}
              size="lg"
              value={searchQuery}
              classNames={{ inputWrapper: "border-1 bg-gray-50" }}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-col h-full justify-between py-3 px-6 overflow-auto">
            {isLoading ? (
              <div className="flex h-full justify-center items-center text-center">
                <Spinner size="lg" color="primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {currentNews.length ? (
                  currentNews.map((article, index) => {
                    return (
                      <Card
                        key={index}
                        className="flex flex-row h-[160px] min-w-xs"
                      >
                        <Image
                          alt="news-image"
                          className="md:w-[300px] w-[150px] object-cover h-[150px] p-3 rounded-3xl max-w-[200px]"
                          src={
                            article.urlToImage
                              ? article.urlToImage
                              : "newspaper.png"
                          }
                        />
                        <CardBody className="flex pt-4 pb-3">
                          <p className="h-[100px] line-clamp-4 text-ellipsis overflow-hidden">
                            {article.title}
                          </p>
                          <div>
                            <Divider />
                            <Link
                              className="pt-1"
                              isExternal
                              href={article.url}
                              showAnchorIcon
                            >
                              Read more about it
                            </Link>
                          </div>
                        </CardBody>
                      </Card>
                    );
                  })
                ) : (
                  <p>
                    Couldn't find any news related to search query or applied
                    filters.
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col justify-center items-center pb-5">
              {newsData.length ? (
                <Pagination
                  size="lg"
                  total={totalPages}
                  onChange={(newPage) => {
                    setCurrentPage(newPage);
                  }}
                  initialPage={currentPage}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
