import ReactSwagger from "./react-swagger";

export default async function IndexPage() {
  return (
    <section className="container">
      <ReactSwagger url="/swagger.yaml" />
    </section>
  );
}
