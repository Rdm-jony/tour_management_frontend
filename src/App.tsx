import { Outlet } from "react-router";
import CommonLayout from "./layout/commonLayout";

function App() {
  return (
    <CommonLayout>
      <Outlet />
    </CommonLayout>
  );
}

export default App;