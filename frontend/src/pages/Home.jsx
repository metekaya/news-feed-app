import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { HiOutlineMagnifyingGlass } from "react-icons/hi2";
import { CiLogout } from "react-icons/ci";

import {
  Button,
  Card,
  Divider,
  Image,
  Input,
  Pagination,
  Radio,
  RadioGroup,
  Spinner,
} from "@nextui-org/react";

import AppLogo from "../assets/logo.png";
import {
  calculateTotalPages,
  filterNewsByCriteria,
  logOut,
} from "../utils/utils";
import { getPreferences, updatePreferences } from "../api/user";
import { getFilteredNews } from "../api/news";
import NewsCard from "../components/NewsCard";

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

  const handleRadioChange = (event) => {
    const { name, value } = event.target;
    setUserPreferences({
      ...userPreferences,
      [name]: value,
    });
  };

  const filterNews = useCallback(() => {
    return filterNewsByCriteria(newsData, searchQuery);
  }, [newsData, searchQuery]);

  const handleSavePreferences = () => {
    try {
      updatePreferences(userPreferences).then((response) => {
        toast.success("Successfully updated user preferences");
      });
    } catch (error) {
      toast.error("Something went wrong when updating user preferences");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const filteredNews = filterNews(newsData, searchQuery);
  const currentNews = filteredNews.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setIsLoading(true);
    getPreferences()
      .then((response) => {
        setUserPreferences(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Could not get user preferences.");
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
    getFilteredNews(userPreferences)
      .then((response) => {
        setNewsData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error("Something went wrong when retrieving news.");
      });
  }, [userPreferences]);

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
            <Image width={250} alt="app-logo" src={AppLogo} />
          </div>
          <Button
            color="default"
            variant="bordered"
            className="text-lg border-1 mr-4 hover:bg-gray-300 transition hover:duration-500"
            startContent={<CiLogout size={22} />}
            onClick={logOut}
          >
            Log out
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
                    return <NewsCard article={article} index={index} />;
                  })
                ) : (
                  <p>
                    Couldn't find any news related to search query or applied
                    filters.
                  </p>
                )}
              </div>
            )}
            <div className="flex flex-col justify-center items-center py-5">
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
