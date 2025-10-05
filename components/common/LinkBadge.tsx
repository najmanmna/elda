"use client";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../Container";
import { Fragment } from "react";

// 👇 map your segments to nicer names
const segmentLabels: Record<string, string> = {
  status: "Status",

  hot: "Hot Products",
  new: "New Arrivals",
  sale: "On Sale",
  best: "Best Products",
  account: "Account",
};

const LinkBadge = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  // For account routes
  if (pathname.includes("/account/")) {
    const lastSegment = pathSegments[pathSegments.length - 1];

    return (
      <div className="bg-tech_white py-5">
        <Container className="flex items-center gap-2 text-sm">
          <Link
            href="/account/account"
            className="hover:text-tech_orange hoverEffect"
          >
            <Home size={17} />
          </Link>
          <span>/</span>
          <Link
            href={"/account/account"}
            className={`${
              lastSegment === "account" ? "text-tech_orange" : ""
            } hover:text-tech_orange hoverEffect`}
          >
            {segmentLabels["account"]}
          </Link>
          {lastSegment !== "account" && (
            <>
              <span>/</span>
              <span className="text-tech_orange capitalize">
                {segmentLabels[lastSegment] || lastSegment}
              </span>
            </>
          )}
        </Container>
      </div>
    );
  }

  // For all other routes
  if (pathSegments.length > 0) {
    return (
      <div className="bg-tech_white py-5">
        <Container className="flex items-center gap-2 text-sm">
          <Link href="/" className="hover:text-tech_orange hoverEffect">
            <Home size={17} />
          </Link>

          {pathSegments.map((segment, index) => {
            const label = segmentLabels[segment] || segment; // 👈 apply mapping
            return (
              <Fragment key={index}>
                <span>/</span>
                {index === pathSegments.length - 1 ? (
                  <span className="text-tech_orange capitalize">{label}</span>
                ) : (
                  <Link
                    href={`/${pathSegments.slice(0, index + 1).join("/")}`}
                    className="hover:text-tech_orange hoverEffect capitalize"
                  >
                    {label}
                  </Link>
                )}
              </Fragment>
            );
          })}
        </Container>
      </div>
    );
  }

  return null;
};

export default LinkBadge;
