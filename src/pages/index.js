import * as React from "react";
import Header from "../components/header";

const IndexPage = () => {
  return (
    <main style={{ backgroundColor: "#0f0f0f", minHeight: "200vh", color: "#fff" }}>
      {/* Add the Header at the very top */}
      <Header />

      {/* Example hero section to show the scroll behavior */}
      <section style={{ paddingTop: "150px", textAlign: "center" }}>
        <h1>Welcome to the Site</h1>
        <p>Scroll down to see the header change.</p>
      </section>

      {/* Filler content for scrolling */}
      <section style={{ height: "100vh" }}></section>
    </main>
  );
};

export default IndexPage;
