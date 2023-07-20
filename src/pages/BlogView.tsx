import { Box, Card, Grid } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import useTitle from "hooks/useTitle";
import { FC, useEffect, useState } from "react";
import { Pagination } from "react-bootstrap";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
}


const BlogView: FC = () => {
    useTitle("Blog");

    const [posts, setPosts] = useState<Post[]>([]);
    const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  // Number of posts to display per page
  const postsPerPage = 5;

  // Calculate the total number of pages based on the number of blog posts and posts per page
  const totalPages = Math.ceil(total/postsPerPage);

  // Slice the blog posts array based on the current page and posts per page
  const paginatedPosts = posts.slice(
    currentPage * postsPerPage,
    (currentPage + 1) * postsPerPage
  );


  useEffect(() => {
    // Fetch the published posts from the API
    fetchPublishedPosts(currentPage);
  }, [currentPage]);

  const fetchPublishedPosts = async (page: number) => {
    page ++;
    try {
        let offset = 0;
        if (page > 1) {
            offset = (page - 1) * postsPerPage;
        }
      const response = await fetch(
        `http://localhost:7000/api/v1/article/?status=publish&offset=${offset}&limit=${postsPerPage}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPosts(data.data);
      setTotal(data.meta.total);
    } catch (error) {
      console.error("Error fetching published posts:", error);
    }
  };

  const paginationStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  };

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  return (
    
    <Box pt={2} pb={4}>
      <Card sx={{ padding: 4 }}>
        <Grid container spacing={3}></Grid>
      {posts.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <p>Category: {post.category}</p>
          <hr />
        </div>
      ))}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-3">
            <Pagination>
              {Array.from({ length: totalPages }).map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index === currentPage}
                  onClick={() => handlePageChange(index)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </div>
        </Card>
    </Box>
  );
};

export default BlogView;
