import AboutUs from "../Sections/aboutus";
import Banner from "../Sections/banner";
import Footer from "../Sections/footer";
import NavBars from "../Sections/navbar";
import Services from "../Sections/services";
import Services2 from "../Sections/services2";


function Home() {
  return (
    <div>
      <NavBars />
      <Banner />
      <AboutUs />
      <Services />
      <Services2 />
      <Footer />
      
    </div>
  );
}

export default Home;
