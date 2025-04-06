import Nav from "~/components/Nav";
import Layout from "~/components/Layout";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";

export default function Home() {
  return (
    <>
      <Nav />
      <Layout>
        <Heading level={1}>Bem-vindo a Perfil!</Heading>

        <Paragraph>Nisi minim et anim sint qui et proident cillum.</Paragraph>
      </Layout>
    </>
  );
}
