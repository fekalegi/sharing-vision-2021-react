import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Tab, styled } from "@mui/material";
import FlexBox from "components/FlexBox";
import PostListColumnShape from "components/post/columnShape";
import CustomTable from "components/userManagement/CustomTable";
import useTitle from "hooks/useTitle";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FormValues {
  title: string;
  content: string;
  category: string;
  status: string;
}

// styled component
const StyledFlexBox = styled(FlexBox)(({ theme }) => ({
  justifyContent: "flex-end",
  alignItems: "center",
  flexWrap: "wrap",
  marginBottom: 20,
  [theme.breakpoints.down(500)]: {
    width: "100%",
    "& .MuiInputBase-root": { maxWidth: "100%" },
    "& .MuiButton-root": {
      width: "100%",
      marginTop: 15,
    },
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  fontSize: 13,
  color: theme.palette.text.primary,
}));

const StyledTabList = styled(TabList)(({ theme }) => ({
  [theme.breakpoints.down(780)]: {
    width: "100%",
    "& .MuiTabs-flexContainer": {
      justifyContent: "space-between",
    },
    marginBottom: 20,
  },
  [theme.breakpoints.up("sm")]: {
    "& .MuiTabs-flexContainer": {
      minWidth: 200,
      justifyContent: "space-between",
    },
  },
}));

const StyledTabPanel = styled(TabPanel)(() => ({
  padding: 0,
}));


const PostList: FC = () => {
  // change navbar title
  useTitle("Post List");

  const [value, setValue] = useState("1");
  
  const handleChange = (_: SyntheticEvent, newValue: string) => {
    setFetching(true);
    setValue(newValue);
    setCurrentPage(1);
    fetchArticles(newValue);
  };

  const handleEditPost = (id: string) => {
    navigate(`/dashboard/edit-post/${id}`); // Navigate to EditPost page with the post id as a parameter
  };

  const handleFormDelete = async (
    values: FormValues,
    postId: string
  ) => {
    try {
      values.status = "thrash";
      // Your API POST call here
      const response = await fetch(`http://localhost:7000/api/v1/article/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Your form values
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Network response was not ok");
      }

      // Show success notification using react-toastify
      toast.success("Post moved to thrash successfully!");
      setFetching(true);
      setValue(value);
      setCurrentPage(1);
      fetchArticles(value);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post");
    }  finally {
    }
  };

  const navigate = useNavigate();
  const handleAddUser = () => navigate("/dashboard/add-post");

  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetching, setFetching] = useState(false); // Fetching data loading state

  useEffect(() => {
    fetchArticles("1");
  }, [currentPage]); // Fetch articles whenever the current page changes

  const fetchArticles = async (statusParam: string) => {
    try {
      if (statusParam === "1") {
        statusParam = "publish";
      } else if (statusParam === "2") {
        statusParam = "draft";
      } else if (statusParam === "3") {
        statusParam = "thrash";
      }
      const response = await fetch(
        `http://localhost:7000/api/v1/article/?limit=10&offset=${(currentPage - 1) * 10}&status=${statusParam}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setArticles(data.data);
      setTotalPages(Math.ceil(data.meta.total / 10));
      setLoading(false);
      setFetching(false);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setLoading(false);
      setFetching(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
    <ToastContainer position="top-right" />
    <Box pt={2} pb={4}>
      <TabContext value={value}>
        <StyledFlexBox>
        <FlexBox
            flexWrap="wrap"
            padding="0 2rem"
            alignItems="center"
            justifyContent="space-between"
          > 
          
          <StyledTabList onChange={handleChange}>
              <StyledTab label="Published" value="1" />
              <StyledTab label="Draft" value="2" />
              <StyledTab label="Thrash" value="3" />
            </StyledTabList>
            
        <Box paddingLeft={2}> {/* Add margin to create distance */}
      <Button variant="contained" onClick={handleAddUser}>
        Add New Post
      </Button>
    </Box>
            </FlexBox>
      </StyledFlexBox>


      <StyledTabPanel value="1">
      {fetching ? (
            <div>Loading data...</div> // Show loading message when fetching
          ) : (
            <CustomTable
              columnShape={PostListColumnShape({ onEdit: handleEditPost, onDelete: handleFormDelete })} // Pass the handleEditPost function as the onEdit prop
              data={articles}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </StyledTabPanel>
      <StyledTabPanel value="2">
          <CustomTable
            columnShape={PostListColumnShape({ onEdit: handleEditPost, onDelete: handleFormDelete })} // Pass the handleEditPost function as the onEdit prop
            data={articles}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </StyledTabPanel>
      <StyledTabPanel value="3">
          <CustomTable
            columnShape={PostListColumnShape({ onEdit: handleEditPost, onDelete: handleFormDelete })} // Pass the handleEditPost function as the onEdit prop
            data={articles}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </StyledTabPanel>
      </TabContext>
    </Box>
    </>
  );
};

export default PostList;
