"use client";

type Props = {
  handleScroll: (id: string) => void;
};

export default function LandingNav({ handleScroll }: Props) {
  return (
    <nav className="hidden md:flex space-x-8">
      <button
        onClick={() => handleScroll("features")}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        기능
      </button>
      <button
        onClick={() => handleScroll("pricing")}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        가격
      </button>
      <button
        onClick={() => handleScroll("demo")}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        데모
      </button>
      <button
        onClick={() => handleScroll("faq")}
        className="text-gray-600 hover:text-gray-900 transition-colors"
      >
        FAQ
      </button>
    </nav>
  );
}
