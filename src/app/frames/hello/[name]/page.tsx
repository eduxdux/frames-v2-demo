import { Metadata } from "next";
import App from "~/app/app";

type Props = {
  params: Promise<{
    name: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { name } = await params;

  return {
    title: "Beautiful Sweaters",
    description: "A Beautiful Sweaters app",
    openGraph: {
      title: "Beautiful Sweaters",
      description: "A Beautiful Sweaters app",
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": `${process.env.NEXT_PUBLIC_HOST}/api/og?name=${name}`,
      "fc:frame:button:1": "Next",
      "fc:frame:post_url": `${process.env.NEXT_PUBLIC_HOST}/api/frame?name=${name}`,
    },
  };
}

export default async function HelloNameFrame() {
  return <App />;
}
