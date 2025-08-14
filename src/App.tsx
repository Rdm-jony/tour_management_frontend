import { Outlet } from "react-router";
import CommonLayout from "./layout/CommonLayout";

function App() {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}

export default App;