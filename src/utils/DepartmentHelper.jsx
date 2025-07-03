


export const columns = [
  {
    name: "S. No",
    selector: (row) => row.sno,
    sortable: true,
  },
  {
    name: "Department Name",
    selector: (row) => row.dep_name,
    sortable: true,
  },
  {
  name: "Description",
  selector: (row) => row.description?.slice(0, 50) + "...", // limit to 50 chars
},

  {
    name: "Action",
    selector: (row) => row.action, // ✅ lowercase 'action'
  },
];

// Action Buttons Component
import { useNavigate } from "react-router-dom";
import axios from "axios";
export const DepartmentButtons = ({ id , onDepartmentDelete}) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    alert(id); // ✅ Alert only on click
    navigate(`/AdminDashbord/AdminDepartment/${id}`);
  };

  const handleDelete = async () => {
    // alert(`Deleting ID: ${id}`); // Optional: confirm before delete
      const confirm = window.confirm("do yo want delete department?" )
      if(confirm){
 try {
        const response = await axios.delete(`http://localhost:5000/v1/department/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          onDepartmentDelete(id)
          // setDepartment(response.data.department);
        } else {
          alert("Department not found.");
        }
      } catch (error) {
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        } else {
          alert("Error fetching department.");
        }
      }
 
    console.log("Delete", id);
      }
    // send delete request
  };

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button
        onClick={handleEdit}
        style={{
          padding: "6px 12px",
          backgroundColor: "#1d4ed8",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        style={{
          padding: "6px 12px",
          backgroundColor: "#dc2626",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
};
