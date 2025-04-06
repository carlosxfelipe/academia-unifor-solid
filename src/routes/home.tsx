import Layout from "~/components/Layout";
import Heading from "~/components/Heading";
import Paragraph from "~/components/Paragraph";

export default function Home() {
  return (
    <Layout>
      <Heading level={1} color="text-blue-500 dark:text-blue-400">
        Bem-vindo a Início!
      </Heading>

      <Paragraph>Nisi minim et anim sint qui et proident cillum.</Paragraph>
    </Layout>
  );
}
