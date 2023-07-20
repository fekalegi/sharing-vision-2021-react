import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FlexBox from "components/FlexBox";
import { H6, Small } from "components/Typography";

interface FormValues {
  title: string;
  content: string;
  category: string;
  status: string;
}

const PostListColumnShape = ({ onEdit,onDelete }: any) => [
  {
    Header: "Title",
    accessor: "title",
    minWidth: 200,
    Cell: ({ row }: any) => {
      const {  title } = row.original;
      return (
        <FlexBox alignItems="center">
          <FlexBox flexDirection="column" ml={1}>
            <H6 color="text.primary">{title}</H6>
          </FlexBox>
        </FlexBox>
      );
    },
  },
  {
    Header: "Category",
    accessor: "category",
    minWidth: 200,
    Cell: ({ value }: any) => (
      <Small
        sx={{
          borderRadius: 10,
          padding: ".2rem 1rem",
          color: "background.paper",
          backgroundColor: "#A798FF",
        }}
      >
        {value}
      </Small>
    ),
  },
  {
    Header: "Action",
    minWidth: 200,
    Cell: ({ row }: any) => { 
      const {  id,title,content,category,status } = row.original;
      const values = {
        title: title,
        content: content,
        category: category,
        status: status,
      };

      const isThrash = status === "Thrash";
      if (isThrash) return null;
      return (
        <FlexBox alignItems="center">
        <Small
        onClick={() => onEdit(id)}
          sx={{
            borderRadius: 10,
            padding: ".2rem 1rem",
            color: "background.paper",
            backgroundColor: "#A798FF",
            cursor: "pointer",
          }}
        >
          <EditIcon />
          &nbsp;Edit
        </Small>
            <Small
              onClick={() => onDelete(values, id)}
              sx={{
                borderRadius: 10,
                padding: ".2rem 1rem",
                color: "background.paper",
                backgroundColor: "#A798FF",
                marginLeft: "10px",
                cursor: "pointer",
              }}
            >
              <DeleteIcon />
              &nbsp;Delete
            </Small>
      </FlexBox>
      );
    },
  }
];

export default PostListColumnShape;
