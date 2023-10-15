import { Card, CardBody, Divider, Image, Link } from "@nextui-org/react";

export default function NewsCard({ article, index }) {
  return (
    <Card key={index} className="flex flex-row h-[160px] min-w-xs">
      <Image
        alt="news-image"
        className="md:w-[300px] w-[150px] object-cover h-[150px] p-3 rounded-3xl max-w-[200px]"
        src={article.urlToImage ? article.urlToImage : "newspaper.png"}
      />
      <CardBody className="flex pt-4 pb-3">
        <p className="h-[100px] line-clamp-4 text-ellipsis overflow-hidden">
          {article.title}
        </p>
        <div>
          <Divider />
          <Link className="pt-1" isExternal href={article.url} showAnchorIcon>
            Read more about it
          </Link>
        </div>
      </CardBody>
    </Card>
  );
}
