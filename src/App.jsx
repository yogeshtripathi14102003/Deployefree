import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import AdminDashbord from "./pages/AdminDashbord";
import EmployeeDashbord from "./pages/EmployeeDashbord";
import PrivateRoute from "./utils/PrivateRoute";
import RoleBaseRoute from "./utils/RoleBaseRoute";
import AdminSummary from "./component/AdminSummary";
import AdminDepartment from "./component/AdminDepartment";
import AddDepartment from "./component/AddDepartment";
import EditDepartment from "./component/EditDeprtment";
import List from "./emplyee/List";
import Add from "./emplyee/Add";
import View from "./emplyee/View";
import Edit from "./emplyee/Edit";
import AddSalary from "./Salary/Add";
import ViewSalary from "./Salary/ViewSalary";
import EmpSummry from "./EmployeeDashbord/EmpSummry";
import Listleave from "./leave/Listleave";
import Pagenotfound from "./pages/Pagenotfound";
import AddLeave from "./leave/AddLeave";
import Setting from "./EmployeeDashbord/Setting";
import Table from "./leave/Table";
import PunchCard from "./Punchin/PunchCard";

import LeaveDeatil from "./leave/LeaveDeatil";
import Home from "./WebsitePage/Home";
import GetPunchingTable from "./Punchin/GetPunchingTable ";
import AllEmployee from "./emplyee/AllEmployee";
import AddEmployeeSalary from "./Salary/AddEmployeeSalary";
import GetallSalary from "./Salary/GetallSalary";
import ViewAllSalary from "./Salary/ViewAllSalary";
// import Setting from "./EmployeeDashbord/Setting";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/Home" element={<Home />}></Route>
          {/* <Route path="/" element={<Navigate to="/admin-dashbord" />}></Route> */}
          <Route path="login" element={<Login />}></Route>
          <Route
            path="/adminDashbord"
            element={
              <PrivateRoute>
                <RoleBaseRoute requiredRole={["admin"]}>
                  <AdminDashbord />
                </RoleBaseRoute>
              </PrivateRoute>
            }
          >
            <Route path="/adminDashbord" element={<AdminSummary />}>
              {" "}
            </Route>
            <Route
              path="/adminDashbord/AdminDepartment"
              element={<AdminDepartment />}
            >
              {" "}
            </Route>
            <Route
              path="/adminDashbord/AddDepartment"
              element={<AddDepartment />}
            >
              {" "}
            </Route>
            <Route
              path="/adminDashbord/AdminDepartment/:id"
              element={<EditDepartment />}
            />

            <Route path="/adminDashbord/employees" element={<List />} />
          </Route>
          <Route path="/adminDashbord/add-employees" element={<Add />} />
          <Route path="/adminDashbord/employees/:id" element={<View />}></Route>
          <Route
            path="/adminDashbord/employees/edit/:id"
            element={<Edit />}
          ></Route>
          <Route path="/adminDashbord/salary/add" element={<AddSalary />}>
            {" "}
          </Route>
           <Route path="/adminDashbord/salary/AddEmployeeSalary" element={<AddEmployeeSalary />}>
            {" "}
          </Route>
          <Route path="/adminDashbord/salary/GetallSalary" element={<GetallSalary />}>
            {" "}
          </Route>
          <Route path="/adminDashbord/salary/ViewAllSalary" element={<ViewAllSalary />}>
            {" "}
          </Route>
          <Route
            path="/adminDashbord/employees/salary/:id"
            element={<ViewSalary />}
          >
            {" "}
          </Route>
          <Route path="/adminDashbord/leaves" element={<Table />}>
            {" "}
          </Route>
          <Route
            path="/adminDashbord/employees/leaves/:id"
            element={<Listleave />}
          >
            
            {" "}
          </Route>
          <Route path="/adminDashbord/leaves/:id" element={<LeaveDeatil />}>
            {" "}
          </Route>
          <Route path="/adminDashbord/setting" element={<Setting />}>
            {" "}
          </Route>

          <Route
            path="/adminDashbord/getallpunching"
            element={<GetPunchingTable />}
          >
            {" "}
          </Route>
          <Route
            path="/admindashbord/employees/getallempoyee/:id"
            element={<AllEmployee />}
          >
            {" "}
          </Route>

          {/* starting  emp management  */}
          <Route
            path="/Employeedashbord"
            element={
              <PrivateRoute>
                <RoleBaseRoute requiredRole={["admin", "employee"]}>
                  <EmployeeDashbord />
                </RoleBaseRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<EmpSummry />} />
            <Route path="profile/:id" element={<View />} />
            <Route path="leaves/:id" element={<Listleave />} />
            <Route path="Add-leaves" element={<AddLeave />}></Route>
            <Route path="salary/:id" element={<ViewSalary />}></Route>
            <Route path="setting" element={<Setting />}></Route>
            <Route path="Punching" element={<PunchCard />}>
              {" "}
            </Route>
          </Route>
          <Route path="*" element={<Pagenotfound />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
