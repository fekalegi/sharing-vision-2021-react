import {
  alpha,
  Box,
  Button,
  Card,
  Grid,
  styled
} from "@mui/material";
import LightTextField from "components/LightTextField";
import { useFormik } from "formik";
import useTitle from "hooks/useTitle";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";


// styled components
const ButtonWrapper = styled(Box)(({ theme }) => ({
  width: 100,
  height: 100,
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.secondary[200]
      : alpha(theme.palette.primary[100], 0.1),
}));

interface FormValues {
  title: string;
  content: string;
  category: string;
  status: string;
}

const UploadButton = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  border: "2px solid",
  alignItems: "center",
  justifyContent: "center",
  borderColor: theme.palette.background.paper,
  backgroundColor:
    theme.palette.mode === "light"
      ? theme.palette.secondary[400]
      : alpha(theme.palette.background.paper, 0.9),
}));

const SwitchWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginTop: 10,
}));

const EditPost: FC = () => {
  const [loading, setLoading] = useState(true);
  
  const { id } = useParams<{id: string}>(); // Get the post id from the route params
  let idString:string = id as string;

  useEffect(() => {
    // Check if id is defined before calling fetchPostDetails
    if (id) {
      fetchPostDetails(id);
    }
  }, [id]);
  
  const fetchPostDetails = async (postId: string) => {
    try {
      const response = await fetch(`http://localhost:7000/api/v1/article/${postId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      // Update the form values with the retrieved post details
      setValues({
        title: data.data.title,
        content: data.data.content,
        category: data.data.category,
        status: data.data.status,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post details:", error);
      setLoading(false);
    }
  };

  const navigate = useNavigate();
  // change navbar title
  useTitle("Edit Post");

  const initialValues = {
    title: "",
    content: "",
    category: "",
    status: "",
  };

  const handleFormSubmit = async (
    values: FormValues,
    setStatus: (status?: any) => void,
    status: string, // Status will be either "publish" or "draft"
    postId: string
  ) => {
    try {
      values.status = status;
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
      toast.success("Post created successfully!");

      // Redirect to PostList after success
      navigate("/dashboard/post-list");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Error creating post");
    }  finally {
      setStatus({ isSubmitting: false }); // Use setStatus to set isSubmitting to false
    }
  };
  
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Name is Required!"),
    content: Yup.string().required("content is Required!"),
    category: Yup.string().required("category is Required!"),
  });

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    touched,
    isSubmitting,
    setStatus, // Add setStatus from formik
    setValues,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {}, // Empty onSubmit for now, we'll handle it differently for each button
  });


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box pt={2} pb={4}>
      <Card sx={{ padding: 4 }}>
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <Card sx={{ padding: 3, boxShadow: 2 }}>
              <form>
                <Grid container spacing={3}>
                <Grid item sm={6} xs={12}>
                    <LightTextField
                      fullWidth
                      name="title"
                      placeholder="Title"
                      value={values.title}
                      onChange={handleChange}
                      error={Boolean(touched.title && errors.title)}
                      helperText={touched.title && errors.title}
                    />
                  </Grid>

                  <Grid item sm={6} xs={12}>
                    <LightTextField
                      fullWidth
                      name="category"
                      placeholder="Category"
                      value={values.category}
                      onChange={handleChange}
                      error={Boolean(touched.category && errors.category)}
                      helperText={touched.category && errors.category}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <LightTextField
                      multiline
                      fullWidth
                      rows={10}
                      name="content"
                      placeholder="Content"
                      value={values.content}
                      onChange={handleChange}
                      error={Boolean(touched.content && errors.content)}
                      helperText={touched.content && errors.content}
                      sx={{
                        "& .MuiOutlinedInput-root textarea": { padding: 0 },
                      }}
                    />
                  </Grid>
                <Grid item xs={12}>
                <Button
                    type="submit"
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFormSubmit(values, setStatus, "publish", idString); // Handle form submit with status "publish"
                    }}
                    disabled={isSubmitting}
                  >
                    Publish
                  </Button>
                  {/* Add space between buttons */}
                  <Box sx={{ display: "inline-block", width: 16 }} />
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={(e) => {
                      e.preventDefault();
                      handleFormSubmit(values, setStatus, "draft", idString); // Handle form submit with status "draft"
                    }}
                    disabled={isSubmitting}
                  >
                    Draft
                  </Button>
                </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default EditPost;
