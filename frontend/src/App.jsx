import GridMotion from "./blocks/Backgrounds/GridMotion/GridMotion";
import Header from "./components/Header";


function App() {
  return (
    <div>
      <Header/>
      <div className="sm:block hidden">
             <GridMotion  />
      </div>
    </div>
  );
}

export default App;


