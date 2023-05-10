import { createBrowserRouter } from "react-router-dom";
import NewsPage from "./pages/NewsPage/NewsPage";
import NewsReviewPage from "./pages/NewsReviewPage/NewsReviewPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <NewsPage />,
  },
  {
    path: "/:newsId",
    element: <NewsReviewPage />,
  },
]);
