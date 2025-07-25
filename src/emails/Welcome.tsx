import { Button, Html, Tailwind } from "@react-email/components";

export default function Welcome() {
  return (
    <Tailwind>
      <Html>
        <Button
          href="https://example.com"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded "
        >
          Click me
        </Button>
      </Html>
    </Tailwind>
  );
}
