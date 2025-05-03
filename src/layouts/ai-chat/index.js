import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import AIChatComponent from "./AIChatComponent";

function AIChat() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <AIChatComponent />
      <Footer />
    </DashboardLayout>
  );
}

export default AIChat;
