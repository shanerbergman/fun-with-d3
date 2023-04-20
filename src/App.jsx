import "./App.css";
import Layout from "./Components/Layout/Layout";
import Charts from "./Components/Charts/Charts";
function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <Layout>
        <Charts />
      </Layout>
    </div>
  );
}

export default App;
