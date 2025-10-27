import * as React from "react";
import Header from "../components/header";
import Gallery from "../components/gallery";

const IndexPage = () => {
  return (
    <main style={{ backgroundColor: "#0f0f0f", minHeight: "200vh", color: "#fff" }}>
      <Header />

      <section>
        <Gallery />
      </section>
    </main>
  );
};

export default IndexPage;
